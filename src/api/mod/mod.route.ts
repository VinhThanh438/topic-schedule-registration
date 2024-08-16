import express from 'express';
import { ModController } from './mod.controller';
import { ModMiddleware } from './mod.middleware';
import { validate } from 'express-validation';
import { cancelSchedule, createModSchedule, handleTopicScheduleRoom } from './mod.validator';
const router = express.Router();

router.get('/online', ModController.getOnlines);

router.get(
    '/schedule/:userid/:modid',
    ModMiddleware.checkRemainingLessions,
    ModController.getModSchedules,
);

router.post(
    '/schedule',
    validate(createModSchedule, { context: true }),
    ModController.modScheduled,
);

router.post(
    '/topic-schedule-room/confirm',
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.confirmTopicScheduleRoom,
);

router.post(
    '/topic-schedule-room/cancel',
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.cancelTopicScheduleRoom,
);

router.post(
    '/schedule/cancel',
    validate(cancelSchedule, { context: true }),
    ModController.cancelModSchedule,
);

export default router;
