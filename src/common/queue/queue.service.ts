import { ConnectRedis } from '@common/infrastructure/redis.adapter';
import logger from '@common/logger';
import BullQueue, { Queue } from 'bull';

export class QueueService {
    private static queues: Map<string, Queue> = new Map<string, Queue>();

    static async getQueue<T = unknown>(jobName: string): Promise<Queue<unknown>> {
        let queue = QueueService.queues.get(jobName);

        if (!queue) {
            queue = new BullQueue<T>(jobName, await ConnectRedis.getQueueOptions());
            queue.on('error', (error) => logger.error('cannot process queue', error));
            QueueService.queues.set(jobName, queue);
        }

        return queue;
    }
}
