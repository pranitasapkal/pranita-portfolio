/**
 * Kitchen sink — /dev/kitchen-sink
 * Every token swatch, type ramp, and primitive/chrome component demonstrated.
 */
import { SEOHead } from '../components/chrome/SEOHead'
import { SectionLabel } from '../components/primitives/SectionLabel'
import { Button } from '../components/primitives/Button'
import { ArrowCircle } from '../components/primitives/ArrowCircle'
import { MagneticWrap } from '../components/primitives/MagneticWrap'
import { WordsPullUp } from '../components/primitives/WordsPullUp'
import { ScrollFadeParagraph } from '../components/primitives/ScrollFadeParagraph'
import { StatCallout } from '../components/primitives/StatCallout'
import { Asterisk } from '../components/primitives/Asterisk'
import { PillTag } from '../components/primitives/PillTag'
import { BrowserFrame } from '../components/primitives/BrowserFrame'
import { PhoneFrame } from '../components/primitives/PhoneFrame'

// ─── Token data ──────────────────────────────────────────────────────────────

const COLORS: { name: string; cls: string; hex: string; note: string }[] = [
  { name: 'ink-0', cls: 'bg-ink-0', hex: '#0a0c10', note: 'Base bg' },
  { name: 'ink-1', cls: 'bg-ink-1', hex: '#12151c', note: 'Surface' },
  { name: 'ink-2', cls: 'bg-ink-2', hex: '#1c202a', note: 'Elevated surface' },
  { name: 'line', cls: 'bg-line', hex: 'rgba(237,239,243,0.1)', note: 'Borders' },
  { name: 'text-hi', cls: 'bg-text-hi', hex: '#edeff3', note: '17:1 on ink-0' },
  { name: 'text-lo', cls: 'bg-text-lo', hex: '#9ba3b0', note: '7.6:1 on ink-0' },
  { name: 'signal', cls: 'bg-signal', hex: '#ffb547', note: '10.7:1 on ink-0 — accent' },
  { name: 'beacon', cls: 'bg-beacon', hex: '#62d9c9', note: 'Data-viz only' },
  { name: 'paper', cls: 'bg-paper', hex: '#f4f1ea', note: 'Light surface' },
  { name: 'paper-ink', cls: 'bg-paper-ink', hex: '#16181d', note: 'Text on paper' },
  { name: 'paper-mute', cls: 'bg-paper-mute', hex: '#565b66', note: 'Muted on paper' },
]

const TYPE_SAMPLES = [
  {
    label: 'font-display / Black / 5xl',
    className: 'font-display font-black text-5xl text-text-hi',
    sample: 'THE NETWORK',
  },
  {
    label: 'font-display / Black / 3xl',
    className: 'font-display font-black text-3xl text-text-hi',
    sample: 'Systems that move things',
  },
  {
    label: 'font-serif / Italic / xl',
    className: 'font-serif italic text-xl text-text-lo',
    sample: 'Instrument Serif — editorial voice',
  },
  {
    label: 'font-mono / Regular / base',
    className: 'font-mono text-base text-text-hi',
    sample: 'NDC-00 · Scaffold · 2026-07',
  },
  {
    label: 'font-mono / Tracking-widest / xs uppercase',
    className: 'font-mono text-xs tracking-widest uppercase text-text-lo',
    sample: '01 / SELECTED SYSTEMS',
  },
  {
    label: 'font-body / Regular / base',
    className: 'font-body text-base text-text-hi leading-relaxed',
    sample: 'Body copy. Arquivo Variable handles both display and body in this system.',
  },
]

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  number,
  label,
  children,
}: {
  number: string
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="py-16 border-b border-line">
      <SectionLabel number={number} label={label} className="mb-10" />
      {children}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KitchenSink() {
  return (
    <>
      <SEOHead
        title="Kitchen Sink — Pranita Sapkal"
        description="Component and token reference for THE NETWORK design system."
      />
      <main id="main" className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <h1 className="font-display font-black text-4xl md:text-6xl text-text-hi mb-2">
          Kitchen Sink
        </h1>
        <p className="font-mono text-sm text-text-lo mb-16">
          Token swatches · type ramp · every primitive + chrome component
        </p>

        {/* ── 01 Color tokens ─────────────────────────────────────────────── */}
        <Section number="01" label="COLOR TOKENS">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COLORS.map(({ name, cls, hex, note }) => (
              <div key={name} className="flex flex-col gap-2">
                <div
                  className={`${cls} h-16 rounded-lg border border-line`}
                />
                <div>
                  <p className="font-mono text-xs text-text-hi">{name}</p>
                  <p className="font-mono text-[10px] text-text-lo">{hex}</p>
                  <p className="font-mono text-[10px] text-text-lo">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 02 Type ramp ─────────────────────────────────────────────────── */}
        <Section number="02" label="TYPE RAMP">
          <div className="flex flex-col gap-8">
            {TYPE_SAMPLES.map(({ label, className, sample }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-text-lo tracking-widest uppercase">
                  {label}
                </span>
                <span className={className}>{sample}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 03 Button ────────────────────────────────────────────────────── */}
        <Section number="03" label="BUTTON">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="solid">Solid Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="solid" href="https://example.com" target="_blank" rel="noopener noreferrer">
              Solid Link ↗
            </Button>
            <Button variant="ghost" href="#main">
              Ghost Link
            </Button>
          </div>
          <p className="font-mono text-xs text-text-lo mt-4">
            Hover to see TEXT-ROLL effect · 500ms cubic-bezier(0.65,0,0.35,1)
          </p>
        </Section>

        {/* ── 04 ArrowCircle ───────────────────────────────────────────────── */}
        <Section number="04" label="ARROW CIRCLE">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="group flex items-center gap-3 cursor-pointer">
              <ArrowCircle size={40} />
              <span className="font-mono text-sm text-text-lo">hover parent (group)</span>
            </div>
            <div className="group flex items-center gap-3 cursor-pointer">
              <ArrowCircle size={56} />
              <span className="font-mono text-sm text-text-lo">size 56</span>
            </div>
          </div>
        </Section>

        {/* ── 05 MagneticWrap ──────────────────────────────────────────────── */}
        <Section number="05" label="MAGNETIC WRAP">
          <MagneticWrap className="inline-block" strength={4}>
            <div className="w-32 h-32 rounded-full bg-ink-2 border border-signal flex items-center justify-center">
              <span className="font-mono text-xs text-signal">HOVER ME</span>
            </div>
          </MagneticWrap>
          <p className="font-mono text-xs text-text-lo mt-4">
            Inert on touch + reduced motion · strength=4
          </p>
        </Section>

        {/* ── 06 WordsPullUp ───────────────────────────────────────────────── */}
        <Section number="06" label="WORDS PULL UP">
          <WordsPullUp
            as="h2"
            className="font-display font-black text-4xl md:text-5xl text-text-hi"
          >
            Scroll to trigger word reveal animation
          </WordsPullUp>
          <p className="font-mono text-xs text-text-lo mt-4">
            y:24→0 · stagger 0.06s · ScrollTrigger once:true
          </p>
        </Section>

        {/* ── 07 ScrollFadeParagraph ───────────────────────────────────────── */}
        <Section number="07" label="SCROLL FADE PARAGRAPH">
          <ScrollFadeParagraph className="font-body text-xl text-text-hi leading-relaxed max-w-2xl">
            Each word fades from opacity 0.2 to 1 as you scroll through this paragraph. The effect is scrubbed to scroll position between start 80% and end 35% of the viewport.
          </ScrollFadeParagraph>
        </Section>

        {/* ── 08 SectionLabel ──────────────────────────────────────────────── */}
        <Section number="08" label="SECTION LABEL">
          <div className="flex flex-col gap-4">
            <SectionLabel number="01" label="SELECTED SYSTEMS" />
            <SectionLabel number="02" label="TOOLKIT" />
            <SectionLabel number="03" label="PROCESS" />
          </div>
        </Section>

        {/* ── 09 StatCallout ───────────────────────────────────────────────── */}
        <Section number="09" label="STAT CALLOUT">
          <div className="flex flex-wrap gap-12">
            <StatCallout value="3.4×" label="Faster dispatch" fuzzed />
            <StatCallout value="~80%" label="Reduction in manual effort" fuzzed />
            <StatCallout value="12" label="Screens shipped" />
          </div>
          <p className="font-mono text-xs text-text-lo mt-4">
            fuzzed=true appends <Asterisk /> (tooltip: "Directionally accurate; intentionally fuzzed.")
          </p>
        </Section>

        {/* ── 10 Asterisk ──────────────────────────────────────────────────── */}
        <Section number="10" label="ASTERISK">
          <p className="font-body text-lg text-text-hi">
            Metric reduced dispatch time by 60%<Asterisk /> — hover the asterisk to see tooltip.
          </p>
        </Section>

        {/* ── 11 PillTag ───────────────────────────────────────────────────── */}
        <Section number="11" label="PILL TAG">
          <div className="flex flex-wrap gap-2">
            <PillTag>Figma</PillTag>
            <PillTag>React</PillTag>
            <PillTag>GSAP</PillTag>
            <PillTag>Lenis</PillTag>
            <PillTag>Tailwind v4</PillTag>
            <PillTag>TypeScript</PillTag>
          </div>
        </Section>

        {/* ── 12 BrowserFrame ──────────────────────────────────────────────── */}
        <Section number="12" label="BROWSER FRAME">
          <BrowserFrame slug="ndc.valmo.in/dispatch" className="max-w-xl">
            <div className="w-full h-48 bg-ink-1 flex items-center justify-center">
              <span className="font-mono text-xs text-text-lo">screenshot slot</span>
            </div>
          </BrowserFrame>
        </Section>

        {/* ── 13 PhoneFrame ────────────────────────────────────────────────── */}
        <Section number="13" label="PHONE FRAME">
          <PhoneFrame>
            <div className="w-full h-64 bg-ink-1 flex items-center justify-center">
              <span className="font-mono text-xs text-text-lo">screenshot slot</span>
            </div>
          </PhoneFrame>
        </Section>

        {/* ── 14 Motion constants ───────────────────────────────────────────── */}
        <Section number="14" label="MOTION CONSTANTS">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'micro', value: '200ms' },
              { name: 'reveal', value: '600ms' },
              { name: 'crossfade', value: '650ms' },
              { name: 'camera', value: '1200ms' },
            ].map(({ name, value }) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="font-mono text-signal text-2xl">{value}</span>
                <span className="font-mono text-xs text-text-lo uppercase tracking-widest">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-text-lo mt-6">
            Master ease: cubic-bezier(0.65, 0, 0.35, 1)
          </p>
        </Section>
      </main>
    </>
  )
}
