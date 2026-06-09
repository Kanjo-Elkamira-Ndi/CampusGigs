import { Request } from 'express'

export const parsePagination = (query: Request['query']) => {
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, parseInt(query.limit as string) || 10)
  const skip = (page - 1) * limit
  return { page, limit, skip, take: limit }
}