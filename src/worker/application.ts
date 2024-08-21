import { DatabaseAdapter } from '@common/infrastructure/mongo.adapter';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { WorkerServer } from './server';
import logger from '@common/logger';

export class Application {
    public static async createApp(): Promise<WorkerServer> {
        await DatabaseAdapter.connect();

        await RedisAdapter.connect();

        const server = new WorkerServer();

        await server.setup();

        Application.handleExit(server);

        return;
    }

    /**
     * Register signal handler to graceful shutdown
     *
     * @param express Express server
     */
    private static handleExit(express: WorkerServer) {
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
    private static shutdownProperly(exitCode: number, server: WorkerServer) {
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
}
