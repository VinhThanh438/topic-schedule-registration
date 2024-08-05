import logger from '@common/logger';
import mongoose from 'mongoose';

export class ConnectDB {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/scheduling');
            logger.info('mongoose connected successfully!');
        } catch (error) {
            logger.error('err: ', error);
        }
    }
}
