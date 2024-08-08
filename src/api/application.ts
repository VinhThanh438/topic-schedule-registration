import { ExpressServer } from './server';
import { PORT } from '@config/environment';
import { ConnectDB } from '@common/infrastructure/mongo.adapter';
import { ConnectRedis } from '@common/infrastructure/redis.adapter';
import { UserEvent } from '@common/user/user.event';
import { ModEvent } from '@common/mod/mod.event';
import { ModScheduleEvent } from '@common/mod_schedule/mod-schedule.event';

export class Application {
    public static async createApp(): Promise<ExpressServer> {
        await ConnectDB.connect();
        await ConnectRedis.connect();

        this.registerEvent();

        const expressServer = new ExpressServer();
        expressServer.setup(PORT);

        return expressServer;
    }

    public static registerEvent() {
        UserEvent.register();
        ModEvent.register();
        ModScheduleEvent.register();
    }
}
