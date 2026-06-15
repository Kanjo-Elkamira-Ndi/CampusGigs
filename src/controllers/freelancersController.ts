import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import * as freelancersService from '../services/freelancersService'

export const listFreelancers = asyncWrapper(async (req: Request, res: Response) => {
  const result = await freelancersService.listFreelancers(req.query as never)
  res.json(
    ApiResponse.success(result, `${result.meta.total} freelancers retrieved`)
  )
})
