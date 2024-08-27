import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";
import { logEvents } from "./logger";

const cacheMiddleware = (cacheKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate the cache key based on the request
      const key = `${cacheKey}-${req.originalUrl}`;

      // Check if the response is cached in Redis
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        // If cached data exists, return it as the response
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cachedData));
      } else {
        // Otherwise, continue with the request and cache the response
        res.setHeader("X-Cache", "MISS");
        // Store the original res.json method
        const originalJson = res.json.bind(res);

        res.json = (body: any): Response => {
          // Cache the response in Redis without an expiration time
          redisClient.set(key, JSON.stringify(body));
          // Return the original json response
          return originalJson(body);
        };
        next();
      }
    } catch (err: any) {
      logEvents(`Redis error: ${err.message}Error Object: ${JSON.stringify(err)}`, "redisLogs.log");
      next();
    }
  };
};

export const invalidateCache = async (cacheKey: string) => {
  try {
    const keys = await redisClient.keys(`${cacheKey}-*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err:any) {
    logEvents(`Redis error: ${err.message}\nError Object: ${JSON.stringify(err)}`, "redisLogs.log");
    throw err;
  }
};

export default cacheMiddleware;
