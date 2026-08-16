interface IconProps {
  className?: string;
}

export function PencilIcon({ className }: IconProps) {
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
      <path d="M11.2 1.8a1.7 1.7 0 0 1 2.4 2.4L5.3 12.5l-3.1.9.9-3.1z" />
      <path d="M10.2 2.8l2.4 2.4" />
    </svg>
  );
}
