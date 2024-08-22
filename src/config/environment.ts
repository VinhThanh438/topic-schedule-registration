import path from 'path';
import dotenv from 'dotenv-safe';

dotenv.config({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example'),
});

export const PORT: number = parseInt(process.env.PORT, 10) || 3000;

export const ROOT_ROUTE = process.env.ROOT_ROUTE;

export const MONGO_URI = process.env.MONGO_URI;

export const REDIS_URI = process.env.REDIS_URI;

export const LOG_LEVEL = process.env.LOG_LEVEL;

export const ACCESSTOKEN_KEY: string = process.env.JWT_ACCESSTOKEN_KEY;

export const REFRESHTOKEN_KEY: string = process.env.JWT_REFRESHTOKEN_KEY;
