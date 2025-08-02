import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    const params = await context.params // await params here
    const { id } = params

  try {
    const post = await prisma.post.findUnique({
      where: { slug: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Failed to fetch post by slug:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
