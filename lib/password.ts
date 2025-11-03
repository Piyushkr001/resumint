// lib/password.ts
// Simple password hashing helpers using Node's built-in crypto (no extra deps)

import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);
const KEY_LEN = 32; // 32 bytes = 256 bits

/**
 * Hash a plain-text password.
 * Output format: "salt:derivedKeyHex"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex"); // 128-bit salt
  const derivedKey = (await scrypt(password, salt, KEY_LEN)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plain-text password against a stored hash.
 * Accepts the "salt:derivedKeyHex" format produced by hashPassword.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!hash) return false;

  const [salt, keyHex] = hash.split(":");
  if (!salt || !keyHex) return false;

  const derivedKey = (await scrypt(password, salt, KEY_LEN)) as Buffer;
  const keyBuffer = Buffer.from(keyHex, "hex");

  if (keyBuffer.length !== derivedKey.length) return false;

  return timingSafeEqual(keyBuffer, derivedKey);
}
