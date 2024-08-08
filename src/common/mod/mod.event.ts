import { EVENT_MOD_CANCELED } from '@common/constants/mod-event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import User from '@common/user/User.model';
import { IModCanceled } from './mod.interface';

export class ModEvent {
    public static register() {
        eventBus.on(EVENT_MOD_CANCELED, ModEvent.modCanceledHandler)
    }

    // refund 
    public static async modCanceledHandler(req: IModCanceled): Promise<void> {
        try {
            await User.findOneAndUpdate({ 
                _id: req.user_id 
            }, {
                $inc: { remaining_lessions: 1 }
            })
        } catch (error) {
            logger.error(error.message)
        }
    }
}
