"use client";

export function LogoutButton({ userId }: { userId: string }) {
  return <button type="button" onClick={async () => {
    localStorage.removeItem(`zmzai-hub-recent:${userId}`);
    await fetch("/api/logout", { method: "POST" });
    window.location.assign("/");
  }} className="focus-ring text-muted underline underline-offset-4 transition-colors hover:text-accent">退出登录</button>;
}
