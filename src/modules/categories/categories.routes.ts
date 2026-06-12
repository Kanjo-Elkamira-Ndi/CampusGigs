import { Router } from 'express'
import * as categoriesController from './categories.controller'

const router = Router()

router.get('/', categoriesController.getCategories)
router.get('/:slug', categoriesController.getCategoryBySlug)

export default router
