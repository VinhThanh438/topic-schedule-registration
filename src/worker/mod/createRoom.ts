import { QueueService } from '@common/queue/queue.service';
import { DoneCallback, Job, Queue } from 'bull';
import logger from '@common/logger';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';
import { TopicScheduleRoomService } from '@common/topic-schedule-room/topic-schedule-room.service';
import { RoomService } from '@common/room/room.service';

export class CreateRoom {
    static async register(): Promise<Queue> {
        const queue = await QueueService.getQueue<unknown>(CREATE_ROOM_AFTER_CONFIRMATION);

        logger.info(`listening to queue ${CREATE_ROOM_AFTER_CONFIRMATION}`);

        const timeDelayToCleanJob = 5000;
        const jobStatus = 'delayed';

        await queue.clean(timeDelayToCleanJob, jobStatus);
        await queue.add({ job: CREATE_ROOM_AFTER_CONFIRMATION });
        await queue.process(CreateRoom.handler);

        return queue;
    }

    static async handler(job: Job, done: DoneCallback): Promise<void> {
        try {
            logger.debug(`processing queue ${CREATE_ROOM_AFTER_CONFIRMATION}`);

            if (job.data.schedule_room_id) {
                const data = await TopicScheduleRoomService.getConfirmedRoom(
                    job.data.schedule_room_id,
                );

                if (data) {
                    await RoomService.createRoom({ schedule_room_id: data.mod_schedule_id });

                    logger.info('Room created successfully!');
                } else {
                    logger.info('cannot create room, topic_schedule_room has been canceled!');
                }
            }

            done();
        } catch (error) {
            logger.error(error.message);
            done(error);
        }
    }
}
