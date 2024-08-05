import { ExpressServer } from './server';
import { PORT } from '@config/environment';
import { ConnectDB } from '@common/infrastructure/mongo.adapter';

export class Application {
    public static async createApp(): Promise<ExpressServer> {
        await ConnectDB.connect();

        this.registerEvent();

        const expressServer = new ExpressServer();
        expressServer.setup(PORT);

        return expressServer;
    }

    public static registerEvent() {}
}
