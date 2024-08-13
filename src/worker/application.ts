import { DatabaseAdapter } from '@common/infrastructure/mongo.adapter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { WorkerServer } from './server';

export class Application {
    public static async createApp(): Promise<WorkerServer> {
        await DatabaseAdapter.connect();

        await RedisAdapter.connect();

        const server = new WorkerServer();

        await server.setup();

        return;
    }
}
