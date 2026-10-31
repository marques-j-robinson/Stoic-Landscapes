import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

interface Painting extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  imageKey: string;
  contentType: string;
}

/**
 * Fetches a specific painting from the database by ID.
 */

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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