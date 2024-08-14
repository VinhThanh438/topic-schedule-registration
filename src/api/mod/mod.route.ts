import express from 'express';
import { ModController } from './mod.controller';
import { ModMiddleware } from './mod.middleware';
const router = express.Router();

router.post('/create', ModController.createMod);

router.get('/online', ModController.getOnlines);

router.get(
    '/schedule/:userid/:modid',
    ModMiddleware.checkRemainingLessions,
    ModController.getModSchedules,
);

router.post('/schedule', ModController.modScheduled);

router.post('/confirm/topic-schedule-room', ModController.confirmTopicScheduleRoom);

router.post('/cancel/topic-schedule-room', ModController.cancelTopicScheduleRoom);

router.post('/cancel/schedule', ModController.cancelModSchedule);

export default router;
