import {
    EVENT_CANCEL_AFTER_CONFIRMATION,
    EVENT_MOD_CONFIRMED,
    EVENT_MOD_SCHEDULE_CANCELED,
    EVENT_MOD_SCHEDULED,
    EVENT_TOPIC_ROOM_CANCELED,
} from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import { IModCanceled, IModConfirm, IModScheduleCanceled, IModScheduling } from './mod.interface';
import { ModService } from './mod.service';
import TopicScheduleRoom from '@common/topic-schedule-room/Topic-schedule-room.model';
import { RoomStatus } from '@common/topic-schedule-room/topic-schedule-room-status';
import { ModScheduleService } from '@common/mod_schedule/mod-schedule.service';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CANCELED, ModEvent.modCanceledTopicScheduleRoomHandler);

        eventBus.on(EVENT_MOD_CONFIRMED, ModEvent.modConfirmedHandler);

        eventBus.on(EVENT_MOD_SCHEDULE_CANCELED, ModEvent.modScheduleCanceledHandler);

        eventBus.on(EVENT_CANCEL_AFTER_CONFIRMATION, ModEvent.modCancelAfterConfirmation);

        eventBus.on(EVENT_MOD_SCHEDULED, ModEvent.saveCachingData);
    }

    public static async saveCachingData(data: IModScheduling): Promise<void> {
        try {
            await ModService.saveCachingData(data);
        } catch (error) {
            logger.error(error.message);
        }
    }

    public static async modCanceledTopicScheduleRoomHandler(data: IModCanceled): Promise<void> {
        try {
            // Refund lession to the user
            await ModService.lessionRefund(data as IModCanceled);
        } catch (error) {
            logger.error(error.message);
        }
    }

    public static async modCancelAfterConfirmation(data: IModCanceled): Promise<void> {
        try {
            // Update is_available mod schedule
            const checkData = await ModScheduleService.updateAvailableSchedule(
                data as IModCanceled,
            );

            if (checkData) {
                // Refund lession to the user
                await ModService.lessionRefund(data as IModCanceled);
            } else {
                throw new Error('Cannot canceled!');
            }
        } catch (error) {
            logger.error(error.message);
        }
    }

    public static async modScheduleCanceledHandler(data: IModScheduleCanceled): Promise<void> {
        try {
            await ModService.modScheduleCanceledEvent(data as IModScheduleCanceled);
        } catch (error) {
            logger.error(error.message);
        }
    }

    // auto cancel
    public static async modConfirmedHandler(data: IModConfirm): Promise<void> {
        try {
            await TopicScheduleRoom.updateMany(
                {
                    mod_schedule_id: data.mod_schedule_id,
                    status: RoomStatus.PENDING,
                },
                {
                    status: RoomStatus.MOD_CANCELED,
                },
            );
        } catch (error) {
            logger.error(error.message);
        }
    }
}
