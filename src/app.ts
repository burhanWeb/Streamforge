import express from "express";
import authRoutes from "./routes/auth.routes.ts"
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StreamForge API running",
  });
});
app.use("/api/v1/auth", authRoutes);

export default app;


