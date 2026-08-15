/**
 * Circular arrow that rotates -45° → 0 on group-hover.
 * Place inside a parent with className="group" to trigger.
 */
interface ArrowCircleProps {
  size?: number
  className?: string
}

export function ArrowCircle({ size = 40, className = '' }: ArrowCircleProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-line shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.45}
        height={size * 0.45}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] -rotate-45 group-hover:rotate-0"
      >
        <path
          d="M3 15L15 3M15 3H6M15 3V12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
