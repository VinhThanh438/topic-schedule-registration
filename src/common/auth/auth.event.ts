import { EVENT_LOGIN } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import logger from '@common/logger';
import { IAuthEvent } from './auth.interface';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';

export class AuthEvent {
    public static register(): void {
        eventBus.on(EVENT_LOGIN, AuthEvent.handler);
    }

    public static async handler(data: IAuthEvent): Promise<void> {
        try {
            await RedisAdapter.set(`RFT-${data.id}-${data.ip}`, data.refreshToken, 5000);
            logger.info('Refresh token has been stored in redis');
        } catch (error) {
            logger.error(error.message);
        }
    }
}
