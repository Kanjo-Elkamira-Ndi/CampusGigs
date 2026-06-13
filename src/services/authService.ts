import bcrypt from 'bcryptjs'
import { queryOne } from '../lib/db'
import { ApiError } from '../utils/ApiError'
import { signAccessToken, signRefreshToken } from '../lib/jwt'
import { sendVerificationEmail } from './emailService'
import type { RegisterInput, LoginInput } from '../dto/authDto'

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
  created_at: string
  updated_at: string
}

const formatUser = (u: DbUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  fullName: u.full_name,
  role: u.role,
  universityId: u.university_id,
  avatarUrl: u.avatar_url,
  bio: u.bio,
  avgRating: Number(u.avg_rating),
  reviewCount: u.review_count,
  isBanned: u.is_banned,
  emailVerified: u.email_verified,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
})

export async function register(data: RegisterInput) {
  const existing = await queryOne('SELECT id FROM users WHERE email = $1', [data.email])
  if (existing) throw new ApiError(409, 'Email already registered')

  const passwordHash = await bcrypt.hash(data.password, 12)
  const name = data.fullName.split(' ')[0] || data.fullName

  const user = await queryOne<DbUser>(
    `INSERT INTO users (email, name, full_name, password_hash, role, university_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, name, full_name, role, university_id,
               avatar_url, bio, avg_rating, review_count,
               is_banned, email_verified, created_at, updated_at`,
    [data.email, name, data.fullName, passwordHash, data.role, data.universityId]
  )

  if (!user) throw new ApiError(500, 'Failed to create user')

  sendVerificationEmail(user.email).catch((err) =>
    console.error('Failed to send verification email:', err)
  )

  return {
    user: formatUser(user),
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role }),
    refreshToken: signRefreshToken({ id: user.id }),
  }
}

export async function login(data: LoginInput) {
  const user = await queryOne<DbUser & { password_hash: string }>(
    `SELECT id, email, name, full_name, role, university_id,
            avatar_url, bio, avg_rating, review_count,
            is_banned, email_verified, created_at, updated_at,
            password_hash
     FROM users WHERE email = $1`,
    [data.email]
  )

  if (!user) throw new ApiError(401, 'Invalid email or password')
  if (user.is_banned) throw new ApiError(403, 'Your account has been banned')

  const valid = await bcrypt.compare(data.password, user.password_hash)
  if (!valid) throw new ApiError(401, 'Invalid email or password')

  return {
    user: formatUser(user),
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role }),
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
