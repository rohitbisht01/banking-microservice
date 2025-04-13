import logger from "../../config/logger";
import { USER_TOPICS } from "../../constants";
import { producer } from "../kafka";

export const publishUserRegistered = async (data: any) => {
  const topic = USER_TOPICS.USER_REGISTERED;

  logger.info(
    `publishing to topic: ${topic} with message : ${JSON.stringify(data)}`
  );

  await producer.send({
    topic,
    messages: [
      {
        key: data.key,
        value: JSON.stringify(data.value),
      },
    ],
  });
};
