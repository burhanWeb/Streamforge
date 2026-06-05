import { Request, Response } from "express";
import { createVideoUpload } from "../services/upload.service.ts";
import { createVideo } from "../repositories/video.repository.ts";
import { publishTranscodeJob } from "../services/queue.service.ts";
interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export const uploadVideo = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const file = req.file;


    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const uploaded = await createVideoUpload(file);

    const generatedTitle = file.originalname
      .split(".")[0]
      .replace(/[-_]/g, " ");
const userId = req.user?.userId 
    const video = await createVideo({
      userId:userId!,
      title: generatedTitle,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      rawS3Key: uploaded.key,
    });
await publishTranscodeJob({
    videoId: video.id,
    raws3Key: uploaded.key,
})
    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Video upload failed",
    });
  }
};