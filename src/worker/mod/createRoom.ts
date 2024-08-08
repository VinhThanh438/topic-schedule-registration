import { QueueService } from '@common/queue/queue.service';
import { DoneCallback, Job, Queue } from 'bull';
import logger from '@common/logger';
import mongoose from 'mongoose';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';
import TopicScheduleRoom from '@common/topic-schedule-room/Tsr.model';
import { RoomStatus } from '@common/topic-schedule-room/tsr-status';
import Room from '@common/room/Room.model';

export class CreateRoom {
    static async register(): Promise<Queue> {
        const queue = await QueueService.getQueue<unknown>(CREATE_ROOM_AFTER_CONFIRMATION);

        logger.info(`processing queue ${CREATE_ROOM_AFTER_CONFIRMATION}`);

        await queue.process(CreateRoom.handler);

        return queue;
    }

    static async handler(job: Job, done: DoneCallback): Promise<void> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const data = await TopicScheduleRoom.find({
                _id: job.data.schedule_room_id,
                status: RoomStatus.CONFIRMED,
            });

            if (data) {
                await Room.create(
                    new Room({
                        schedule_room_id: job.data.schedule_room_id,
                    }),
                );

                await session.commitTransaction();
                session.endSession();

                logger.info('Room created successfully!');
            } else {
                logger.info('cannot create room, topic_schedule_room has been canceled!');
            }

            done();
        } catch (error) {
            session.abortTransaction().catch((err) => {
                logger.error(err.message);
                session.endSession();
                done(err);
            });
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
