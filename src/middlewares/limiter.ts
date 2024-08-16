import rateLimit from 'express-rate-limit';
import {logEvents} from './logger';
import { sendErrorResponse } from '../utils/response';

export const loginLimiter = rateLimit({
    windowMs: 60*1000, //1 minute
    max: 5, //limit each IP to 5 requests per window per minute
    message: {
        message: 'Too many login attempts from this IP, please try again after a 60 second pause'
    },
    handler: (req,res,next,options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'loginErr.log');
        return sendErrorResponse(res,options,options.message.message,429);
    },
    standardHeaders: true, //return rate limitinfo in the `RateLimit-*` headers
    legacyHeaders: false, // disable the `X-ratelimit-*` headers
});
