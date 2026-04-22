"use client";

interface AttendXLogoProps {
  /** Icon-only width/height in px (default 40) */
  size?: number;
  /** Show the "AttendX" text next to the icon */
  showText?: boolean;
  /** Text size class override (e.g. "text-xl") */
  textClass?: string;
  /** Additional CSS classes on the wrapper */
  className?: string;
}

/**
 * Shared AttendX logo used across the entire application:
 * - Navbar (landing page)
 * - Sidebar (dashboard panels)
 * - Login page
 * - Footer
 * - Favicon (separate SVG export)
 */
export default function AttendXLogo({
  size = 40,
  showText = false,
  textClass = "text-xl",
  className = "",
}: AttendXLogoProps) {
  const id = `ax-grad-${size}`;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ── Icon Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="AttendX logo"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect width="120" height="120" rx="28" fill={`url(#${id})`} />

        {/* Stylised "A" constructed from two strokes */}
        {/* Left leg */}
        <path
          d="M38 88L60 32L72 64"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right leg */}
        <path
          d="M60 32L82 88"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Crossbar / checkmark swoosh */}
        <path
          d="M44 72L56 82L88 48"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span className={`${textClass} font-extrabold text-slate-900 tracking-tight select-none`}>
          Attend<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891b2] to-[#14b8a6]">X</span>
        </span>
      )}
    </div>
  );
}
