import eventBus from '@common/event-bus';
import { IUserEvent } from './user.interface';
import logger from '@common/logger';

export class UserEvent {
    public static register() {}

    public static async Handler(data: IUserEvent): Promise<void> {
        try {
        } catch (error) {
            logger.error(error.message);
        }
    }
}
