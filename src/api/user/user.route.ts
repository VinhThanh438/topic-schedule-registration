import express from 'express';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { validate } from 'express-validation';
import { userCanceled, userScheduled } from './user.validator';
const router = express.Router();

router.post(
    '/schedule',
    validate(userScheduled, { context: true }),
    UserMiddleware.checkDuplicateSchedule,
    UserController.userScheduled,
);

router.post(
    '/cancel/schedule',
    validate(userCanceled, { context: true }),
    UserController.cancelSchedule,
);

export default router;
