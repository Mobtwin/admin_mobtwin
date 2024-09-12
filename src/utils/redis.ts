import IOredis from 'ioredis';
import { environment } from './loadEnvironment';
environment.REDIS_PORT
const redisClient = new IOredis(parseInt(environment.REDIS_PORT) || 6379, environment.REDIS_HOST || "172.28.1.7",{maxRetriesPerRequest:null});

export default redisClient;
