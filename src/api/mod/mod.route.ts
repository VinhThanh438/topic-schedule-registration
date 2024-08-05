import express from 'express';
import { ModController } from './mod.controller';
const router = express.Router();

router.post('/create', ModController.create);

router.post('/schedule', ModController.modScheduling)

export default router;
