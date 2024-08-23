import logger from '@common/logger';
import TopicScheduleRoom from './Topic-schedule-room.model';
import schedule from 'node-schedule';
import { CRON_TIME } from '@common/constants/cron-job.constant';
import { RoomStatus } from './topic-schedule-room-status';
import { QueueService } from '@common/queue/queue.service';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';
import eventBus from '@common/event-bus';
import { EVENT_TOPIC_ROOM_CANCELED } from '@common/constants/event.constant';
import { getCurrentTimeAdjusted } from '@common/utils/get-current-time';

export class TopicRoomSheduleJob {
    public static register() {
        logger.info('Processing schedule job: create room after mod confirmed...');

        schedule.scheduleJob(CRON_TIME, this.topicRoomScheduleJobhandler);
    }

    private static async topicRoomScheduleJobhandler(): Promise<void> {
        try {
            // check and create room
            const queue = await QueueService.getQueue(CREATE_ROOM_AFTER_CONFIRMATION);

            const data = await TopicScheduleRoom.aggregate([
                {
                    // convert mod_schedule_id from string to object id
                    $addFields: {
                        mod_schedule_id: { $toObjectId: '$mod_schedule_id' },
                    },
                },
                {
                    $lookup: {
                        from: 'modschedules',
                        localField: 'mod_schedule_id',
                        foreignField: '_id',
                        as: 'mod_schedule',
                    },
                },
                { $unwind: '$mod_schedule' },
                // parse data in mod_schedule field from array to object
                {
                    // conditions
                    $match: {
                        status: { $in: [RoomStatus.MOD_CONFIRMED, RoomStatus.PENDING] },
                        'mod_schedule.start_time': {
                            // start_time - 2 mins < current time -> start_time < current_time + 2 mins
                            $lt: new Date(
                                new Date(
                                    getCurrentTimeAdjusted().getTime() + 2 * 60 * 1000,
                                ).toISOString(),
                            ),
                        },
                    },
                },
            ]);

            if (data.length === 0) return;
            else {
                // add queue
                data.map(async (element) => {
                    if (element.status === RoomStatus.MOD_CONFIRMED) {
                        await TopicScheduleRoom.findByIdAndUpdate(element._id, {
                            status: RoomStatus.SYSTEM_CONFIRMED,
                        });
                        queue.add({ schedule_room_id: element._id.toString() });
                    } else if (element.status === RoomStatus.PENDING) {
                        await TopicScheduleRoom.findByIdAndUpdate(element._id, {
                            status: RoomStatus.SYSTEM_CANCELED,
                        });
                        eventBus.emit(EVENT_TOPIC_ROOM_CANCELED, { user_id: element.user_id });
                    }
                });
            }

            // check and cancel pending
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }
}
