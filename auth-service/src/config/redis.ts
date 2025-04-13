import Redis from "ioredis";
import { config } from "./index";
import logger from "./logger";

class RedisClient {
  private static instance: Redis;
  private static isConnected = false;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.REDIS_URL, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      RedisClient.setupEventListener();
    }
    return RedisClient.instance;
  }

  private static setupEventListener(): void {
    RedisClient.instance.on("connect", () => {
      RedisClient.isConnected = true;
      logger.info("Connected to Redis");
    });

    RedisClient.instance.on("error", (error) => {
      RedisClient.isConnected = false;
      logger.error("Redis connection error:", error);
    });

    RedisClient.instance.on("close", () => {
      RedisClient.isConnected = false;
      logger.warn("Redis connection closed");
    });

    RedisClient.instance.on("reconnecting", () => {
      logger.info("Reconnecting to Redis...");
    });
  }

  public static async closeConnection() {
    if (RedisClient.instance) {
      try {
        await RedisClient.instance.quit();
      } catch (error) {
        logger.error("Erorr closing connection:", error);
      }
    }
  }

  public static async testConnection(): Promise<boolean> {
    try {
      await RedisClient.instance.ping();
      return true;
    } catch (error) {
      logger.error("Redis connection test failed:", error);
      return false;
    }
  }

  public static isReady(): boolean {
    return RedisClient.isConnected;
  }
}

export default RedisClient.getInstance();
export { RedisClient };
