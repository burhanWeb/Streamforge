import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.ts";
import { uploadVideo } from "../controllers/upload.controller.ts";

const router = Router();

router.post("/",upload.single("video"),uploadVideo)

export default router