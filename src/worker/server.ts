import { Queue } from 'bull';
import { Router } from './router';

export class WorkerServer {
    private queues: Queue[];

    public async setup(): Promise<void> {
        await this.registerQueues();
        return;
    }

    private async registerQueues(): Promise<void> {
        this.queues = await Router.register();
    }
}
