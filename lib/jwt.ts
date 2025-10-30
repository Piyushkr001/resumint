import { SignJWT, jwtVerify, JWTPayload } from "jose";

const enc = new TextEncoder();
const accessSecret = enc.encode(process.env.JWT_SECRET!);
const refreshSecret = enc.encode(process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!);

const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL ?? "15m";
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL ?? "7d";

export async function signAccessToken(sub: string, claims: Record<string, any> = {}) {
  return await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(accessSecret);
}

export async function signRefreshToken(sub: string, jti: string) {
  return await new SignJWT({ jti })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TTL)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  return await jwtVerify(token, accessSecret);
}

export async function verifyRefreshToken(token: string) {
  return await jwtVerify(token, refreshSecret);
}
