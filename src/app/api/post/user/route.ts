// /api/posts/user/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const skip = (page - 1) * limit

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where: { userId } }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      posts,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error("Get User Posts Error:", error)
    return NextResponse.json({ message: 'Server Error' }, { status: 500 })
  }
}
