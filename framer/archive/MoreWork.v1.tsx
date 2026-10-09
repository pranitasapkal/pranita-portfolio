import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * MoreWork — replaces the template's SERVICES fold on Home with the three sections
 * from the previous portfolio: the Rooted showcase, "Not everything fits in a case
 * study", and the Figma plugins. Dark fold, same theme as the rest of the site:
 * Geist, Geist Mono [BRACKET] labels, one Inspiration script word per headline.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 3200
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN = "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public"
const SHOTS = Array.from({ length: 8 }, (_, i) => `${CDN}/rooted/shot-${String(i + 1).padStart(2, "0")}.webp`)

const C = {
    bg: "#0E0E0E",
    head: "#FFFFFF",
    body: "#E0E0E0",
    dim: "#9E9E9E",
    line: "rgba(255,255,255,0.14)",
    plate: "rgba(255,255,255,0.04)",
    plateHover: "rgba(255,255,255,0.07)",
}
const SANS = '"Geist", "Inter", system-ui, sans-serif'
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, monospace'
const SCRIPT = '"Inspiration", "Geist", cursive'
const EASE = "cubic-bezier(.65,0,.35,1)"

// ── content ──────────────────────────────────────────────────────────────────

const ROOTED = {
    label: "[SIDE QUEST, SHIPPED]",
    pre: "Rooted: care for plants like a ",
    script: "botanist",
    post: ", not a guesser.",
    subline:
        "A plant-care app designed end to end and live on the App Store. From a photo to the watering schedule your plant needs.",
    steps: [
        ["STEP 01", "Snap a photo", "Point your camera at any houseplant and Rooted returns a species match in seconds, even for plants you have never seen before."],
        ["STEP 02", "Get personalised plant care", "Tell Rooted about your pot, your light, and the plant's spot in your home. Each answer tunes the watering plan for that species."],
        ["STEP 03", "Right reminder at the right moment", "Today and Upcoming views group tasks by plant. One tap marks watering done, and undo is always there if you hit the chip by mistake."],
    ] as [string, string, string][],
    cta: ["Visit rootedplant.org", "https://rootedplant.org/"] as [string, string],
}

type Card = { meta: string[]; status?: string; title: string; desc: string; href?: string }
const CARDS: Card[] = [
    {
        meta: ["WEBSITE", "BRAND"],
        status: "LIVE",
        title: "Yantrava Labs Website",
        desc: "Studio site for Yantrava Labs: brand direction, type system, and page design for the venture holding the products.",
        href: "https://yantrava.com/",
    },
    {
        meta: ["WEBSITE", "B2B"],
        status: "EARLIER WORK",
        title: "Tibil Website",
        desc: "End-to-end product website design for a B2B fintech startup: information architecture, visual system, and responsive layout.",
    },
    {
        meta: ["WEBSITE", "HR-TECH"],
        status: "EARLIER WORK",
        title: "Evaluationz Website",
        desc: "Brand and product website for an HR-tech platform. Designed the full component library and led visual direction.",
    },
    {
        meta: ["MOBILE APP", "MULTI-SERVICE"],
        status: "EARLIER WORK",
        title: "DoJoin Ride",
        desc: "A multi-service app for the UAE: taxis, limousine bookings, Umrah packages, food and groceries under one account and one checkout.",
        href: "/dojoin",
    },
]

const PLUGINS: [string, string, string][] = [
    ["AUDIT", "IA Auditor", "Validates frames against the IA spec: checks column order, identity blocks, and tab naming."],
    ["ENFORCE", "DS Enforcer", "Catches detached components and hardcoded colours against the design system."],
    ["CHECK", "State Checker", "Verifies that every screen group ships its full state matrix: default, loading, empty, error, modal."],
    ["ENFORCE", "Token Police", "Flags unbound fills, off-scale font sizes, and spacing values that miss the token grid."],
    ["SPEC", "Handoff Spec", "Generates annotated spec cards next to frames: dimensions, colour palette, typography summary, spacing values."],
    ["GENERATE", "State Generator", "Clones a default frame for each missing state and positions the variants in a labelled row."],
    ["SYNC", "Prototype Sync", "Copies auto-layout, fills, strokes, and radii from a source frame to all selected targets."],
]

// ── primitives ───────────────────────────────────────────────────────────────

function Reveal({ children, style, className }: any) {
    const ref = useRef<HTMLDivElement>(null)
    const [on, setOn] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setOn(true)
            return
        }
        const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { rootMargin: "0px 0px -12% 0px" })
        io.observe(el)
        return () => io.disconnect()
    }, [])
    return (
        <div ref={ref} className={className} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(14px)", transition: `opacity .7s ${EASE}, transform .7s ${EASE}`, ...style }}>
            {children}
        </div>
    )
}

const Label = ({ children }: any) => (
    <div style={{ font: `400 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase" }}>{children}</div>
)

function Headline({ pre, script, post }: any) {
    return (
        <h2 style={{ margin: 0, font: `500 clamp(30px,4vw,52px)/1.05 ${SANS}`, letterSpacing: "-0.03em", color: C.head, textTransform: "uppercase", maxWidth: 980 }}>
            {pre}
            {script && <span style={{ font: `400 1.25em/0.8 ${SCRIPT}`, textTransform: "none", padding: "0 .08em" }}>{script}</span>}
            {post}
        </h2>
    )
}

const Body = ({ children, max = 720 }: any) => (
    <p style={{ margin: 0, maxWidth: max, font: `400 clamp(15px,1.15vw,18px)/1.65 ${SANS}`, color: C.dim }}>{children}</p>
)

const Pill = ({ children }: any) => (
    <span style={{ font: `400 10px/1 ${MONO}`, letterSpacing: "0.12em", color: C.body, border: `1px solid ${C.line}`, borderRadius: 999, padding: "5px 9px", textTransform: "uppercase" }}>{children}</span>
)

function CardShell({ href, children }: any) {
    const [hover, setHover] = useState(false)
    const style: any = {
        display: "flex", flexDirection: "column", gap: 14, padding: 28, borderRadius: 14,
        border: `1px solid ${hover ? "rgba(255,255,255,0.28)" : C.line}`, background: hover ? C.plateHover : C.plate,
        color: "inherit", textDecoration: "none", transition: `background .3s ${EASE}, border-color .3s ${EASE}`, height: "100%", boxSizing: "border-box",
    }
    const ext = href && /^https?:/.test(href)
    return href ? (
        <a href={href} target={ext ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined} style={style} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{children}</a>
    ) : (
        <div style={style}>{children}</div>
    )
}

function Marquee({ speed, cardW, cardH, gap }: any) {
    const row = [...SHOTS, ...SHOTS]
    const track = SHOTS.length * (cardW + gap)
    return (
        <div className="mw-wrap" style={{ width: "100%", overflow: "hidden", WebkitMaskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)", maskImage: "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)" }}>
            <style>{`
                @keyframes mw-marquee { from { transform: translateX(0) } to { transform: translateX(-${track}px) } }
                .mw-track { animation: mw-marquee ${track / speed}s linear infinite; }
                .mw-wrap:hover .mw-track { animation-play-state: paused; }
                @media (prefers-reduced-motion: reduce) { .mw-track { animation: none; } }
            `}</style>
            <div className="mw-track" style={{ display: "flex", gap, width: "max-content" }}>
                {row.map((src, i) => (
                    <figure key={`${src}-${i}`} style={{ margin: 0, flex: `0 0 ${cardW}px`, width: cardW, height: cardH, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`, background: "#123324" }}>
                        <img src={src} alt="Rooted App Store screenshot" loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                    </figure>
                ))}
            </div>
        </div>
    )
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function MoreWork(props: any) {
    const { shotW = 240, shotGap = 20, speed = 50 } = props
    const shotH = Math.round(shotW * (1039 / 480))
    return (
        <div style={{ background: C.bg, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap');
                .mw-grid{display:grid;gap:24px}
                @media(max-width:1000px){.mw-3,.mw-4{grid-template-columns:repeat(2,1fr)!important}}
                @media(max-width:640px){.mw-3,.mw-4{grid-template-columns:1fr!important}}`}</style>

            {/* fold title, in the template's manner */}
            <section style={{ padding: "clamp(72px,9vw,140px) clamp(20px,5vw,80px) 0" }}>
                <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "flex-end", gap: 28, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, font: `400 clamp(64px,9vw,128px)/0.9 ${SANS}`, letterSpacing: "-0.04em", color: C.head, textTransform: "uppercase" }}>
                        MO<span style={{ font: `400 1.1em/0.8 ${SCRIPT}`, textTransform: "none" }}>re</span>
                    </h2>
                    <div style={{ paddingBottom: 14 }}><Label>[BEYOND THE CASE FILES]</Label></div>
                </div>
            </section>

            {/* 1 · Rooted */}
            <section style={{ padding: "clamp(56px,7vw,110px) clamp(20px,5vw,80px)" }}>
                <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>
                    <Reveal style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <Label>{ROOTED.label}</Label>
                        <Headline pre={ROOTED.pre} script={ROOTED.script} post={ROOTED.post} />
                        <Body>{ROOTED.subline}</Body>
                    </Reveal>
                    <Reveal>
                        <Marquee speed={speed} cardW={shotW} cardH={shotH} gap={shotGap} />
                    </Reveal>
                    <Reveal className="mw-grid mw-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                        {ROOTED.steps.map(([n, t, d]) => (
                            <div key={n} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 28, background: C.plate, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.dim }}>{n}</div>
                                <div style={{ font: `500 19px/1.3 ${SANS}`, color: C.head }}>{t}</div>
                                <div style={{ font: `400 15px/1.6 ${SANS}`, color: C.dim }}>{d}</div>
                            </div>
                        ))}
                    </Reveal>
                    <Reveal>
                        <a href={ROOTED.cta[1]} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", textTransform: "uppercase", color: C.head, textDecoration: "none", borderBottom: `1px solid ${C.head}`, paddingBottom: 6 }}>
                            {ROOTED.cta[0]} <span aria-hidden="true">↗</span>
                        </a>
                    </Reveal>
                </div>
            </section>

            <div style={{ height: 1, background: C.line }} />

            {/* 2 · Beyond the case files */}
            <section style={{ padding: "clamp(56px,7vw,110px) clamp(20px,5vw,80px)" }}>
                <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>
                    <Reveal style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <Label>[MORE WORK]</Label>
                        <Headline pre="Not everything fits in a " script="case study" post="." />
                        <Body>Side builds, earlier lives, and the kind of work that never gets a write-up.</Body>
                    </Reveal>
                    <Reveal className="mw-grid mw-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                        {CARDS.map((c) => (
                            <CardShell key={c.title} href={c.href}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                    <span style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.dim }}>{c.meta.join(" · ")}</span>
                                    {c.status && <Pill>{c.status}</Pill>}
                                </div>
                                <div style={{ font: `500 20px/1.3 ${SANS}`, color: C.head }}>
                                    {c.title}
                                    {c.href && <span aria-hidden="true" style={{ marginLeft: 8, color: C.dim }}>↗</span>}
                                </div>
                                <div style={{ font: `400 15px/1.6 ${SANS}`, color: C.dim }}>{c.desc}</div>
                            </CardShell>
                        ))}
                    </Reveal>
                </div>
            </section>

            <div style={{ height: 1, background: C.line }} />

            {/* 3 · Plugins */}
            <section style={{ padding: "clamp(56px,7vw,110px) clamp(20px,5vw,80px) clamp(72px,9vw,140px)" }}>
                <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>
                    <Reveal style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <Label>[FIGMA PLUGINS I BUILT]</Label>
                        <Headline pre="I build the tools I wish " script="existed" post="." />
                        <Body>Seven plugins, run daily on production files.</Body>
                    </Reveal>
                    <Reveal className="mw-grid mw-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
                        {PLUGINS.map(([cat, name, d]) => (
                            <CardShell key={name}>
                                <div style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.dim }}>{cat}</div>
                                <div style={{ font: `500 17px/1.3 ${SANS}`, color: C.head, textTransform: "uppercase", letterSpacing: "0.01em" }}>{name}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.dim }}>{d}</div>
                            </CardShell>
                        ))}
                    </Reveal>
                </div>
            </section>
        </div>
    )
}

addPropertyControls(MoreWork, {
    shotW: { type: ControlType.Number, title: "Shot W", defaultValue: 240, min: 140, max: 420 },
    shotGap: { type: ControlType.Number, title: "Shot gap", defaultValue: 20, min: 0, max: 60 },
    speed: { type: ControlType.Number, title: "Speed", defaultValue: 50, min: 10, max: 200 },
})
