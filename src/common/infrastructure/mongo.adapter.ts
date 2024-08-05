import logger from '@common/logger';
import { MONGO_URL } from '@config/environment';
import mongoose from 'mongoose';

export class ConnectDB {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect(MONGO_URL);
            logger.info('mongoose connected successfully!');
        } catch (error) {
            logger.error('err: ', error);
        }
    }
}
