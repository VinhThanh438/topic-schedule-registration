import { EVENT_TOPIC_ROOM_CANCELED } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import { IModCanceled } from './mod.interface';
import { ModService } from './mod.service';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CANCELED, ModEvent.modCanceledHandler);
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
}
