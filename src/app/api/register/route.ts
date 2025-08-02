
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { setTokenCookie, signToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function generateRandomUsername() {
  const suffix = Math.random().toString(36).substring(2, 10); // random 8 chars
  return `user_${suffix}`;
}

async function generateUniqueUsername() {
  let username = generateRandomUsername();
  let exists = await prisma.user.findUnique({ where: { username } });
  while (exists) {
    username = generateRandomUsername();
    exists = await prisma.user.findUnique({ where: { username } });
  }
  return username;
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const { email, password } = body
  
      if (!email || !password) {
        return NextResponse.json(
          { message: 'Email and password are required',  success: false },
          { status: 400 }
        )
      }
  
      // Check if user exists by email
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email already registered', 
            success: false
          },
          { status: 404 }
        )
      }
  
      // Generate unique username
      const username = await generateUniqueUsername()
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
  
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      })
  
      // Create JWT token
      const payload = { userId: user.id, email: user.email }
      const token = signToken(payload)
  
      // Set token cookie
      const cookie = setTokenCookie(token)
      const response = NextResponse.json(
        { message: 'User registered successfully', username },
        { status: 201 }
      )
  
      response.headers.set('Set-Cookie', cookie)
      return response
    } catch (error) {
      console.error('Register error:', error)
      return NextResponse.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
      )
    }
  }
