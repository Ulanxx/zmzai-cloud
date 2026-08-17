import { Logo } from "@zmzai/theme";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper">
      <div className="loading-logo">
        <Logo size={48} />
      </div>
    </div>
  );
}
