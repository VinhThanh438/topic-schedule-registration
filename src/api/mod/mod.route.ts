import express from 'express';
import { ModController } from './mod.controller';
import { ModMiddleware } from './mod.middleware';
import { validate } from 'express-validation';
import { cancelSchedule, createModSchedule, handleTopicScheduleRoom } from './mod.validator';
import { AuthMiddleware } from '@api/auth/auth.middleware';
import { Role } from '@common/constants/role';

const router = express.Router();

router.get('/online', ModController.getOnlines);

router.get(
    '/schedule/:modid',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.USER]),
    ModMiddleware.checkRemainingLessions,
    ModController.getModSchedules,
);

router.post(
    '/schedule',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.MOD]),
    validate(createModSchedule, { context: true }),
    ModController.modScheduled,
);

router.post(
    '/topic-schedule-room/confirm',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.MOD]),
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.confirmTopicScheduleRoom,
);

router.post(
    '/topic-schedule-room/cancel',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.MOD]),
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.cancelTopicScheduleRoom,
);

router.post(
    '/topic-schedule-room/cancel-confirmation',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.MOD]),
    validate(handleTopicScheduleRoom, { context: true }),
    ModController.cancelConfirmation,
);

router.post(
    '/schedule/cancel',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.MOD]),
    validate(cancelSchedule, { context: true }),
    ModController.cancelModSchedule,
);

export default router;
