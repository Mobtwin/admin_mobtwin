import IOredis from 'ioredis';
import { environment } from './loadEnvironment';
environment.REDIS_PORT
const redisClient = new IOredis(parseInt(environment.REDIS_PORT) || 6379, environment.REDIS_HOST || "172.28.1.7",{maxRetriesPerRequest:null});
export const checkRedisConnection = async () => {
    const redis = new IOredis(parseInt(environment.REDIS_PORT) || 6379, environment.REDIS_HOST || "172.28.1.7",{maxRetriesPerRequest:null});

    redis.on("error", (err:any) => {
        console.error("🚨 Redis connection error:", err);
        process.exit(1); // Exit the app if Redis is unreachable
    });

    try {
        await redis.ping(); // Check if Redis responds
        console.log("✅ Connected to Redis successfully!");
    } catch (error) {
        console.error("❌ Failed to connect to Redis:", error);
        process.exit(1);
    } finally {
        redis.disconnect(); // Close the connection after checking
    }
};

export default redisClient;
