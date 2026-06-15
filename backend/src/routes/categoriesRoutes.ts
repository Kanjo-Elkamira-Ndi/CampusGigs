import { Router } from 'express'
import * as categoriesController from '../controllers/categoriesController'

const router = Router()

router.get('/', categoriesController.getCategories)
router.get('/:slug', categoriesController.getCategoryBySlug)

export default router
