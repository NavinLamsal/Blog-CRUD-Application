import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const slugs = await prisma.post.findMany({
      select: { slug: true },
    })

    return NextResponse.json(slugs)
  } catch (error) {
    console.error("Failed to fetch slugs:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
