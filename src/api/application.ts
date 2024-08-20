import { ExpressServer } from './server';
import { PORT } from '@config/environment';
import { DatabaseAdapter } from '@common/infrastructure/mongo.adapter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { UserEvent } from '@common/user/user.event';
import { ModEvent } from '@common/mod/mod.event';
import { TopicRoomSheduleJob } from '@common/topic-schedule-room/topic-schedule-room.schedule-job';
import { AuthEvent } from '@common/auth/auth.event';

export class Application {
    public static async createApp(): Promise<ExpressServer> {
        await DatabaseAdapter.connect();
        await RedisAdapter.connect();

        this.registerEvent();
        this.registerScheduleJob();

        const expressServer = new ExpressServer();
        expressServer.setup(PORT);

        return expressServer;
    }

    public static registerEvent() {
        UserEvent.register();
        ModEvent.register();
        AuthEvent.register();
    }

    public static registerScheduleJob() {
        TopicRoomSheduleJob.register();
    }
}
