interface IconProps {
  className?: string;
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.3 8s2.5-4.4 6.7-4.4S14.7 8 14.7 8s-2.5 4.4-6.7 4.4S1.3 8 1.3 8z" />
      <circle cx="8" cy="8" r="1.9" />
    </svg>
  );
}
