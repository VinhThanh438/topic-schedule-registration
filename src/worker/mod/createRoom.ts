import { QueueService } from '@common/queue/queue.service';
import { DoneCallback, Job, Queue } from 'bull';
import logger from '@common/logger';
import mongoose from 'mongoose';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';
import TopicScheduleRoom from '@common/topic-schedule-room/Topic-schedule-room.model';
import { RoomStatus } from '@common/topic-schedule-room/topic-schedule-room-status';
import Room from '@common/room/Room.model';
import { TopicScheduleRoomService } from '@common/topic-schedule-room/topic-schedule-room.service';
import { RoomService } from '@common/room/room.service';

export class CreateRoom {
    static async register(): Promise<Queue> {
        const queue = await QueueService.getQueue<unknown>(CREATE_ROOM_AFTER_CONFIRMATION);

        logger.info(`processing queue ${CREATE_ROOM_AFTER_CONFIRMATION}`);

        await queue.process(CreateRoom.handler);

        return queue;
    }

    static async handler(job: Job, done: DoneCallback): Promise<void> {
        try {
            const data = await TopicScheduleRoomService.getConfirmedRoom(job.data.schedule_room_id);

            if (data) {
                await RoomService.createRoom(job.data.schedule_room_id);

                logger.info('Room created successfully!');
            } else {
                logger.info('cannot create room, topic_schedule_room has been canceled!');
            }

            done();
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
