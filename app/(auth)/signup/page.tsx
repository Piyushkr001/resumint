import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/jwt";
import SignupClient from "./SignupClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const token = (await cookies()).get("session")?.value;
  if (token) {
    try { await verifyAccessToken(token); redirect("/dashboard?already=1"); } catch {}
  }
  return <SignupClient />;
}
