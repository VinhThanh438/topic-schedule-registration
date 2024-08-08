import { EVENT_MOD_CANCELED, EVENT_ROOM_CONFIRMED } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import User from '@common/user/User.model';
import { IModCanceled, IModConfirm } from './mod.interface';
import { QueueService } from '@common/queue/queue.service';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';
import getDelayTime from '@common/utils/get-delay-time';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_MOD_CANCELED, ModEvent.modCanceledHandler);

        eventBus.on(EVENT_ROOM_CONFIRMED, ModEvent.roomConfirmedHandler);
    }

    // refund
    public static async modCanceledHandler(data: IModCanceled): Promise<void> {
        try {
            await User.findOneAndUpdate(
                {
                    _id: data.user_id,
                },
                {
                    $inc: { remaining_lessions: 1 },
                },
            );
        } catch (error) {
            logger.error(error.message);
        }
    }

    public static async roomConfirmedHandler(data: IModConfirm): Promise<void> {
        try {
            const getQueue = await QueueService.getQueue(CREATE_ROOM_AFTER_CONFIRMATION);
            const startTime = data.start_time;
            const delayTime = getDelayTime(startTime);
            // console.log('start time: ', startTime)
            // console.log('current time: ', Date.now())
            // console.log('delay time', delayTime)
            // console.log('delay time before 2 minutes: ', (delayTime - (120 * 1000)))

            await getQueue.add(
                {
                    schedule_room_id: data.schedule_room_id,
                },
                { delay: delayTime - 120 * 1000 }, // check and create room 2 minutes before starting
            );
        } catch (error) {
            logger.error(error.message);
        }
    }
}
