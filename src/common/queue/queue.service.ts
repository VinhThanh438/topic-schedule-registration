import logger from '@common/logger';
import BullQueue, { Queue } from 'bull';

export class QueueService {
    private static queues: Map<string, Queue> = new Map<string, Queue>();

    static async getQueue<T = unknown>(jobName: string): Promise<Queue<unknown>> {
        let queue = QueueService.queues.get(jobName);

        if (!queue) {
            queue = new BullQueue<T>(jobName);
            queue.on('error', (error) => logger.error('can not process queue', error));
            QueueService.queues.set(jobName, queue);
        }

        return queue;
    }
}
