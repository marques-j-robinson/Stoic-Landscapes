import {
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const bucketName = process.env.S3_BUCKET!;

export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",

  endpoint: process.env.S3_ENDPOINT,

  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function deleteImage(imageKey: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageKey,
    }),
  );
}