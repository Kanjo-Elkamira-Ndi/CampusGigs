import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ApiError } from '../utils/ApiError'

export const validate =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      throw new ApiError(422, 'Validation failed', result.error.flatten().fieldErrors as unknown[])
    }
    if (source === 'query') {
      Object.assign(req.query, result.data)
    } else {
      req[source] = result.data
    }
    next()
  }