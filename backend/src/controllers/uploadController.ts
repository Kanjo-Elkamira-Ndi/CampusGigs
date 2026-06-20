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

export const uploadChatImage = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  if (!req.file) throw new ApiError(400, 'No file provided')
  if (!req.file.buffer) throw new ApiError(400, 'File buffer is empty')

  if (!req.file.mimetype.startsWith('image/')) {
    throw new ApiError(400, 'Only image files are allowed')
  }

  let url: string
  try {
    url = await uploadBuffer(req.file.buffer, 'campus-gigs/chat/images')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    console.error('Cloudinary chat image upload failed:', message)
    throw new ApiError(500, `Image upload failed: ${message}`)
  }

  res.json(ApiResponse.success({ url }, 'Image uploaded'))
})

export const uploadChatVoice = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  if (!req.file) throw new ApiError(400, 'No file provided')
  if (!req.file.buffer) throw new ApiError(400, 'File buffer is empty')

  if (!req.file.mimetype.startsWith('audio/')) {
    throw new ApiError(400, 'Only audio files are allowed')
  }

  let url: string
  try {
    url = await uploadBuffer(req.file.buffer, 'campus-gigs/chat/voice', 'auto')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown upload error'
    console.error('Cloudinary voice upload failed:', message)
    throw new ApiError(500, `Voice upload failed: ${message}`)
  }

  res.json(ApiResponse.success({ url }, 'Voice message uploaded'))
})
