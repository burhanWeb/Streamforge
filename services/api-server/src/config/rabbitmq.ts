import amqp from "amqplib";
import { env } from "./env.ts";

export async function getRabbitChannel() {
  const url = env.rabbitMq.url;

  for (let i = 1; i <= 10; i++) {
    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();

      console.log("RabbitMQ connected");
      return { connection, channel };
    } catch (err) {
      console.log(`RabbitMQ not ready, retrying ${i}/10`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  throw new Error("RabbitMQ connection failed");
}

export async function connectRabbitMQ() {
  return getRabbitChannel();
}
