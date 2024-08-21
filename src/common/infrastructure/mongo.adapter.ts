import logger from '@common/logger';
import { MONGO_URI } from '@config/environment';
import mongoose from 'mongoose';

export class DatabaseAdapter {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect(MONGO_URI);
            logger.info('mongoose connected successfully!');
        } catch (error) {
            logger.error('err: ', error);
        }
    }

    static async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            logger.info('Disconnect from mongodb successfully!');
        } catch (error) {
            logger.error('Disconnect from mongodb failed!', error);
        }
    }
}
