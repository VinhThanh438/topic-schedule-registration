import { Job, DoneCallback, Queue } from 'bull';

export interface IJobHangler {
    register(): Promise<Queue>;
    handler(job: Job, done: DoneCallback): Promise<void>;
}
