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

        schedule.scheduleJob(CRON_TIME, this.handler);
    }

    public static async handler(): Promise<void> {
        try {
            const queue = await QueueService.getQueue(CREATE_ROOM_AFTER_CONFIRMATION);

            const currentTime = new Date();
            const offsetInMinutes = currentTime.getTimezoneOffset();
            const currentTimeAdjusted = new Date(
                currentTime.getTime() - offsetInMinutes * 60 * 1000,
            );

            let data = await TopicScheduleRoom.aggregate([
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
                { $unwind: '$mod_schedule' }, // parse data in mod_schedule field from array to object
                {
                    // conditions
                    $match: {
                        status: RoomStatus.MOD_CONFIRMED,
                        'mod_schedule.start_time': {
                            // start_time - 2 mins <= current time => start_time <= current_time + 2 mins
                            $lt: new Date(
                                new Date(
                                    currentTimeAdjusted.getTime() + 2 * 60 * 1000,
                                ).toISOString(),
                            ),
                        },
                    },
                },
            ]);

            // console.log(data);
            // console.log(
            //     'start_time: ',
            //     data[0].mod_schedule.start_time.getTime() - 7 * 60 * 60 * 1000 - 2 * 60 * 1000,
            //     data[0].mod_schedule.start_time,
            // );
            // console.log('current_time', currentTime.getTime(), currentTimeAdjusted);
            // console.log(
            //     new Date(new Date(currentTimeAdjusted.getTime() + 2 * 60 * 1000).toISOString()),
            // );

            if (data.length === 0) return;
            else {
                // add queue
                data.map(async (element) => {
                    await TopicScheduleRoom.findByIdAndUpdate(element._id, {
                        status: RoomStatus.SYSTEM_CONFIRMED,
                    });
                    queue.add({ schedule_room_id: element._id.toString() });
                });
            }
        } catch (error) {
            logger.error(error.message);
        }
    }
}
