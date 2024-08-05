import logger from '@common/logger';
import { REDIS_URL } from '@config/environment';
import ioredis, { Redis } from 'ioredis';

export class ConnectRedis {
    static async connect(): Promise<Redis> {
        const tmp = new ioredis(REDIS_URL);

        tmp.on('ready', () => {
            logger.info('Connect to redis successfully!');
        });
        tmp.on('end', () => {
            logger.info('Connect to redis ended!');
        });

        tmp.on('error', (error) => {
            logger.error('Can not connect to redis', error);
        });

        try {
            await tmp.connect();
        } catch (error) {
            logger.error(error.message);
        }

        return tmp;
    }
}
