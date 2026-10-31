import { NextResponse } from "next/server";
import {
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { db, Painting } from "@/lib/db";
import { bucketName, s3 } from "@/lib/s3";

/**
 * Fetches a specific painting from the database by ID.
 */

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const paintingId = Number(id);

    if (!Number.isSafeInteger(paintingId) || paintingId <= 0) {
        return NextResponse.json(
            { error: "Invalid painting ID." },
            { status: 400 }
        );
    }
    
    const [rows] = await db.execute<Painting[]>(
        `SELECT id, title, description, image_key AS imageKey, content_type AS contentType FROM paintings WHERE id = ?`,
        [id],
    );

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Failed to fetch paintings:", error);
    return NextResponse.json(
      { error: "Unable to fetch paintings." },
      { status: 500 },
    );
  }
}

/**
 * Updates a specific painting in the database by ID.
 * 
 * @body { title: string, description?: string }
 */

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const paintingId = Number(id);

    if (!Number.isSafeInteger(paintingId) || paintingId <= 0) {
        return NextResponse.json(
            { error: "Invalid painting ID." },
            { status: 400 }
        );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;

    await db.execute(
      `UPDATE paintings
       SET title = ?, description = ?
       WHERE id = ?`,
      [title, description ?? null, id],
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

/**
 * Deletes a specific painting from the database by ID.
 */

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const paintingId = Number(id);

    if (!Number.isSafeInteger(paintingId) || paintingId <= 0) {
        return NextResponse.json(
            { error: "Invalid painting ID." },
            { status: 400 }
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