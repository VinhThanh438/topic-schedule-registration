import express from 'express'
import { ModController } from './mod.controller'
const router = express.Router()

router.post('/create', ModController.create)

export default router