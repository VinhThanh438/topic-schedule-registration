import { EVENT_ROOM_CONFIRMED } from '@common/constants/mod-event.constant';
import eventBus from '@common/event-bus';
import { IModConfirm } from './mod.interface';
import logger from '@common/logger';
import Mod from './Mod.model';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_ROOM_CONFIRMED, ModEvent.removeAvailableTime);
    }

    public static async removeAvailableTime(data: any): Promise<void> {
        try {
            // delete available time
            console.log(data);
            const getModData = await Mod.findOne({ _id: data.mod_id  })
            console.log(getModData)

            // getModData.available_time.forEach((e) => {
            //     if (e.time === )
            // })
        } catch (error) {
            logger.error(error.message);
        }
    }
}
