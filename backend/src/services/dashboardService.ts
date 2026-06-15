import { query, queryOne } from '../lib/db'

export const getWorkerDashboard = async (userId: string) => {
  const stats = await queryOne<any>(
    `SELECT
       (SELECT COUNT(*) FROM applications WHERE worker_id = $1 AND status IN ('PENDING', 'ACCEPTED')) AS active_applications,
       (SELECT COUNT(*) FROM applications WHERE worker_id = $1 AND status = 'PENDING') AS awaiting_response,
       (SELECT COUNT(*) FROM applications WHERE worker_id = $1 AND status = 'COMPLETED') AS completed_gigs,
       (SELECT COUNT(*) FROM applications WHERE worker_id = $1 AND status = 'COMPLETED' AND updated_at >= NOW() - INTERVAL '30 days') AS monthly_completed,
       (SELECT COALESCE(SUM(g.budget), 0) FROM applications a JOIN gigs g ON g.id = a.gig_id WHERE a.worker_id = $1 AND a.status = 'COMPLETED') AS total_earned,
       (SELECT avg_rating FROM users WHERE id = $1) AS rating,
       (SELECT review_count FROM users WHERE id = $1) AS review_count`,
    [userId]
  )

  const recentApplications = await query<any>(
    `SELECT a.id, g.title AS gig_title, u.full_name AS poster_name, g.budget, a.status, c.name AS category
     FROM applications a
     JOIN gigs g ON g.id = a.gig_id
     JOIN users u ON u.id = g.poster_id
     LEFT JOIN categories c ON c.id = g.category_id
     WHERE a.worker_id = $1
     ORDER BY a.applied_at DESC
     LIMIT 5`,
    [userId]
  )

  const messages = await query<any>(
    `SELECT m.id, u.full_name AS sender_name, m.body AS preview, m.sent_at AS time,
            CASE WHEN m.sender_id != $1 THEN NOT m.read ELSE false END AS unread
     FROM messages m
     JOIN applications a ON a.id = m.application_id
     JOIN gigs g ON g.id = a.gig_id
     JOIN users u ON u.id = m.sender_id
     WHERE a.worker_id = $1
     ORDER BY m.sent_at DESC
     LIMIT 5`,
    [userId]
  )

  const weeklyActivity = await query<any>(
    `SELECT TO_CHAR(d.date, 'Dy') AS day, COALESCE(COUNT(a.id), 0) AS value
     FROM generate_series(
       DATE_TRUNC('week', NOW())::date,
       NOW()::date,
       '1 day'::interval
     ) d(date)
     LEFT JOIN applications a ON DATE(a.applied_at) = d.date AND a.worker_id = $1
     GROUP BY d.date
     ORDER BY d.date`,
    [userId]
  )

  const upcomingDeadline = await queryOne<any>(
    `SELECT g.title AS gig_title, g.deadline AS date_time, g.location
     FROM applications a
     JOIN gigs g ON g.id = a.gig_id
     WHERE a.worker_id = $1 AND a.status = 'ACCEPTED' AND g.deadline > NOW()
     ORDER BY g.deadline ASC
     LIMIT 1`,
    [userId]
  )

  return {
    stats: {
      activeApplications: Number(stats?.active_applications ?? 0),
      applicationsAwaitingResponse: Number(stats?.awaiting_response ?? 0),
      gigsCompleted: Number(stats?.completed_gigs ?? 0),
      monthlyGigsCompleted: Number(stats?.monthly_completed ?? 0),
      totalEarned: Number(stats?.total_earned ?? 0),
      rating: Number(stats?.rating ?? 0),
      reviewCount: Number(stats?.review_count ?? 0),
    },
    recentApplications: recentApplications.map((a: any) => ({
      id: a.id,
      gigTitle: a.gig_title,
      posterName: a.poster_name,
      budget: Number(a.budget),
      status: a.status,
      category: a.category,
    })),
    recentMessages: messages.map((m: any) => ({
      id: m.id,
      senderName: m.sender_name,
      preview: m.preview,
      time: m.time,
      unread: m.unread,
    })),
    weeklyActivity: weeklyActivity.map((d: any) => ({
      day: d.day,
      value: Number(d.value),
    })),
    upcomingDeadline: upcomingDeadline
      ? { gigTitle: upcomingDeadline.gig_title, dateTime: upcomingDeadline.date_time, location: upcomingDeadline.location }
      : null,
  }
}

export const getPosterDashboard = async (userId: string) => {
  const stats = await queryOne<any>(
    `SELECT
       (SELECT COUNT(*) FROM gigs WHERE poster_id = $1 AND status NOT IN ('CANCELLED', 'COMPLETED')) AS active_gigs,
       (SELECT COUNT(*) FROM gigs WHERE poster_id = $1 AND status = 'OPEN') AS open_gigs,
       (SELECT COUNT(*) FROM gigs WHERE poster_id = $1 AND status = 'IN_PROGRESS') AS in_progress_gigs,
       (SELECT COUNT(*) FROM applications a JOIN gigs g ON g.id = a.gig_id WHERE g.poster_id = $1 AND a.status = 'PENDING') AS new_applicants,
       (SELECT COUNT(*) FROM applications a JOIN gigs g ON g.id = a.gig_id WHERE g.poster_id = $1 AND a.status = 'ACCEPTED') AS applicants_to_review,
       (SELECT COUNT(*) FROM gigs WHERE poster_id = $1 AND status = 'COMPLETED') AS gigs_completed,
       (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r JOIN gigs g ON g.id = r.gig_id WHERE g.poster_id = $1 AND r.reviewee_id != $1) AS avg_worker_rating,
       (SELECT COUNT(*) FROM reviews r JOIN gigs g ON g.id = r.gig_id WHERE g.poster_id = $1) AS gigs_with_reviews`,
    [userId]
  )

  const postedGigs = await query<any>(
    `SELECT g.id, g.title, g.budget, g.status, c.name AS category,
            (SELECT COUNT(*) FROM applications WHERE gig_id = g.id) AS applicant_count
     FROM gigs g
     LEFT JOIN categories c ON c.id = g.category_id
     WHERE g.poster_id = $1
     ORDER BY g.created_at DESC
     LIMIT 5`,
    [userId]
  )

  const receivedReviews = await query<any>(
    `SELECT r.id, u.full_name AS reviewer_name, r.comment, r.rating
     FROM reviews r
     JOIN gigs g ON g.id = r.gig_id
     JOIN users u ON u.id = r.reviewer_id
     WHERE g.poster_id = $1 AND r.reviewee_id = $1
     ORDER BY r.created_at DESC
     LIMIT 5`,
    [userId]
  )

  const messages = await query<any>(
    `SELECT m.id, u.full_name AS sender_name, m.body AS preview, m.sent_at AS time,
            CASE WHEN m.sender_id != $1 THEN NOT m.read ELSE false END AS unread
     FROM messages m
     JOIN applications a ON a.id = m.application_id
     JOIN gigs g ON g.id = a.gig_id
     JOIN users u ON u.id = m.sender_id
     WHERE g.poster_id = $1
     ORDER BY m.sent_at DESC
     LIMIT 5`,
    [userId]
  )

  const weeklyPosts = await query<any>(
    `SELECT TO_CHAR(d.date, 'Dy') AS day, COALESCE(COUNT(g.id), 0) AS value
     FROM generate_series(
       DATE_TRUNC('week', NOW())::date,
       NOW()::date,
       '1 day'::interval
     ) d(date)
     LEFT JOIN gigs g ON DATE(g.created_at) = d.date AND g.poster_id = $1
     GROUP BY d.date
     ORDER BY d.date`,
    [userId]
  )

  const applicantsToReview = await query<any>(
    `SELECT a.id, u.full_name AS name, g.title AS gig_title,
            u.avg_rating AS rating, u.review_count AS review_count
     FROM applications a
     JOIN gigs g ON g.id = a.gig_id
     JOIN users u ON u.id = a.worker_id
     WHERE g.poster_id = $1 AND a.status = 'PENDING'
     ORDER BY a.applied_at DESC
     LIMIT 5`,
    [userId]
  )

  return {
    stats: {
      activeGigs: Number(stats?.active_gigs ?? 0),
      openGigs: Number(stats?.open_gigs ?? 0),
      inProgressGigs: Number(stats?.in_progress_gigs ?? 0),
      newApplicants: Number(stats?.new_applicants ?? 0),
      applicantsToReview: Number(stats?.applicants_to_review ?? 0),
      gigsCompleted: Number(stats?.gigs_completed ?? 0),
      avgWorkerRating: Number(stats?.avg_worker_rating ?? 0),
      gigsWithReviews: Number(stats?.gigs_with_reviews ?? 0),
    },
    postedGigs: postedGigs.map((g: any) => ({
      id: g.id,
      title: g.title,
      budget: Number(g.budget),
      applicantCount: Number(g.applicant_count),
      status: g.status,
      category: g.category,
    })),
    receivedReviews: receivedReviews.map((r: any) => ({
      id: r.id,
      reviewerName: r.reviewer_name,
      comment: r.comment,
      rating: Number(r.rating),
    })),
    recentMessages: messages.map((m: any) => ({
      id: m.id,
      senderName: m.sender_name,
      preview: m.preview,
      time: m.time,
      unread: m.unread,
    })),
    weeklyPosts: weeklyPosts.map((d: any) => ({
      day: d.day,
      value: Number(d.value),
    })),
    applicantsToReview: applicantsToReview.map((a: any) => ({
      id: a.id,
      name: a.name,
      gigTitle: a.gig_title,
      rating: Number(a.rating ?? 0),
      reviewCount: Number(a.review_count ?? 0),
    })),
  }
}
