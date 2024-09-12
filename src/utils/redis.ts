import { Redis } from "ioredis";
import { environment } from "./loadEnvironment";

const redisClient = new Redis({
  host: environment.REDIS_HOST || "172.28.1.7",
  port: 6379,
  maxRetriesPerRequest: null,
});

export default redisClient;
