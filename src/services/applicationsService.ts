import { query, queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import type { CreateApplicationInput } from '../dto/applicationsDto'

interface DbApplication {
  id: string
  gig_id: string
  worker_id: string
  cover_note: string
  status: string
  applied_at: string
}

interface DbApplicationWithWorker extends DbApplication {
  worker_name: string
  worker_full_name: string
  worker_avatar_url: string | null
  worker_bio: string | null
  worker_avg_rating: string | null
  worker_review_count: string
  worker_university_id: string | null
}

export const createApplication = async (
  gigId: string,
  workerId: string,
  data: CreateApplicationInput
) => {
  const gig = await queryOne<{ id: string; poster_id: string; status: string; slots: number }>(
    'SELECT id, poster_id, status, slots FROM gigs WHERE id = $1',
    [gigId]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.status !== 'OPEN') throw new ApiError(400, 'Gig is not open for applications')
  if (gig.poster_id === workerId) throw new ApiError(400, 'You cannot apply to your own gig')

  try {
    const [application] = await query<DbApplication>(
      `INSERT INTO applications (gig_id, worker_id, cover_note)
       VALUES ($1, $2, $3)
       RETURNING id, gig_id, worker_id, cover_note, status, applied_at`,
      [gigId, workerId, data.coverNote]
    )
    return {
      id: application.id,
      gigId: application.gig_id,
      workerId: application.worker_id,
      coverNote: application.cover_note,
      status: application.status,
      createdAt: application.applied_at,
    }
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      throw new ApiError(409, 'You have already applied to this gig')
    }
    throw err
  }
}

export const listGigApplications = async (gigId: string, posterId: string) => {
  const gig = await queryOne<{ id: string; poster_id: string }>(
    'SELECT id, poster_id FROM gigs WHERE id = $1',
    [gigId]
  )
  if (!gig) throw new ApiError(404, 'Gig not found')
  if (gig.poster_id !== posterId) throw new ApiError(403, 'You can only view applications for your own gigs')

  const rows = await query<DbApplicationWithWorker>(
    `SELECT
       a.id,
       a.gig_id,
       a.worker_id,
       a.cover_note,
       a.status,
       a.applied_at,
       u.name AS worker_name,
       u.full_name AS worker_full_name,
       u.avatar_url AS worker_avatar_url,
       u.bio AS worker_bio,
       u.avg_rating AS worker_avg_rating,
       u.review_count AS worker_review_count,
       u.university_id AS worker_university_id
     FROM applications a
     LEFT JOIN users u ON u.id = a.worker_id
     WHERE a.gig_id = $1
     ORDER BY a.applied_at DESC`,
    [gigId]
  )

  return rows.map(row => ({
    id: row.id,
    gigId: row.gig_id,
    workerId: row.worker_id,
    coverNote: row.cover_note,
    status: row.status,
    createdAt: row.applied_at,
    worker: {
      name: row.worker_name,
      fullName: row.worker_full_name,
      avatarUrl: row.worker_avatar_url,
      bio: row.worker_bio,
      avgRating: row.worker_avg_rating ? Number(row.worker_avg_rating) : null,
      reviewCount: Number(row.worker_review_count),
      universityId: row.worker_university_id,
    },
  }))
}
