import { EVENT_TOPIC_ROOM_CREATED } from '@common/constants/user-event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import ModSchedule from '@common/mod_schedule/Mod-schedule.model';
import { IModScheduleEvent } from './mod-schedule.interface';

export class ModScheduleEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CREATED, ModScheduleEvent.handler);
    }

    public static async handler(data: IModScheduleEvent): Promise<void> {
        try {
            const modScheduleData = await ModSchedule.findOneAndUpdate(
                { _id: data.mod_schedule_id },
                { is_available: false },
            );

            if (!modScheduleData) logger.error('can not update mod schedule status!');
        } catch (error) {
            logger.error(error.message);
        }
    }
}
