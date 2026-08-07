import { redirect } from "next/navigation";

import { WorkspaceClient } from "@/app/workspace/workspace-client";
import { getServerEnv } from "@/config/env";
import { getCurrentUser } from "@/providers/auth/session";
import { allProducts } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  if (!user) {
    const env = getServerEnv();
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.zmzai.cloud";
    redirect(`${authUrl}/login?next=${encodeURIComponent(`${env.APP_URL}/workspace`)}`);
  }
  return <WorkspaceClient userId={user.id} userName={user.name} products={allProducts.filter((product) => product.id !== "hub")} />;
}
