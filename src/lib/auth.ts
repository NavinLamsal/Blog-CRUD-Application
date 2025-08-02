import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '24h' // adjust as needed

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function getUserIdFromToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
      return decoded.userId || null
    } catch {
      return null
    }
  }

export function setTokenCookie(token: string) {
  return serialize('token', token, {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour in seconds
  })
}
