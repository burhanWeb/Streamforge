import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.ts";
import { uploadVideo } from "../controllers/upload.controller.ts";
import { ProtectedRoute } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/",upload.single("video"),ProtectedRoute,uploadVideo)

export default router