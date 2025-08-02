import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import { getUserIdFromToken } from '@/lib/auth'




export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('token')?.value

    if (!cookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(cookie)

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth/me error:', error)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
