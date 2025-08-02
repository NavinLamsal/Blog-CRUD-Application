
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken, setTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" 
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const payload = { userId: user.id, email: user.email };
    const token = signToken(payload);
    const cookie = setTokenCookie(token);

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

