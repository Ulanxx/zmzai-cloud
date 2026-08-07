import { cookies } from "next/headers";
import { hashToken, SessionModel, UserModel, type UserRole, type UserStatus } from "@zmzai/db";

import { getServerEnv, requireAuthSecret } from "@/config/env";
import { connectMongo } from "@/providers/database/mongodb/connection";

export interface CurrentUser { id: string; name: string; email: string; role: UserRole; status: UserStatus; emailVerified: boolean; }

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const env = getServerEnv();
  const token = (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  await connectMongo();
  const session = await SessionModel.findOne({ tokenHash: hashToken(requireAuthSecret(), token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await UserModel.findById(session.userId);
  if (!user || user.status !== "active" || (!user.emailVerified && user.role !== "admin")) return null;
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, status: user.status, emailVerified: user.emailVerified };
}

export async function destroySession(): Promise<void> {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (token) {
    await connectMongo();
    await SessionModel.deleteOne({ tokenHash: hashToken(requireAuthSecret(), token) });
  }
  cookieStore.set(env.SESSION_COOKIE_NAME, "", { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax", path: "/", ...(env.SESSION_COOKIE_DOMAIN ? { domain: env.SESSION_COOKIE_DOMAIN } : {}), maxAge: 0 });
}
