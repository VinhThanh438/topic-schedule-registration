import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    limit: 10, // max: 10 request per minute
    message: 'Too many requests, please try again later.',
});

export default limiter;
