import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

// GET /api/comments?ideaId=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ideaId = searchParams.get("ideaId");

  if (!ideaId) {
    return NextResponse.json({ error: "ideaId is required" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const comments = await db
      .collection("comments")
      .find({ ideaId })
      .sort({ createdAt: -1 })
      .toArray();

    // Serialize ObjectId → plain string so the client can use it directly
    const serialized = comments.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ideaId, text } = body;

  if (!ideaId || !text?.trim()) {
    return NextResponse.json({ error: "ideaId and text are required" }, { status: 400 });
  }

  const comment = {
    ideaId,
    userId: session.user.id,
    userName: session.user.name,
    userImage: session.user.image || null,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    const result = await db.collection("comments").insertOne(comment);

    // Return with _id as a plain string
    return NextResponse.json(
      { ...comment, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
