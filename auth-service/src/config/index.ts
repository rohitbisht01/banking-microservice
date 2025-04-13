interface Config {
  SERVICE_NAME: string;
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  KAFKA_BROKER: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
  ALLOWED_ORIGINS: string;
}

export const config: Config = {
  SERVICE_NAME: require("../../package.json").name,
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://admin:cantremember@localhost:5432/bank-postgres",
  REDIS_URL: process.env.REDIS_URL || "redis://:cantremember@localhost:6379",
  KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9094",
  JWT_SECRET: process.env.JWT_SECRET || "rohit",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:3000,http://localhost:3001",
};
