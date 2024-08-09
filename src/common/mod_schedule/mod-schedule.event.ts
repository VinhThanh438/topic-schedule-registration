import { EVENT_TOPIC_ROOM_CREATED } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import { IModScheduleEvent } from './mod-schedule.interface';
import { ModScheduleService } from './mod-schedule.service';

export class ModScheduleEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CREATED, ModScheduleEvent.handler);
    }

    public static async handler(data: IModScheduleEvent): Promise<void> {
        try {
            const modScheduleData = await ModScheduleService.updateModScheduleStatus({
                mod_schedule_id: data.mod_schedule_id,
            });

            if (!modScheduleData) logger.error('can not update mod schedule status!');
        } catch (error) {
            logger.error(error.message);
        }
    }
}
