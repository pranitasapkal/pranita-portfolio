/**
 * KitchenSink — /dev/kitchen-sink. v2 primitive proving ground (never linked
 * from the site, lazy-loaded). Lorem-class specimen text is fine HERE only —
 * this page is dev-only and ships to no visitor path.
 */
import { PillButton } from '../components/primitives/PillButton'
import { MetaLine } from '../components/primitives/MetaLine'
import { SectionTag } from '../components/primitives/SectionTag'
import { RolePill } from '../components/primitives/RolePill'
import { UnderlineAccent } from '../components/primitives/UnderlineAccent'
import { DragCard } from '../components/primitives/DragCard'

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line-soft pt-8">
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-soft">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  )
}

export default function KitchenSink() {
  return (
    <main id="main" className="bg-surface-0 min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col gap-12">
        <h1 className="font-serif-display font-semibold text-4xl text-strong">Kitchen sink · v2</h1>

        <Spec label="Type scale">
          <div className="flex flex-col gap-3">
            <p className="font-serif-display font-semibold text-strong text-6xl tracking-tight">
              Fraunces display
            </p>
            <p className="font-sans text-xl text-strong">Hanken Grotesk body — the workhorse.</p>
            <p className="font-sans text-[15px] text-soft">Soft body text for support copy.</p>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-soft">
              IBM PLEX MONO · META LAYER
            </p>
            <p className="font-hand text-2xl text-soft">Caveat — handwritten microcopy layer</p>
          </div>
        </Spec>

        <Spec label="Underline accent">
          <p className="font-serif-display font-semibold text-4xl text-strong">
            Words can be <UnderlineAccent>underlined</UnderlineAccent> by hand.
          </p>
        </Spec>

        <Spec label="Pill buttons">
          <PillButton>Solid action</PillButton>
          <PillButton variant="outline">Outline action</PillButton>
        </Spec>

        <Spec label="Role pill">
          <RolePill role="PRODUCT DESIGNER" at="at" logoSrc="/logos/meesho.svg" logoAlt="Meesho" location="Bangalore, India" />
        </Spec>

        <Spec label="Meta line + status">
          <MetaLine parts={['VALMO', 'CONTRACT LIFECYCLE', '2026']} status="IN BUILD" />
        </Spec>

        <Spec label="Section tag">
          <SectionTag>SELECTED WORK</SectionTag>
        </Spec>

        <Spec label="Drag card deck">
          <DragCard />
        </Spec>

        <Spec label="Band tokens">
          <div className="band bg-band rounded-3xl p-10 w-full flex flex-col gap-3">
            <SectionTag tone="band">BAND SECTION</SectionTag>
            <p className="font-sans text-2xl font-medium text-band-text">
              Always dark, in both themes.
            </p>
            <p className="font-sans text-[15px] text-band-soft">
              Statement and approach folds render on these tokens.
            </p>
          </div>
        </Spec>
      </div>
    </main>
  )
}
