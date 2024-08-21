import { ExpressServer } from './server';
import { PORT } from '@config/environment';
import { DatabaseAdapter } from '@common/infrastructure/mongo.adapter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { UserEvent } from '@common/user/user.event';
import { ModEvent } from '@common/mod/mod.event';
import { TopicRoomSheduleJob } from '@common/topic-schedule-room/topic-schedule-room.schedule-job';
import { AuthEvent } from '@common/auth/auth.event';
import logger from '@common/logger';

export class Application {
    public static async createApp(): Promise<ExpressServer> {
        await DatabaseAdapter.connect();
        await RedisAdapter.connect();

        this.registerEvent();
        this.registerScheduleJob();

        const expressServer = new ExpressServer();
        expressServer.setup(PORT);
        Application.handleExit(expressServer);

        return expressServer;
    }

    /**
     * Register signal handler to graceful shutdown
     *
     * @param express Express server
     */
    private static handleExit(express: ExpressServer) {
        process.on('uncaughtException', (err: unknown) => {
            logger.error('Uncaught exception', err);
            Application.shutdownProperly(1, express);
        });
        process.on('unhandledRejection', (reason: unknown | null | undefined) => {
            logger.error('Unhandled Rejection at promise', reason);
            Application.shutdownProperly(2, express);
        });
        process.on('SIGINT', () => {
            logger.info('Caught SIGINT, exitting!');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('SIGTERM', () => {
            logger.info('Caught SIGTERM, exitting');
            Application.shutdownProperly(128 + 2, express);
        });
        process.on('exit', () => {
            logger.info('Exiting process...');
        });
    }

    /**
     * Handle graceful shutdown
     *
     * @param exitCode
     * @param express
     */
    private static shutdownProperly(exitCode: number, server: ExpressServer) {
        Promise.resolve()
            .then(() => server.kill())
            .then(() => RedisAdapter.disconnect())
            .then(() => DatabaseAdapter.disconnect())
            .then(() => {
                logger.info('Shutdown complete, bye bye!');
                process.exit(exitCode);
            })
            .catch((err) => {
                logger.error('Error during shutdown', err);
                process.exit(1);
            });
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
