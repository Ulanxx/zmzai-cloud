import { Logo } from "@zmzai/theme";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
      <Logo size={48} />
    </div>
  );
}
