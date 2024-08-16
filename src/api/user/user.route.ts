import express from 'express';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
const router = express.Router();

router.post('/create', UserController.createUser);

router.post('/schedule', UserMiddleware.checkDuplicateSchedule, UserController.userScheduled);

router.post('/cancel/schedule', UserController.cancelSchedule);

export default router;
