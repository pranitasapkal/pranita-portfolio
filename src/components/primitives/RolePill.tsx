/**
 * RolePill — bordered hero pill: ROLE at [employer logo] | LOCATION
 * (Sandeep ref, with the real Meesho wordmark in the logo slot).
 * The logo sits on a small white chip so the brand plum stays legible on
 * dark surfaces in dark mode.
 */
interface RolePillProps {
  role: string
  at: string
  logoSrc: string
  logoAlt: string
  location: string
}

export function RolePill({ role, at, logoSrc, logoAlt, location }: RolePillProps) {
  return (
    <p className="inline-flex items-center gap-3 rounded-full border border-line-soft bg-surface-2 pl-5 pr-4 py-2.5 shadow-[var(--shadow-pill)]">
      <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-strong uppercase">
        {role}
      </span>
      <span className="font-sans text-[13px] text-soft lowercase">{at}</span>
      <span className="inline-flex items-center bg-white rounded-md px-1.5 py-1">
        <img src={logoSrc} alt={logoAlt} className="h-[15px] w-auto" draggable={false} />
      </span>
      <span aria-hidden="true" className="h-4 w-px bg-line-soft" />
      <span className="font-mono text-[11px] tracking-[0.14em] text-soft uppercase">{location}</span>
    </p>
  )
}
