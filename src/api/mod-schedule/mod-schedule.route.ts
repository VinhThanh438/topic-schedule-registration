import express from 'express';
// import { ModController } from './mod.controller';
const router = express.Router();

// router.post('/create', ModController.create);

// router.get('/online', ModController.getOnlineMod);

router.get('/schedule/:modid');

router.post('/schedule');

// router.post('/confirm/topic-schedule-room', ModController.modConfirmed);

// router.post('/cancel/topic-schedule-room', ModController.topicScheduleRoomCanceled);

router.post('/cancel/schedule');

export default router;
