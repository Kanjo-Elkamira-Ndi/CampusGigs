import bcrypt from 'bcryptjs'
import { queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import { signAccessToken, signRefreshToken, verifyRefreshToken, signResetToken, verifyResetToken } from '../lib/jwt'
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService'
import type { RegisterInput, LoginInput, ChangePasswordInput, ResetPasswordInput } from '../dto/authDto'

interface DbUser {
  id: string
  email: string
  name: string
  full_name: string
  role: string
  university_id: string | null
  avatar_url: string | null
  bio: string | null
  avg_rating: string
  review_count: number
  is_banned: boolean
  email_verified: boolean
  token_version: number
  created_at: string
  updated_at: string
  university_name?: string | null
  city?: string | null
  skills?: string[]
  hourly_rate?: string | null
  availability?: string | null
  experience_level?: string | null
  remote_available?: boolean
  hired_count?: number
  response_time?: string | null
  verified?: boolean
}

const formatUser = (u: DbUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  fullName: u.full_name,
  role: u.role,
  universityId: u.university_id,
  universityName: u.university_name ?? null,
  city: u.city ?? null,
  avatarUrl: u.avatar_url,
  bio: u.bio,
  avgRating: Number(u.avg_rating),
  reviewCount: u.review_count,
  isBanned: u.is_banned,
  emailVerified: u.email_verified,
  skills: u.skills ?? [],
  hourlyRate: u.hourly_rate ? Number(u.hourly_rate) : null,
  availability: u.availability ?? null,
  experienceLevel: u.experience_level ?? null,
  remoteAvailable: u.remote_available ?? false,
  hiredCount: u.hired_count ?? 0,
  responseTime: u.response_time ?? null,
  verified: u.verified ?? false,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
})

export async function register(data: RegisterInput) {
  const existing = await queryOne('SELECT id FROM users WHERE email = $1', [data.email])
  if (existing) throw new ApiError(409, 'Email already registered')

  const passwordHash = await bcrypt.hash(data.password, 12)
  const name = data.fullName.split(' ')[0] || data.fullName

  const result = await queryOne<{ id: string }>(
    `INSERT INTO users (email, name, full_name, password_hash, role, university_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [data.email, name, data.fullName, passwordHash, data.role, data.universityId]
  )

  if (!result) throw new ApiError(500, 'Failed to create user')

  const user = await queryOne<DbUser>(
    `SELECT u.id, u.email, u.name, u.full_name, u.role, u.university_id,
            u.avatar_url, u.bio, u.avg_rating, u.review_count,
            u.is_banned, u.email_verified, u.token_version, u.created_at, u.updated_at,
            u.skills, u.hourly_rate, u.availability, u.experience_level,
            u.remote_available, u.hired_count, u.response_time, u.verified,
            univ.name AS university_name, univ.city AS university_city
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     WHERE u.id = $1`,
    [result.id]
  )

  if (!user) throw new ApiError(500, 'Failed to create user')

  sendVerificationEmail(user.email).catch((err) =>
    console.error('Failed to send verification email:', err)
  )

  return {
    user: formatUser(user),
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role, tokenVersion: user.token_version }),
    refreshToken: signRefreshToken({ id: user.id }),
  }
}

export async function login(data: LoginInput) {
  const user = await queryOne<DbUser & { password_hash: string }>(
    `SELECT u.id, u.email, u.name, u.full_name, u.role, u.university_id,
            u.avatar_url, u.bio, u.avg_rating, u.review_count,
            u.is_banned, u.email_verified, u.token_version, u.created_at, u.updated_at,
            u.skills, u.hourly_rate, u.availability, u.experience_level,
            u.remote_available, u.hired_count, u.response_time, u.verified,
            univ.name AS university_name, univ.city AS university_city,
            u.password_hash
     FROM users u
     LEFT JOIN universities univ ON univ.id = u.university_id
     WHERE u.email = $1`,
    [data.email]
  )

  if (!user) throw new ApiError(401, 'Invalid email or password')
  if (user.is_banned) throw new ApiError(403, 'Your account has been banned')

  const valid = await bcrypt.compare(data.password, user.password_hash)
  if (!valid) throw new ApiError(401, 'Invalid email or password')

  return {
    user: formatUser(user),
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role, tokenVersion: user.token_version }),
    refreshToken: signRefreshToken({ id: user.id }),
  }
}

export async function verifyEmail(email: string): Promise<void> {
  const user = await queryOne('SELECT id FROM users WHERE email = $1', [email])
  if (!user) throw new ApiError(404, 'User not found')

  await queryOne('UPDATE users SET email_verified = true WHERE email = $1', [email])
}

export async function resendVerification(userId: string): Promise<void> {
  const user = await queryOne<{ email: string }>('SELECT email FROM users WHERE id = $1', [userId])
  if (!user) throw new ApiError(404, 'User not found')

  await sendVerificationEmail(user.email)
}

export async function logout(): Promise<void> {
  // Stateless logout — nothing to invalidate on the server
}

export async function changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
  const user = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId]
  )

  if (!user) throw new ApiError(404, 'User not found')

  const valid = await bcrypt.compare(data.currentPassword, user.password_hash)
  if (!valid) throw new ApiError(401, 'Current password is incorrect')

  const passwordHash = await bcrypt.hash(data.newPassword, 12)
  await queryOne('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId])
}

export async function deleteAccount(userId: string): Promise<void> {
  const user = await queryOne('SELECT id FROM users WHERE id = $1', [userId])
  if (!user) throw new ApiError(404, 'User not found')

  await queryOne('DELETE FROM users WHERE id = $1', [userId])
}

export async function refreshToken(refreshToken: string) {
  let decoded: { sub: string }
  try {
    decoded = verifyRefreshToken(refreshToken)
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token')
  }

  const user = await queryOne<{ id: string; email: string; role: string; token_version: number }>(
    'SELECT id, email, role, token_version FROM users WHERE id = $1',
    [decoded.sub]
  )

  if (!user) throw new ApiError(401, 'User not found')

  return {
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role, tokenVersion: user.token_version }),
    refreshToken: signRefreshToken({ id: user.id }),
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await queryOne<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
  if (!user) return

  const token = signResetToken(email)
  sendPasswordResetEmail(email, token).catch((err) =>
    console.error('Failed to send password reset email:', err)
  )
}

export async function resetPassword(data: ResetPasswordInput): Promise<void> {
  const email = verifyResetToken(data.token)

  const user = await queryOne<{ id: string }>('SELECT id FROM users WHERE email = $1', [email])
  if (!user) throw new ApiError(400, 'Invalid or expired reset token')

  const passwordHash = await bcrypt.hash(data.password, 12)
  await queryOne('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, email])
}

export async function signOutAll(userId: string): Promise<void> {
  await queryOne('UPDATE users SET token_version = token_version + 1 WHERE id = $1', [userId])
}
