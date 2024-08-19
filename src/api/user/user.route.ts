import express from 'express';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { validate } from 'express-validation';
import { userCanceled, userScheduled } from './user.validator';
import { Authentication } from '@api/auth/authen.middleware';
import { Authorization } from '@api/auth/authorize.middleware';
import { Role } from '@common/constants/role';
const router = express.Router();

router.post(
    '/schedule',
    validate(userScheduled, { context: true }),
    // Authentication.requireAuth,
    // Authorization.requirePermission([Role.USER]),
    UserMiddleware.checkAvailableSchedule,
    UserMiddleware.checkDuplicateSchedule,
    UserController.userScheduled,
);

router.post(
    '/cancel/schedule',
    validate(userCanceled, { context: true }),
    Authentication.requireAuth,
    Authorization.requirePermission([Role.USER]),
    UserController.cancelSchedule,
);

export default router;
