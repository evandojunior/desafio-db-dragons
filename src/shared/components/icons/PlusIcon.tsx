interface IconProps {
  className?: string;
}

export function PlusIcon({ className }: IconProps) {
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
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3.2v9.6M3.2 8h9.6" />
    </svg>
  );
}
