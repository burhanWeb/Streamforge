
import express from "express";
import authRoutes from "./routes/auth.routes.ts"
import viedoRoutes from "./routes/upload.routes.ts"
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({
    message: "StreamForge API running",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/upload',viedoRoutes)

export default app;


