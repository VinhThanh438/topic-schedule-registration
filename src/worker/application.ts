import { ConnectDB } from '@common/infrastructure/mongo.adapter';
import { ConnectRedis } from '@common/infrastructure/redis.adapter';
import { WorkerServer } from './server';

export class Application {
    public static async createApp(): Promise<WorkerServer> {
        await ConnectDB.connect();

        await ConnectRedis.connect();

        const server = new WorkerServer();

        await server.setup();

        return;
    }
}
