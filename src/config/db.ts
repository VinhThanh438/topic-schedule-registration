import mongoose from "mongoose";

export class ConnectDB {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect('mongodb://localhost:27017/2')
        } catch (error) {
            console.log('err: ',error)
        }
    }
}