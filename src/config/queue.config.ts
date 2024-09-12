import { Queue } from 'bullmq';
import redisClient from '../utils/redis';



export const updateLogsAndActionsQueue = new Queue('UpdateLogsAndActionsAdminQueue',{connection:redisClient}); 

