import { Router } from 'express'
import { validate } from '../middleware/validate'
import { ListFreelancersSchema } from '../dto/freelancersDto'
import * as freelancersController from '../controllers/freelancersController'

const router = Router()

router.get('/', validate(ListFreelancersSchema, 'query'), freelancersController.listFreelancers)

export default router
