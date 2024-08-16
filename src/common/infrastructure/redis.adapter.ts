import logger from '@common/logger';
import { REDIS_URI } from '@config/environment';
import ioredis, { Redis } from 'ioredis';
import { QueueOptions } from 'bull';

export class RedisAdapter {
    private static client: Redis;

    private static subscriber: Redis;
    private static allClients: Redis[] = [];

    static async getClient(): Promise<Redis> {
        if (!RedisAdapter.client) {
            await RedisAdapter.connect();
        }
        return RedisAdapter.client;
    }

    static async connect(overrideClient = true, options = {}): Promise<Redis> {
        const tmp = new ioredis(REDIS_URI, {
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
            RedisAdapter.client = tmp;
        }
        RedisAdapter.allClients.push(tmp);
        return tmp;
    }

    static createClient(options = {}): Redis {
        const tmp = new ioredis(REDIS_URI, {
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

        RedisAdapter.allClients.push(tmp);

        return tmp;
    }

    static async getQueueOptions(): Promise<QueueOptions> {
        if (!RedisAdapter.subscriber) {
            RedisAdapter.subscriber = await RedisAdapter.connect(false, {
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
                        return RedisAdapter.client;
                    case 'subscriber':
                        return RedisAdapter.subscriber;
                    default:
                        return RedisAdapter.createClient({
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

    static async get(key: string, shouldDeserialize = false): Promise<unknown> {
        const value = await (await RedisAdapter.getClient()).get(key);
        return shouldDeserialize ? RedisAdapter.deserialize(value) : value;
    }

    static async set(
        key: string,
        value: unknown,
        ttl = 0,
        shouldSerialize = false,
    ): Promise<unknown> {
        const stringValue: string = shouldSerialize
            ? RedisAdapter.serialize(value)
            : (value as string);
        if (ttl > 0) {
            return (await RedisAdapter.getClient()).set(key, stringValue, 'EX', ttl);
        }
        return (await RedisAdapter.getClient()).set(key, stringValue);
    }

    static async delete(key: string): Promise<unknown> {
        return (await RedisAdapter.getClient()).del(key);
    }
}
