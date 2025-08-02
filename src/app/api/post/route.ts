// /api/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/lib/auth'
import slugify from "slugify"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 2
  const skip = (page - 1) * limit

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    }),
    prisma.post.count(),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return NextResponse.json({
    posts,
    currentPage: page,
    totalPages,
  })
}

export async function POST(req: NextRequest) {
    try {
      const token = req.cookies.get('token')?.value
  
      if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
      const userId = getUserIdFromToken(token)
  
      if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
  
      const {
        title,
        content,
        metaTitle,
        metaDescription,
        coverImage,
        category,
        tags,
      } = await req.json()
  
      if (!title || !content || !category || !Array.isArray(tags)) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
      }
  
      let baseSlug = slugify(title, { lower: true, strict: true })
      let slug = baseSlug
      let count = 1
  
      // Ensure unique slug
      while (await prisma.post.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`
      }
  
      const post = await prisma.post.create({
        data: {
          title,
          content,
          slug,
          metaTitle,
          metaDescription,
          coverImage,
          category,
          tags,
          userId,
        },
      })
  
      return NextResponse.json(post)
    } catch (error) {
      console.error("Create Post Error:", error)
      return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
  }
