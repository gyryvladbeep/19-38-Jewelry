import { Link } from "@/i18n/navigation";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-2 leading-none ${className}`}
      aria-label="19:38 Jewelry — home"
    >
      <span className="font-script text-3xl">19:38</span>
      <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
        Jewelry
      </span>
    </Link>
  );
}
