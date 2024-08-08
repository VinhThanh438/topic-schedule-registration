import { EVENT_ROOM_CONFIRMED } from '@common/constants/mod-event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import Mod from './Mod.model';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_ROOM_CONFIRMED, ModEvent.removeAvailableTime);
    }

    public static async removeAvailableTime(data: any): Promise<void> {
        try {
            // remove available time
            // const getModData = await Mod.findOne({ _id: data.mod_id  })
            // const newData = getModData.available_time.filter(item => item.time !== data.time);
        } catch (error) {
            logger.error(error.message);
        }
    }
}
