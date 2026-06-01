import { getRabbitChannel } from "../config/rabbitmq.ts";

export async function publishTranscodeJob(data: {
  videoId: string;
  raws3Key: string;
}) {
  const channel = getRabbitChannel();

  const message = Buffer.from(JSON.stringify(data));

  channel.sendToQueue("video_transcode_queue", message, {
    persistent: true,
  });

  console.log("Transcode job added:", data.videoId);
}