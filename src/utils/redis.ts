import { Redis } from 'ioredis';
import { environment } from './loadEnvironment';

const redisClient = new Redis({
    maxRetriesPerRequest: null,
    host: environment.REDIS_HOST || 'localhost',
  });

export default redisClient;
