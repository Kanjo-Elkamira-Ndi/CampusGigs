import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import * as gigsService from '../services/gigsService'

export const listGigs = asyncWrapper(async (req: Request, res: Response) => {
  const result = await gigsService.listGigs(req.query as never)
  res.json(
    ApiResponse.success(result, `${result.meta.total} gigs retrieved`)
  )
})

export const getGigById = asyncWrapper(async (req: Request, res: Response) => {
  const gig = await gigsService.getGigById(req.params.id as string)
  res.json(ApiResponse.success(gig, 'Gig retrieved'))
})

export const createGig = asyncWrapper(async (req: Request, res: Response) => {
  const gig = await gigsService.createGig(req.body, req.user!.id)
  res.status(201).json(ApiResponse.success(gig, 'Gig created'))
})
