import { getSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  GetObjectCommand,
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

    const [[painting]] = await db.execute<Painting[]>(
      `SELECT id, title, description, image_key AS imageKey, content_type AS contentType FROM paintings WHERE id = ?`,
      [id],
    );
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: painting.imageKey,
    });

    const imageUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    const response = {
      ...painting,
      imageUrl,
    };

    return NextResponse.json(response, { status: 200 });
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
  const session = await getSession(request.headers);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const paintingId = Number(id);

    if (!Number.isSafeInteger(paintingId) || paintingId <= 0) {
      return NextResponse.json(
        { error: "Invalid painting ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { title, description } = body;

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
  const session = await getSession(request.headers);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

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