import winston from "winston";
import { config } from "./index";

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, service }) => {
      return `[${timestamp}] [${level}] [${service}]: ${message}`;
    })
  ),
  defaultMeta: { service: config.SERVICE_NAME },
  transports: [new winston.transports.Console()],
});

export default logger;
