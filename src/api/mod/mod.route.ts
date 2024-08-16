import express from 'express';
import { ModController } from './mod.controller';
import { ModMiddleware } from './mod.middleware';
import { validate } from 'express-validation';
import {
    cancelSchedule,
    createMod,
    createModSchedule,
    handleTopicScheduleRoom,
} from './mod.validator';
const router = express.Router();

router.post('/create', validate(createMod, { context: true }), ModController.createMod);

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
    '/confirm/topic-schedule-room',
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.confirmTopicScheduleRoom,
);

router.post(
    '/cancel/topic-schedule-room',
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.cancelTopicScheduleRoom,
);

router.post(
    '/cancel/schedule',
    validate(cancelSchedule, { context: true }),
    ModController.cancelModSchedule,
);

export default router;
