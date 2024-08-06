import { EVENT_ROOM_CREATED } from "@common/constants/user-event.constant";
import eventBus from "@common/event-bus";
import { IUserEvent } from "./user.interface";
import logger from "@common/logger";

export class UserEvent {
    public static register() {
        eventBus.on(EVENT_ROOM_CREATED, UserEvent.handler);
    }

    public static async handler(data: IUserEvent): Promise<void> {
        try {
            console.log('hello')
        } catch (error) {
            logger.error(error.message);
        }
    }
}