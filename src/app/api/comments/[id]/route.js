import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

// PUT /api/comments/[id]
export async function PUT(request, { params }) {
  // Next.js 15: params must be awaited
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text } = await request.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid comment id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const comment = await db.collection("comments").findOne({ _id: objectId });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("comments").updateOne(
      { _id: objectId },
      { $set: { text: text.trim(), updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/comments/[id] error:", err);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// DELETE /api/comments/[id]
export async function DELETE(request, { params }) {
  // Next.js 15: params must be awaited
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid comment id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const comment = await db.collection("comments").findOne({ _id: objectId });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("comments").deleteOne({ _id: objectId });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/comments/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
