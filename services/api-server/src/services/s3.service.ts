
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.ts";
import { env } from "../config/env.ts";
import fs from "fs";

export const uploadVideoToS3 = async (
  file: Express.Multer.File
) => {
  const key = `raw/${Date.now()}-${file.originalname}`;

  const stream = fs.createReadStream(file.path);

  await s3.send(
    new PutObjectCommand({
      Bucket: env.aws.bucket,
      Key: key,
      Body: stream,
      ContentType: file.mimetype,
    })
  );
fs.unlinkSync(file.path)
  return {
    key,
    url: `https://${env.aws.bucket}.s3.${env.aws.region}.amazmdmmdonafdws.com/${key}`,
  };
};