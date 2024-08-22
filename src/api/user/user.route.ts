import express from 'express';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { validate } from 'express-validation';
import { userCanceled, userScheduled } from './user.validator';
import { AuthMiddleware } from '@api/auth/auth.middleware';
import { Role } from '@common/constants/role';

const router = express.Router();

router.post(
    '/schedule',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.USER]),
    validate(userScheduled, { context: true }),
    UserMiddleware.checkAvailableSchedule,
    UserMiddleware.checkDuplicateSchedule,
    UserController.userScheduled,
);

router.post(
    '/cancel/schedule',
    AuthMiddleware.requireAuth,
    AuthMiddleware.requirePermission([Role.USER]),
    validate(userCanceled, { context: true }),
    UserController.cancelSchedule,
);

export default router;
