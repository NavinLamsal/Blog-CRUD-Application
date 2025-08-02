// /api/posts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/lib/auth'


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)
    const { id: postId } = await context.params // ✅ Await params here

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.userId !== userId) {
      return NextResponse.json({ message: 'Not allowed' }, { status: 403 })
    }

    

    const allowedFields = [
      "title",
      "content",
      "metaTitle",
      "metaDescription",
      "coverImage",
      "category",
      "tags",
    ];
    
    const incoming = await req.json();
    const updates: Partial<typeof incoming> = {};
    
    for (const key of Object.keys(incoming)) {
      if (allowedFields.includes(key)) {
        updates[key] = incoming[key];
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updates,
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Update Post Error:", error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}


export async function DELETE( req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(token)
    const { id: postId } = await context.params // ✅ Await params here


    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.userId !== userId) {
      return NextResponse.json({ message: 'Not allowed' }, { status: 403 })
    }

    await prisma.post.delete({ where: { id: postId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete Post Error:", error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
