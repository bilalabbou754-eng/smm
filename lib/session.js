import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getUserById } from "@/lib/store";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("smm_token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return null;
  }

  const user = await getUserById(payload.userId);
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}
