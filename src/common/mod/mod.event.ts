import { EVENT_ROOM_CONFIRMED } from '@common/constants/mod-event.constant';
import eventBus from '@common/event-bus';
import { IModConfirm } from './mod.interface';
import logger from '@common/logger';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_ROOM_CONFIRMED, ModEvent.roomConfirmhandler);
    }

    public static async roomConfirmhandler(data: IModConfirm): Promise<void> {
        try {
            console.log(data)
        } catch (error) {
            logger.error(error.message);
        }
    }
}
