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

export const updateGig = asyncWrapper(async (req: Request, res: Response) => {
  const gig = await gigsService.updateGig(req.params.id, req.user!.id, req.body)
  res.json(ApiResponse.success(gig, 'Gig updated'))
})

export const deleteGig = asyncWrapper(async (req: Request, res: Response) => {
  await gigsService.deleteGig(req.params.id, req.user!.id)
  res.json(ApiResponse.success(null, 'Gig cancelled'))
})

export const closeGig = asyncWrapper(async (req: Request, res: Response) => {
  const gig = await gigsService.closeGig(req.params.id, req.user!.id)
  res.json(ApiResponse.success(gig, 'Gig closed'))
})

export const saveGig = asyncWrapper(async (req: Request, res: Response) => {
  await gigsService.saveGig(req.params.id, req.user!.id)
  res.status(201).json(ApiResponse.success(null, 'Gig saved'))
})

export const unsaveGig = asyncWrapper(async (req: Request, res: Response) => {
  await gigsService.unsaveGig(req.params.id, req.user!.id)
  res.json(ApiResponse.success(null, 'Gig unsaved'))
})

export const getSavedGigs = asyncWrapper(async (req: Request, res: Response) => {
  const gigs = await gigsService.getSavedGigs(req.user!.id)
  res.json(ApiResponse.success(gigs, 'Saved gigs retrieved'))
})
