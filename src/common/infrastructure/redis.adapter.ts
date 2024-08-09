import logger from '@common/logger';
import { REDIS_URL } from '@config/environment';
import ioredis, { Redis } from 'ioredis';
import { QueueOptions } from 'bull';

export class ConnectRedis {
    private static client: Redis;

    private static subscriber: Redis;
    private static allClients: Redis[] = [];

    static async getClient(): Promise<Redis> {
        if (!ConnectRedis.client) {
            await ConnectRedis.connect();
        }
        return ConnectRedis.client;
    }

    static async connect(overrideClient = true, options = {}): Promise<Redis> {
        const tmp = new ioredis(REDIS_URL, {
            lazyConnect: true,
            maxRetriesPerRequest: 10,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                if (times < 5) {
                    return delay;
                }
                process.exit(1);
            },
            ...options,
        });

        tmp.on('ready', () => {
            logger.info('Connect to redis successfully!');
        });
        tmp.on('end', () => {
            logger.info('Connect to redis ended!');
        });

        tmp.on('error', (error) => {
            logger.error('Connect to redis error!', error);
        });

        try {
            await tmp.connect();
        } catch (error) {
            logger.error('Connect to redis error!', error);
            process.exit(1);
        }

        if (overrideClient) {
            ConnectRedis.client = tmp;
        }
        ConnectRedis.allClients.push(tmp);
        return tmp;
    }

    static createClient(options = {}): Redis {
        const tmp = new ioredis(REDIS_URL, {
            maxRetriesPerRequest: 10,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                if (times < 5) {
                    return delay;
                }
                process.exit(1);
            },
            ...options,
        });

        tmp.on('ready', () => {
            logger.info('Connect to redis successfully!');
        });
        tmp.on('end', () => {
            logger.info('Connect to redis ended!');
        });

        tmp.on('error', (error) => {
            logger.error('Connect to redis error!', error);
            process.exit(1);
        });

        ConnectRedis.allClients.push(tmp);

        return tmp;
    }

    static async getQueueOptions(): Promise<QueueOptions> {
        if (!ConnectRedis.subscriber) {
            ConnectRedis.subscriber = await ConnectRedis.connect(false, {
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
            });
        }
        return {
            prefix: `Scheduling:jobs:`,

            defaultJobOptions: {
                removeOnComplete: 1000,
                removeOnFail: 1000,
            },
            createClient: (type) => {
                switch (type) {
                    case 'client':
                        return ConnectRedis.client;
                    case 'subscriber':
                        return ConnectRedis.subscriber;
                    default:
                        return ConnectRedis.createClient({
                            maxRetriesPerRequest: null,
                            enableReadyCheck: false,
                        });
                }
            },
        };
    }

    static serialize(value: unknown): string {
        if (value) {
            return JSON.stringify(value);
        }
        return value as string;
    }

    static deserialize(value: unknown): unknown {
        if (value && typeof value === 'string') {
            return JSON.parse(value);
        }
        return value;
    }
}
