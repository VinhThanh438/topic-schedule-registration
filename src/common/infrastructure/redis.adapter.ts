import logger from '@common/logger';
import { REDIS_URL } from '@config/environment';
import ioredis, { Redis } from 'ioredis';
import { QueueOptions } from 'bull';

export class ConnectRedis {
    static async connect(overrideClient = true, options = {}): Promise<Redis> {
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

    // static async getQueueOptions(): Promise<QueueOptions> {
    //     if (!ConnectRedis.subscriber) {
    //         ConnectRedis.subscriber = await ConnectRedis.connect(false, {
    //             maxRetriesPerRequest: null,
    //             enableReadyCheck: false,
    //         });
    //     }
    //     return {
    //         prefix: `${APP_NAME}:jobs:`,

    //         defaultJobOptions: {
    //             removeOnComplete: 1000,
    //             removeOnFail: 1000,
    //         },
    //         createClient: (type) => {
    //             switch (type) {
    //                 case 'client':
    //                     return RedisAdapter.client;
    //                 case 'subscriber':
    //                     return RedisAdapter.subscriber;
    //                 default:
    //                     return RedisAdapter.createClient({ maxRetriesPerRequest: null, enableReadyCheck: false });
    //             }
    //         },
    //     };
    // }
}
