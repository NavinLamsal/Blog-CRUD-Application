import { NextRequest, NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST(req: NextRequest) {
  // Clear the cookie named "token"
  const response = NextResponse.json({ message: "Logged out" })

  response.headers.set(
    "Set-Cookie",
    serialize("token", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: -1, // remove cookie
      sameSite: "lax",
    })
  )

  return response
}
