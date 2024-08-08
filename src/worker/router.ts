import { IJobHangler } from './worker.interface';
import { Queue } from 'bull';

export class Router {
    static async register(): Promise<Queue[]> {
        const queues: IJobHangler[] = [];
        return Promise.all(queues.map((q) => q.register()));
    }
}
