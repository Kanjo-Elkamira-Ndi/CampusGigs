import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { uploadBuffer } from '../lib/cloudinary'
import { queryOne } from '../lib/db'

export const uploadAvatar = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  if (!req.file) throw new ApiError(400, 'No file provided')
  if (!req.file.buffer) throw new ApiError(400, 'File buffer is empty')

  let url: string
  try {
    url = await uploadBuffer(req.file.buffer, 'campus-gigs/avatars')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    console.error('Cloudinary upload failed:', message)
    throw new ApiError(500, `Image upload failed: ${message}`)
  }

  await queryOne(
    'UPDATE users SET avatar_url = $1 WHERE id = $2',
    [url, req.user.id]
  )

  res.json(ApiResponse.success({ avatarUrl: url }, 'Avatar uploaded'))
})
