import { EVENT_TOPIC_ROOM_CREATED } from '@common/constants/user-event.constant';
import eventBus from '@common/event-bus';
import { IUserEvent } from './user.interface';
import logger from '@common/logger';
import User from './User.model';

export class UserEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CREATED, UserEvent.handler);
    }

    public static async handler(data: IUserEvent): Promise<void> {
        try {
            await User.findOneAndUpdate(
                { _id: data.user_id },
                { $inc: { remaining_lessions: -1 } },
            );
        } catch (error) {
            logger.error(error.message);
        }
    }
}
