import crypto from "crypto";

export function randomJti() {
  return crypto.randomBytes(32).toString("hex"); // 64-char hex
}

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
