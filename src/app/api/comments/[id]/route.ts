import { comments } from "../data";
import { NextResponse } from "next/server";

// GET a single comment
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const commentId = parseInt(params.id, 10);

  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const comment = comments.find((c) => c.id === commentId);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  return NextResponse.json(comment);
}

// PUT - full replacement
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const commentId = parseInt(params.id, 10);
  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const index = comments.findIndex((c) => c.id === commentId);
  if (index === -1) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const body = await request.json();
  if (!body || typeof body.text !== "string") {
    return NextResponse.json({ error: "Invalid body format" }, { status: 400 });
  }

  comments[index] = { id: commentId, text: body.text };

  return NextResponse.json(comments[index]);
}

// PATCH - partial update
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const commentId = parseInt(params.id, 10);
  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const index = comments.findIndex((c) => c.id === commentId);
  if (index === -1) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const body = await request.json();
  if (!body || typeof body.text !== "string") {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  comments[index].text = body.text;

  return NextResponse.json(comments[index]);
}
