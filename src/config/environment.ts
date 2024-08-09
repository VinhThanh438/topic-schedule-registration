import path from 'path';
import dotenv from 'dotenv-safe';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
});

export const PORT: number = parseInt(process.env.PORT, 10) || 3000;

export const MONGO_URI = process.env.MONGO_URI;

export const REDIS_URI = process.env.REDIS_URI;

export const LOG_LEVEL = process.env.LOG_LEVEL;
