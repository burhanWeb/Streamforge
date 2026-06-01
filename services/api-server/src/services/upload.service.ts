import { uploadVideoToS3 } from "./s3.service.ts";

export const createVideoUpload = async (
  file: Express.Multer.File
) => {
  const uploaded = await uploadVideoToS3(file);

  return uploaded;
};