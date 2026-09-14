import { Link } from "@/i18n/navigation";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-burgundy text-on-dark hover:bg-burgundy-strong border border-burgundy",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  ghost:
    "bg-transparent text-ink border border-transparent hover:border-line",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 uppercase tracking-[0.14em] font-medium transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
  /** Renders an internal (locale-aware) link instead of a <button>. */
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  type = "button",
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
