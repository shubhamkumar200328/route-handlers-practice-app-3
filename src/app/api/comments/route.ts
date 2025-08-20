import { comments } from "./data";
import { NextResponse } from 'next/server'


// GET handler - get all the existing data
export async function GET() {
  try {
    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch comments." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}


// POST handler - adds a new comment
export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid comment text' }, { status: 400 })
    }

    // Create a new comment with incremental ID
    const newComment = {
      id: comments.length ? comments[comments.length - 1].id + 1 : 1,
      text,
    }

    comments.push(newComment)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}


// DELETE handler - deletes a comment by ID
export async function DELETE(request: Request) {
  try {
    // Parse the request URL to get query params
    const url = new URL(request.url)
    const idParam = url.searchParams.get('id')

    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const id = parseInt(idParam, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 })
    }

    const index = comments.findIndex(comment => comment.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Remove the comment from the array
    comments.splice(index, 1)

    return NextResponse.json({ message: 'Comment deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
