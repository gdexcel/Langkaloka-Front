//langkaloka-v1\lib\auth.ts
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}
