/**
 * Footer — v2 contact band + colophon. The serif contact headline, an email
 * CTA, social links, the fuzzing footnote, and a handwritten sign-off
 * (personality at the edges — research pattern #7).
 * The scramble-settle email effect from v1 retires with the design.
 */
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'
import { UnderlineAccent } from '../primitives/UnderlineAccent'
import { PillButton } from '../primitives/PillButton'
import { MagneticWrap } from '../primitives/MagneticWrap'

export function Footer() {
  const c = draft.contact
  return (
    <footer id="contact" className="bg-surface-1 border-t border-line-soft">
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-14 md:py-20 flex flex-col items-start gap-7">
        <p className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-soft">
          {c.tag}
        </p>

        <h2 className="font-serif-display font-semibold text-strong leading-[1.05] tracking-tight text-[clamp(1.9rem,4.5vw,3.4rem)] max-w-3xl">
          {c.headline.map((seg, i) =>
            seg.underline ? (
              <UnderlineAccent key={i}>{seg.text}</UnderlineAccent>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </h2>

        <p className="font-sans text-lg text-soft max-w-xl">{c.subline}</p>

        <div className="flex flex-wrap items-center gap-4">
          <PillButton href={`mailto:${site.footer.email}`} ariaLabel={site.footer.emailAriaLabel}>
            {c.emailCta}
          </PillButton>
          {/* Bold magnetic email — follows the cursor on hover (yantrava.com footer) */}
          <MagneticWrap strength={10}>
            <a
              href={`mailto:${site.footer.email}`}
              className="font-sans font-bold text-lg md:text-2xl tracking-tight text-strong hover:text-accent transition-colors duration-200"
            >
              {site.footer.email}
            </a>
          </MagneticWrap>
        </div>

        <div className="w-full h-px bg-line-soft mt-2" aria-hidden="true" />

        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <nav className="flex flex-wrap gap-3" aria-label={site.footer.socialsAriaLabel}>
            {site.footer.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[13px] font-medium text-soft border border-line-soft rounded-full px-4 py-1.5 hover:text-strong hover:border-strong/40 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="font-hand text-xl text-soft" aria-hidden="true">
            {c.signoff}
          </p>
        </div>

        <p className="font-mono text-[11px] text-soft leading-relaxed max-w-lg">
          {site.footer.footnote}
        </p>
      </div>
    </footer>
  )
}
