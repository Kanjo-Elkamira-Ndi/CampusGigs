import { Request, Response } from 'express'
import { auth } from '../../lib/betterAuth'
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node'
import { asyncWrapper } from '../../utils/asyncWrapper'
import { ApiResponse } from '../../utils/ApiResponse'
import { ApiError } from '../../utils/ApiError'
import { prisma } from '../../lib/prisma'

// Better Auth handles sign-up and sign-in natively.
// These controllers handle extra business logic on top.

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session?.user) {
    throw new ApiError(401, 'No active session')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      fullName: true,
      role: true,
      universityId: true,
      avatarUrl: true,
      bio: true,
      avgRating: true,
      reviewCount: true,
      isBanned: true,
      emailVerified: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.json(ApiResponse.success(user, 'Session retrieved'))
})