import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'
import { uploadBuffer } from '../lib/cloudinary'
import { queryOne } from '../lib/db'

export const uploadAvatar = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthenticated')
  if (!req.file) throw new ApiError(400, 'No file provided')

  const url = await uploadBuffer(req.file.buffer, 'campus-gigs/avatars')

  await queryOne(
    'UPDATE users SET avatar_url = $1 WHERE id = $2',
    [url, req.user.id]
  )

  res.json(ApiResponse.success({ avatarUrl: url }, 'Avatar uploaded'))
})
