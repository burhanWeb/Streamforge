import { dbConfig } from "../config/db.ts";

type CreateVideoInput = {
  userId: string;
  title: string;
  description?: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  rawS3Key: string;
};

export const createVideo = async (data:CreateVideoInput) =>{

 const result = await dbConfig.query(
    `INSERT INTO videos (
      user_id,
      title,
      original_filename,
      mime_type,
      size,
      raw_s3_key,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'uploaded')
    RETURNING *`,
    [
      data.userId,
      data.title,
      data.originalFilename,
      data.mimeType,
      data.size,
      data.rawS3Key,
    ]
  );

    return result.rows[0];

}