import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(
    "amqp://guest:guest@localhost:5672"
  );

  channel = await connection.createChannel();

  await channel.assertQueue("video_transcode_queue", {
    durable: true,
  });

  console.log("RabbitMQ connected");
}

export function getRabbitChannel(): amqp.Channel {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  return channel;
}