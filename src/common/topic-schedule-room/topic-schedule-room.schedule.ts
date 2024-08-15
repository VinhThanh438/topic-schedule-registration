import logger from '@common/logger';
import TopicScheduleRoom from './Topic-schedule-room.model';
import schedule from 'node-schedule';
import { CRON_TIME } from '@common/constants/cron-job.constant';
import { RoomStatus } from './topic-schedule-room-status';
import { QueueService } from '@common/queue/queue.service';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';

export class TopicRoomSheduleJob {
    public static register() {
        logger.info('Processing schedule job: create room after mod confirmed');
        schedule.scheduleJob(CRON_TIME, this.handler); // schedule job every 5 minutes
    }

    public static async handler(): Promise<void> {
        try {
            const queue = await QueueService.getQueue(CREATE_ROOM_AFTER_CONFIRMATION);

            let getModConfirmed = await TopicScheduleRoom.find({
                status: RoomStatus.MOD_CONFIRMED,
            });

            if (!getModConfirmed) return;
            else {
                await TopicScheduleRoom.updateMany({
                    status: RoomStatus.MOD_CONFIRMED
                }, {
                    status: RoomStatus.SYSTEM_CONFIRMED
                })
                
                getModConfirmed.map((element) => {
                    queue.add({ schedule_room_id: element._id.toString()})
                });
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
