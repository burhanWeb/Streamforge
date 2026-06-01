import app from "./app.ts";
import { connectDatabase } from "./config/db.ts";
import { env } from "./config/env.ts";
import { connectRabbitMQ } from "./config/rabbitmq.ts";

async function start() {
  await connectDatabase();
  await connectRabbitMQ()

  app.listen(env.apiPort, () => {
    console.log(`Server running on port ${env.apiPort}`);
  });
}

start();
