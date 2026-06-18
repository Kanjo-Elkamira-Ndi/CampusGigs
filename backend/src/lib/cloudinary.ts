import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export const uploadBuffer = (buffer: Buffer, folder: string, resourceType: 'image' | 'video' | 'auto' = 'image'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )
    upload.end(buffer)
  })
}

export default cloudinary
