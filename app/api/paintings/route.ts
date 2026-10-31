
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { z } from "zod";
import { RowDataPacket } from "mysql2";

import { db } from "@/lib/db";
import { bucketName, s3 } from "@/lib/s3";

/**
 * Fetches all paintings from the database. 
 */

export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT id, title, description, image_key AS imageKey, content_type AS contentType FROM paintings`,
    );

    return NextResponse.json(rows, { status: 200 });  
  } catch (error) {
    console.error("Failed to fetch paintings:", error);
    return NextResponse.json(
      { error: "Unable to fetch paintings." },
      { status: 500 },
    );
  }
}

interface Painting extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  image_key: string;
  content_type: string;
}

const paintingSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function detectImageType(buffer: Buffer): {
  contentType: string;
  extension: string;
} | null {
  // JPEG
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  // PNG
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([
        0x89, 0x50, 0x4e, 0x47,
        0x0d, 0x0a, 0x1a, 0x0a,
      ]),
    )
  ) {
    return { contentType: "image/png", extension: "png" };
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  return null;
}

export async function POST(request: Request) {
  let uploadedKey: string | undefined;

  try {
    const formData = await request.formData();

    const parsed = paintingSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid painting details." },
        { status: 400 },
      );
    }

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

    const imageKey =
      `paintings/${randomUUID()}.${imageType.extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
        Body: buffer,
        ContentType: imageType.contentType,
      }),
    );

    uploadedKey = imageKey;

    const [result] = await db.execute(
      `INSERT INTO paintings
        (title, description, image_key, content_type)
       VALUES (?, ?, ?, ?)`,
      [
        parsed.data.title,
        parsed.data.description ?? null,
        imageKey,
        imageType.contentType,
      ],
    );

    const insertId = (result as { insertId: number }).insertId;

    return NextResponse.json(
      {
        id: insertId,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        imageKey,
        contentType: imageType.contentType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create painting:", error);

    if (uploadedKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: uploadedKey,
          }),
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded image:",
          cleanupError,
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to create painting." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "An ID is required." },
        { status: 400 },
      );
    }

    const body = await request.json();
    console.log(body)
    const { title, description, image_key: imageKey, content_type:contentType } = body;

    await db.execute(
      `UPDATE paintings
       SET title = ?, description = ?, image_key = ?, content_type = ?
       WHERE id = ?`,
      [title, description ?? null, imageKey, contentType, id],
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "An ID is required." },
        { status: 400 },
      );
    }

    const [rows] = await db.execute<Painting[]>(
          `SELECT image_key FROM paintings WHERE id = ?`,
          [id],
        );

    const imageKey = rows[0]?.image_key;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageKey,
      }),
    );

    await db.execute(
      `DELETE FROM paintings WHERE id = ?`,
      [id],
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete painting:", error);
    return NextResponse.json(
      { error: "Unable to delete painting." },
      { status: 500 },
    );
  }
}