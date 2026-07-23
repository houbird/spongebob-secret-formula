import React from "react";

export type TagButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export function TagButton({
  children,
  className = "",
  type = "button",
  ...props
}: TagButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-ink-soft border border-border hover:bg-ocean hover:text-white hover:border-ocean px-3 py-1.5 text-xs font-semibold transition shadow-sm active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
