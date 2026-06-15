import { query, queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import type { CreateReviewInput } from '../dto/applicationsDto'

interface DbReview {
  id: string
  gig_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string
  created_at: string
}

export const createReview = async (reviewerId: string, data: CreateReviewInput) => {
  const gig = await queryOne<{ id: string; status: string; poster_id: string }>(
    'SELECT id, status, poster_id FROM gigs WHERE id = $1',
    [data.gigId]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.status !== 'COMPLETED') throw new ApiError(400, 'Can only review completed gigs')

  if (data.revieweeId === reviewerId) throw new ApiError(400, 'You cannot review yourself')

  const isPoster = gig.poster_id === reviewerId
  if (!isPoster) {
    const application = await queryOne<{ id: string }>(
      `SELECT id FROM applications WHERE gig_id = $1 AND worker_id = $2 AND status = 'COMPLETED'`,
      [data.gigId, reviewerId]
    )
    if (!application) throw new ApiError(403, 'You are not authorized to review this gig')
  }

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM reviews WHERE gig_id = $1 AND reviewer_id = $2',
    [data.gigId, reviewerId]
  )
  if (existing) throw new ApiError(409, 'You have already reviewed this gig')

  const [review] = await query<DbReview>(
    `INSERT INTO reviews (gig_id, reviewer_id, reviewee_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, gig_id, reviewer_id, reviewee_id, rating, comment, created_at`,
    [data.gigId, reviewerId, data.revieweeId, data.rating, data.comment]
  )

  const agg = await queryOne<{ avg: string; count: string }>(
    'SELECT AVG(rating)::numeric(3,2) as avg, COUNT(*) as count FROM reviews WHERE reviewee_id = $1',
    [data.revieweeId]
  )

  if (agg) {
    await query(
      'UPDATE users SET avg_rating = $1, review_count = $2 WHERE id = $3',
      [agg.avg, Number(agg.count), data.revieweeId]
    )
  }

  const gigInfo = await queryOne<any>(
    `SELECT g.id, g.title, c.name AS category
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     WHERE g.id = $1`,
    [data.gigId]
  )

  const reviewerInfo = await queryOne<any>(
    `SELECT u.id, u.full_name, u.avatar_url, u.avg_rating, u.review_count,
            u.university_id, univ.name AS university_name, univ.city
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     WHERE u.id = $1`,
    [reviewerId]
  )

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at,
    gig: {
      id: gigInfo?.id ?? data.gigId,
      title: gigInfo?.title ?? '',
      category: gigInfo?.category ?? null,
    },
    reviewer: {
      id: reviewerInfo?.id ?? reviewerId,
      fullName: reviewerInfo?.full_name ?? '',
      avatarUrl: reviewerInfo?.avatar_url ?? null,
      universityId: reviewerInfo?.university_id ?? null,
      universityName: reviewerInfo?.university_name ?? null,
      city: reviewerInfo?.city ?? null,
      avgRating: Number(reviewerInfo?.avg_rating ?? 0),
      reviewCount: Number(reviewerInfo?.review_count ?? 0),
    },
  }
}
