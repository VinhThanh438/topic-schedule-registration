import express from 'express';
import { ModController } from './mod.controller';
import { ModMiddleware } from './mod.middleware';
import { validate } from 'express-validation';
import { cancelSchedule, createModSchedule, handleTopicScheduleRoom } from './mod.validator';
import { Authentication } from '@api/auth/authen.middleware';
import { Authorization } from '@api/auth/authorize.middleware';
import { Role } from '@common/constants/role';
const router = express.Router();

router.get('/online', ModController.getOnlines);

router.get(
    '/schedule/:userid/:modid',
    Authentication.requireAuth,
    Authorization.requirePermission([Role.USER]),
    ModMiddleware.checkRemainingLessions,
    ModController.getModSchedules,
);

router.post(
    '/schedule',
    validate(createModSchedule, { context: true }),
    Authentication.requireAuth,
    Authorization.requirePermission([Role.MOD]),
    ModController.modScheduled,
);

router.post(
    '/topic-schedule-room/confirm',
    validate(handleTopicScheduleRoom, { context: true }),
    Authentication.requireAuth,
    Authorization.requirePermission([Role.MOD]),
    ModController.confirmTopicScheduleRoom,
);

router.post(
    '/topic-schedule-room/cancel',
    validate(handleTopicScheduleRoom, { context: true }),
    Authentication.requireAuth,
    Authorization.requirePermission([Role.MOD]),
    ModController.cancelTopicScheduleRoom,
);

router.post(
    '/topic-schedule-room/cancel-confirmation',
    validate(handleTopicScheduleRoom, { context: true }),
    Authentication.requireAuth,
    Authorization.requirePermission([Role.MOD]),
    ModController.cancelConfirmation,
);

router.post(
    '/schedule/cancel',
    validate(cancelSchedule, { context: true }),
    Authentication.requireAuth,
    Authorization.requirePermission([Role.MOD]),
    ModController.cancelModSchedule,
);

export default router;
