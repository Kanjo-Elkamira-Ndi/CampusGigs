import { Request, Response } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ApiResponse } from '../utils/ApiResponse'
import * as categoriesService from '../services/categoriesService'

export const getCategories = asyncWrapper(async (_req: Request, res: Response) => {
  const categories = await categoriesService.listCategories()
  res.json(ApiResponse.success(categories, `${categories.length} categories retrieved`))
})

export const getCategoryBySlug = asyncWrapper(async (req: Request, res: Response) => {
  const category = await categoriesService.getCategoryBySlug(req.params.slug as string)
  if (!category) {
    return res.status(404).json(ApiResponse.error('Category not found'))
  }
  res.json(ApiResponse.success(category))
})
