import { prisma } from '../../lib/prisma'
import { ApiError } from '../../utils/ApiError'
import { UpdateProfileInput } from './users.dto'

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { reviewsRecvd: { take: 5, orderBy: { createdAt: 'desc' } } }
  })
  if (!user) throw new ApiError(404, 'User not found')
  return user
}

export const updateProfile = async (id: string, data: UpdateProfileInput) => {
  return prisma.user.update({ where: { id }, data })
}