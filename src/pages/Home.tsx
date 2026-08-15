/**
 * Home page — assembles all Phase 5 sections.
 * Section order matches navbar anchors: Work, Toolkit, Process, Contact.
 * The contact section provides id="contact" so the navbar anchor lands;
 * the Footer that follows in App.tsx carries the full contact UI (giant email).
 */
import { Hero } from '../components/home/Hero'
import { About } from '../components/home/About'
import { CaseIndex } from '../components/home/CaseIndex'
import { Toolkit } from '../components/home/Toolkit'
import { SecondaryWork } from '../components/home/SecondaryWork'
import { ProcessStrip } from '../components/home/ProcessStrip'
import { Writing } from '../components/home/Writing'
import { RouteSpine } from '../components/home/RouteSpine'
import { Button } from '../components/primitives/Button'

// ── Contact band ──────────────────────────────────────────────────────────────
// Thin section — id="contact" makes the navbar anchor work.
// The Footer below this (rendered in App.tsx) carries the full contact UI.
function ContactBand() {
  return (
    <section
      id="contact"
      className="bg-ink-0 border-t border-line py-20 md:py-24 px-6 md:px-12"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mb-4">
            05 / CONTACT
          </p>
          <h2
            className="font-display font-black uppercase text-text-hi leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}
          >
            Start a conversation.
          </h2>
          <p className="font-serif italic text-text-lo mt-3 text-lg max-w-sm leading-relaxed">
            Open to product design roles and selected consulting engagements.
          </p>
        </div>
        <Button href="mailto:sapkalp1997@gmail.com" variant="solid" className="shrink-0">
          sapkalp1997@gmail.com
        </Button>
      </div>
    </section>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main id="main">
      <RouteSpine />
      <Hero />
      <About />
      <CaseIndex />
      <Toolkit />
      <SecondaryWork />
      <ProcessStrip />
      <Writing />
      <ContactBand />
    </main>
  )
}
