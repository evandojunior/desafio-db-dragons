interface IconProps {
  className?: string;
}

export function TrashIcon({ className }: IconProps) {
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
      <path d="M2.5 4h11" />
      <path d="M6 4V2.5h4V4" />
      <path d="M3.8 4l.6 9.1a1 1 0 0 0 1 .9h5.2a1 1 0 0 0 1-.9l.6-9.1" />
      <path d="M6.6 6.8v4.6M9.4 6.8v4.6" />
    </svg>
  );
}
