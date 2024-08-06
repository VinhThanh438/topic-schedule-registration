import express from 'express';
import { UserController } from './user.controller';
import { UserMidleware } from './user.midleware';
const router = express.Router();

router.post('/create', UserController.createUser);

router.post(
    '/schedule',
    UserMidleware.checkRemainingLessions,
    UserMidleware.checkDuplicateSchedule,
    UserController.userScheduling,
);

export default router;
