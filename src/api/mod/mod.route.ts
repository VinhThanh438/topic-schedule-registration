import express from 'express';
import { ModController } from './mod.controller';
const router = express.Router();

router.post('/create', ModController.create);

router.get('/online', ModController.getOnlineMod);

router.post('/schedule', ModController.modScheduling);

// router.post('/confirm', ModController.modConfirmed);

// router.post('/cancel', ModController.modCanceled);

export default router;
