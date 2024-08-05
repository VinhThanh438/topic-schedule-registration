import mongoose from 'mongoose';

export class ConnectDB {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/scheduling');
            console.log('Mongo connected successfully');
        } catch (error) {
            console.log('err: ', error);
        }
    }
}
