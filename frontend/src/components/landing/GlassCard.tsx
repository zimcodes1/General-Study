import type { PropsWithChildren } from "react";

type GlassCardProps = PropsWithChildren<{
  className?: string;
}>;

export default function GlassCard({ className = "", children }: GlassCardProps) {
  return (
    <div
      className={[
        "relative rounded-3xl border border-outline-variant/20 bg-surface-container-low/40",
        "backdrop-blur-[32px] shadow-[0_20px_90px_rgba(0,0,0,0.35)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

