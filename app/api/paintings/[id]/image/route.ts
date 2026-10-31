import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { db, Painting } from "@/lib/db";
import { s3, bucketName } from "@/lib/s3";
import { detectImageType, MAX_FILE_SIZE } from "@/lib/image-validation";

/**
 * Updates a specific painting in the database by ID.
 * 
 * @body { image: File, where image is a JPEG, PNG, or WebP file }
 */

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const [rows] = await db.execute<Painting[]>(
      `SELECT image_key FROM paintings WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Painting not found." },
        { status: 404 }
      );
    }

    const imageKey = rows[0].image_key;

    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "An image file is required." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "The image must be 10 MB or smaller." },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageType = detectImageType(buffer);

    if (!imageType) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are supported." },
        { status: 400 },
      );
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: buffer,
        ContentType: imageType.contentType,
      }),
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to update painting:", error);
    return NextResponse.json(
      { error: "Unable to update painting." },
      { status: 500 },
    );
  }
}