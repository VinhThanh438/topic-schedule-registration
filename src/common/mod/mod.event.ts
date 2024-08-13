import { EVENT_TOPIC_ROOM_CANCELED, EVENT_ROOM_CONFIRMED } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import { IModCanceled, IModConfirm } from './mod.interface';
import { QueueService } from '@common/queue/queue.service';
import { CREATE_ROOM_AFTER_CONFIRMATION } from '@common/constants/job.constant';
import generateDelayTime from '@common/utils/generate-delay-time';
import { ModService } from './mod.service';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CANCELED, ModEvent.modCanceledHandler);

        eventBus.on(EVENT_ROOM_CONFIRMED, ModEvent.roomConfirmedHandler);
    }

    // refund
    public static async modCanceledHandler(data: IModCanceled): Promise<void> {
        try {
            const check = await ModService.lessionRefund(data as IModCanceled);

            if (!check) logger.error('cannot update remaining_lessions. User not found!');
        } catch (error) {
            logger.error(error.message);
        }
    }

    public static async roomConfirmedHandler(data: IModConfirm): Promise<void> {
        try {
            const getQueue = await QueueService.getQueue(CREATE_ROOM_AFTER_CONFIRMATION);
            const startTime = data.start_time.toISOString();
            const delayTime = generateDelayTime(startTime);

            getQueue.add(
                { schedule_room_id: data.schedule_room_id },
                {
                    repeat: { cron: delayTime, limit: 1 },
                },
            );
        } catch (error) {
            logger.error(error.message);
        }
    }
}
