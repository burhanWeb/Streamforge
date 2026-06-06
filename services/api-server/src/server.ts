import app from "./app.ts";
import { connectDatabase } from "./config/db.ts";
import { env } from "./config/env.ts";
import { connectRabbitMQ } from "./config/rabbitmq.ts";

async function start() {
  await connectDatabase();
  await connectRabbitMQ();
const PORT = Number(process.env.API_PORT) || 3000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
}

start();
