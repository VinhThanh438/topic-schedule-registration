import { EVENT_TOPIC_ROOM_CREATED } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import { IUserEvent } from './user.interface';
import logger from '@common/logger';
import { UserService } from './user.service';

export class UserEvent {
    public static register() {
        eventBus.on(EVENT_TOPIC_ROOM_CREATED, UserEvent.lessionRefundHandler);
    }

    public static async lessionRefundHandler(data: IUserEvent): Promise<void> {
        try {
            await UserService.updateRemainingLession({ user_id: data.user_id });
        } catch (error) {
            logger.error(error.message);
        }
    }
}
