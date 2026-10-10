import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * Rooted: AI plant care for Yantrava Labs. Case 04.
 * Same block format as the Valmo cases: Geist / Geist Mono / Inspiration, light page.
 * Content follows the v2 copy draft in reactive-resume/tasks/case-studies/rooted.md.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 6000
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/rooted"
const img = (n: string) => `${CDN}/${n}.jpg`

const C = {
    page: "#FFFFFF",
    grey: "#9E9E9E",
    label: "#424242",
    body: "#242424",
    head: "#000000",
    line: "rgba(0,0,0,0.12)",
    plate: "rgba(0,0,0,0.04)",
}
const SANS = '"Geist", "Inter", system-ui, sans-serif'
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, monospace'
const SCRIPT = '"Inspiration", "Geist", cursive'

// ── primitives ───────────────────────────────────────────────────────────────

function Reveal({ children, style }: any) {
    const ref = useRef<HTMLDivElement>(null)
    const [on, setOn] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setOn(true)
            return
        }
        const io = new IntersectionObserver(
            ([e]) => e.isIntersecting && (setOn(true), io.disconnect()),
            { rootMargin: "0px 0px -12% 0px" }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])
    return (
        <div
            ref={ref}
            style={{
                opacity: on ? 1 : 0,
                transform: on ? "none" : "translateY(14px)",
                transition:
                    "opacity .7s cubic-bezier(.65,0,.35,1), transform .7s cubic-bezier(.65,0,.35,1)",
                ...style,
            }}
        >
            {children}
        </div>
    )
}

const Label = ({ children }: any) => (
    <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase" }}>
        {children}
    </div>
)

const Rule = ({ top = 0, bottom = 0 }) => (
    <div style={{ height: 1, background: C.line, marginTop: top, marginBottom: bottom }} />
)

function Shot({ src, alt, cap, ratio }: any) {
    return (
        <figure style={{ margin: 0 }}>
            <div
                style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${C.line}`,
                    background: "#173A2B",
                    ...(ratio ? { aspectRatio: ratio } : {}),
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    style={
                        ratio
                            ? { display: "block", width: "100%", height: "100%", objectFit: "contain" }
                            : { display: "block", width: "100%", height: "auto" }
                    }
                />
            </div>
            {cap && (
                <figcaption style={{ font: `400 13px/1.6 ${MONO}`, color: C.label, marginTop: 12, letterSpacing: "0.02em" }}>
                    {cap}
                </figcaption>
            )}
        </figure>
    )
}

function Title({ pre, script, post }: any) {
    return (
        <h2
            style={{
                margin: 0,
                font: `500 clamp(30px,4.4vw,54px)/1.05 ${SANS}`,
                letterSpacing: "-0.03em",
                color: C.head,
                textTransform: "uppercase",
            }}
        >
            {pre}
            {script && (
                <span style={{ font: `400 1.25em/0.8 ${SCRIPT}`, textTransform: "none", padding: "0 .08em" }}>
                    {script}
                </span>
            )}
            {post}
        </h2>
    )
}

const Body = ({ children, max = 640, dim = false }: any) => (
    <p style={{ margin: 0, maxWidth: max, font: `400 clamp(16px,1.25vw,19px)/1.65 ${SANS}`, color: dim ? C.label : C.body }}>
        {children}
    </p>
)

function Section({ children, pad = "clamp(72px,9vw,140px)" }: any) {
    return (
        <section style={{ padding: `${pad} clamp(20px,5vw,80px)` }}>
            <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
                {children}
            </div>
        </section>
    )
}

function Numbered({ items }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((w: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "18px 0", borderTop: `1px solid ${C.line}` }}>
                    <span
                        style={{
                            flex: "0 0 26px",
                            height: 26,
                            borderRadius: 26,
                            border: `1px solid ${C.line}`,
                            font: `500 12px/24px ${MONO}`,
                            color: C.body,
                            textAlign: "center",
                        }}
                    >
                        {i + 1}
                    </span>
                    <span style={{ font: `400 15px/1.6 ${SANS}`, color: C.body }}>{w}</span>
                </div>
            ))}
        </div>
    )
}

// ── content ──────────────────────────────────────────────────────────────────

const SETUP: [string, string][] = [
    [
        "Plants don't die of neglect.",
        "They die of generic advice. “Water once a week” ignores pot material, light, humidity and the weather outside the window.",
    ],
    [
        "The category is reminder apps in a leaf icon.",
        "They tell you when you said to water, not when the plant needs it.",
    ],
    [
        "The wedge had to be credibility.",
        "Rooted enters a crowded market as an unknown brand. Science instead of guesswork has to feel true on every screen, not just claim it on a landing page.",
    ],
]

const USERS: [string, string, string][] = [
    [
        "Anxious novices",
        "think in problems",
        "“The leaf is yellowing. Am I killing it?” They need diagnosis and reassurance, one plant at a time.",
    ],
    [
        "Collectors",
        "think in routines",
        "Thirty plants and a system. They need density, batch actions and control.",
    ],
]

const SPACES: [string, string][] = [
    ["Today", "What needs me right now?"],
    ["My Garden", "Show me everything I own"],
    ["Identify", "What is this plant?"],
    ["Dr. Rooted", "What's wrong with it?"],
    ["Community & Swap", "Show me people like me"],
]

const MULTIPLIERS: [string, string][] = [
    [
        "Dark mode",
        "System-following, and both themes designed with equal care rather than one inverted from the other.",
    ],
    [
        "Ten languages",
        "German string lengths and Devanagari metrics stress-test every component. Nothing is allowed to truncate meaningfully.",
    ],
    [
        "Offline-first",
        "Every screen has a no-network state that still feels alive. The honest cost: without live weather the schedule falls back to its last-known model, and the UI says so.",
    ],
]

const SCREENS: [string, string, string][] = [
    ["identify", "Identify", "Photo first. The front door of the product is a “wow” within seconds, not a questionnaire."],
    ["home", "Today", "The day's care, and the weather that shaped it: the app explains why today's list changed."],
    ["garden", "My Garden", "Sites, plants and photos. Collection pride lives here, one tap from the routine."],
    ["diagnose", "Dr. Rooted", "Diagnosis against a 25-pest library, always paired with what to do next."],
    ["reminders", "Plant care", "Water, light and toxicity on the plant page: the reference, not the routine."],
    ["progress", "Progress", "Growth over time, because the reward for good care is slow and needs showing."],
    ["swap", "Community & Swap", "Listings by species and distance: plant people trading with plant people in the same city."],
    ["languages", "Ten languages", "Localisation as a first-class state, not a late pass over finished screens."],
]

const TRADEOFFS: [string, string, string][] = [
    [
        "Task-first home over garden-first home",
        "A home screen that opens on the collection",
        "Collection pride lost to the habit loop. A per-plant model makes a twenty-plant garden a twenty-tap chore; a task-first dashboard makes daily care a single glance. Softened by seasonal garden art one tap away.",
    ],
    [
        "Participation over verdicts in AI results",
        "A single confident answer, delivered as fact",
        "One confident-but-wrong identification destroys trust permanently, and raw percentages read as hedging. Ranked candidates plus the distinguishing features to check yourself (leaf shape, underside texture) make the user part of the confirmation. Slightly more friction, much more durable trust.",
    ],
    [
        "Offline honesty over fake liveness",
        "A schedule that keeps looking current when it isn't",
        "A labelled fallback beats a silently stale schedule. If the weather model is the last-known one, the screen says so.",
    ],
]

const OUTCOMES = [
    "Rooted is live on iOS and Android.",
    "The design system carried dark mode and all ten locales without per-screen redesign.",
    "Identification-first onboarding became the product's core activation story.",
    "Early feedback keeps validating the wedge: people describe it as the first app that explains why today's care list changed.",
]

const NUMBERS: [string, string][] = [
    ["5", "spaces"],
    ["2", "platforms"],
    ["10", "languages"],
    ["25", "pest library"],
]

// ── page ─────────────────────────────────────────────────────────────────────

// Fonts load through a <link> added after hydration; an @import inside a rendered <style> makes Framer's server
// render differ from the browser's, which forces a full client re-render (and the desktop navbar on phones).
function useFonts(href: string) {
    useEffect(() => {
        if ([...document.querySelectorAll("link[data-pf-font]")].some((l) => l.getAttribute("data-pf-font") === href)) return
        const l = document.createElement("link")
        l.rel = "stylesheet"
        l.href = href
        l.setAttribute("data-pf-font", href)
        document.head.appendChild(l)
    }, [])
}

export default function RootedCase(props: any) {
    useFonts("https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap")
    const { backLabel = "← Work" } = props
    return (
        <div style={{ background: C.page, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>
                {`.rt-grid{display:grid;gap:28px}
                  @media(max-width:900px){.rt-2,.rt-3,.rt-4,.rt-split{grid-template-columns:1fr!important}}`}
            </style>

            {/* 01 · hero */}
            <Section pad="clamp(96px,11vw,180px)">
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Label>[case 04] &nbsp;yantrava labs · consumer mobile · ios + android · 0→1</Label>
                    <h1
                        style={{
                            margin: 0,
                            font: `500 clamp(34px,5.6vw,76px)/1.03 ${SANS}`,
                            letterSpacing: "-0.035em",
                            color: C.head,
                            textTransform: "uppercase",
                        }}
                    >
                        Houseplants don't die of neglect. They die of{" "}
                        <span style={{ font: `400 1.15em/0.8 ${SCRIPT}`, textTransform: "none" }}>generic</span> advice
                    </h1>
                    <Body max={800}>
                        Rooted is an AI plant-care app: identification, care scheduling, diagnosis and community, across
                        iOS and Android, light and dark, in ten languages. I was the sole designer: information
                        architecture, every flow, the design system, dark mode and localisation-ready layouts.
                    </Body>
                    <div className="rt-grid rt-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 28, marginTop: 12 }}>
                        <Shot src={img("identify")} alt="Rooted: plant identification" ratio="9 / 16" />
                        <Shot src={img("home")} alt="Rooted: the Today dashboard" ratio="9 / 16" />
                        <Shot src={img("garden")} alt="Rooted: My Garden" ratio="9 / 16" />
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 02 · the problem */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[the problem]</Label>
                    <div className="rt-grid rt-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {SETUP.map(([t, d]) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ font: `500 21px/1.25 ${SANS}`, color: C.head }}>{t}</div>
                                <Body dim>{d}</Body>
                            </div>
                        ))}
                    </div>
                    <Rule top={8} />
                    <Label>[who it is for]</Label>
                    <Title pre="Two people, two mental " script="models" />
                    <div className="rt-grid rt-2" style={{ gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                        {USERS.map(([who, how, what]) => (
                            <div key={who} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `2px solid ${C.head}`, paddingTop: 16 }}>
                                <div style={{ font: `500 22px/1.25 ${SANS}`, color: C.head }}>{who}</div>
                                <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.12em", color: C.label, textTransform: "uppercase" }}>
                                    {how}
                                </div>
                                <Body dim>{what}</Body>
                            </div>
                        ))}
                    </div>
                    <Body max={880}>
                        Both groups complain about the same two things: schedules that ignore reality, and
                        identification delivered with false confidence. Those became the product's two hardest design
                        problems.
                    </Body>
                </Reveal>
            </Section>

            <Rule />

            {/* 03 · IA */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[information architecture]</Label>
                    <Title pre="Five spaces, mapped to intent, not to " script="features" />
                    <div className="rt-grid" style={{ gridTemplateColumns: "1fr", gap: 0 }}>
                        {SPACES.map(([name, q]) => (
                            <div
                                key={name}
                                className="rt-grid rt-split"
                                style={{
                                    gridTemplateColumns: "260px 1fr",
                                    gap: 24,
                                    padding: "18px 0",
                                    borderTop: `1px solid ${C.line}`,
                                    alignItems: "baseline",
                                }}
                            >
                                <div style={{ font: `500 19px/1.3 ${SANS}`, color: C.head }}>{name}</div>
                                <div style={{ font: `400 16px/1.6 ${SANS}`, color: C.label }}>{q}</div>
                            </div>
                        ))}
                    </div>
                    <Body max={880}>
                        The defining decision: <strong>care tasks live on Today, not inside each plant.</strong> A
                        per-plant model makes a twenty-plant garden a twenty-tap chore. A task-first dashboard makes
                        daily care a single glance, grouped by action: water these three, mist these two. Plant pages
                        stay the reference; Today is the routine.
                    </Body>
                </Reveal>
            </Section>

            {/* 04 · the flow that almost shipped wrong */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[the flow that almost shipped wrong]</Label>
                    <Title pre="Same questions, opposite emotional " script="order" />
                    <div className="rt-grid rt-split" style={{ gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <Body dim>
                                My first onboarding concept front-loaded the science: seven setup questions about pot
                                type, light and room humidity before the app showed any value. It made the schedule
                                smarter and the first run worse: in early walkthroughs people visibly lost patience
                                before ever seeing a plant identified.
                            </Body>
                            <Body dim>
                                So I inverted it. Identification became the front door: photo first, a result within
                                seconds, and the environment questions moved after the first plant joins the garden,
                                asked one at a time, in context. “Where does this one live?” Same data collected. This
                                single reversal did more for activation than any visual polish.
                            </Body>
                        </div>
                        <Shot
                            src={img("identify")}
                            alt="Identification as the front door"
                            cap="Photo first. The questions come later, one at a time, once there is a plant to ask about."
                        />
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 05 · AI honestly */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[showing ai honestly]</Label>
                    <Title pre="Uncertainty framed as rigour, not " script="weakness" />
                    <div className="rt-grid rt-split" style={{ gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
                        <Shot
                            src={img("diagnose")}
                            alt="Dr. Rooted diagnosis"
                            cap="Dr. Rooted diagnoses against a 25-pest library the same way, always paired with what to do next."
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <Body dim>
                                Identification runs multiple models with ensemble voting, so the design question was how
                                to present uncertainty without breaking the botanist-not-a-guesser promise. One
                                confident-but-wrong answer destroys trust permanently. Raw percentages read as hedging.
                            </Body>
                            <Body dim>
                                The shipped pattern: ranked candidates with a clear confidence treatment, plus the
                                distinguishing features to check yourself (leaf shape, underside texture) so the user
                                participates in the confirmation instead of receiving a verdict. The same principle runs
                                through diagnosis, which meets people at their most anxious.
                            </Body>
                        </div>
                    </div>
                </Reveal>
            </Section>

            {/* 06 · three multipliers */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[a system built for three multipliers]</Label>
                    <Title pre="Every screen had to survive all three at " script="once" />
                    <Body max={860} dim>
                        Which is why the design system was tokenised from day one rather than retrofitted.
                    </Body>
                    <div className="rt-grid rt-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {MULTIPLIERS.map(([t, d], i) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `2px solid ${C.head}`, paddingTop: 16 }}>
                                <div style={{ font: `400 12px/1.4 ${MONO}`, color: C.grey }}>{String(i + 1).padStart(2, "0")}</div>
                                <div style={{ font: `500 20px/1.25 ${SANS}`, color: C.head }}>{t}</div>
                                <div style={{ font: `400 15px/1.6 ${SANS}`, color: C.label }}>{d}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 07 · the screens */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[the product]</Label>
                    <Title pre="Eight surfaces, one " script="habit" />
                    <div className="rt-grid rt-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
                        {SCREENS.map(([f, t, cap]) => (
                            <div key={f} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <Shot src={img(f)} alt={t} ratio="9 / 16" />
                                <div style={{ font: `500 16px/1.3 ${SANS}`, color: C.head }}>{t}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{cap}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 08 · trade-offs */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[three trade-offs i'd defend]</Label>
                    <div className="rt-grid rt-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {TRADEOFFS.map(([d, r, w]) => (
                            <div
                                key={d}
                                style={{
                                    border: `1px solid ${C.line}`,
                                    borderRadius: 14,
                                    padding: 28,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    background: C.plate,
                                }}
                            >
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase" }}>
                                    decision
                                </div>
                                <div style={{ font: `500 19px/1.3 ${SANS}`, color: C.head }}>{d}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase", marginTop: 14 }}>
                                    rejected
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{r}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.body, textTransform: "uppercase", marginTop: 14 }}>
                                    why
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{w}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 09 · outcome */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[outcome]</Label>
                    <div className="rt-grid rt-split" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {OUTCOMES.map((o) => (
                                <div
                                    key={o}
                                    style={{
                                        padding: "20px 0",
                                        borderTop: `1px solid ${C.line}`,
                                        font: `400 clamp(16px,1.3vw,20px)/1.55 ${SANS}`,
                                        color: C.body,
                                    }}
                                >
                                    {o}
                                </div>
                            ))}
                        </div>
                        <div className="rt-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}>
                            {NUMBERS.map(([n, l]) => (
                                <div key={l}>
                                    <div style={{ font: `500 clamp(30px,3.6vw,44px)/1 ${SANS}`, letterSpacing: "-0.03em", color: C.head }}>
                                        {n}
                                    </div>
                                    <div style={{ font: `400 12px/1.5 ${MONO}`, letterSpacing: "0.1em", color: C.label, textTransform: "uppercase", marginTop: 8 }}>
                                        {l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Rule top={16} />

                    <Label>[what i learned]</Label>
                    <Body max={900}>
                        Designing for AI confidence changed how I present certainty in everything, including the
                        enterprise work: dashboards make claims too. And being the only designer across a whole
                        product taught me the discipline of sequencing: on a small team, the order you design things
                        in <em>is</em> the strategy.
                    </Body>

                    <Rule top={16} />

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "center" }}>
                        <a
                            href="/#work"
                            style={{
                                font: `500 12px/1.4 ${MONO}`,
                                letterSpacing: "0.14em",
                                color: C.label,
                                textTransform: "uppercase",
                                textDecoration: "none",
                            }}
                        >
                            {backLabel}
                        </a>
                        <span style={{ font: `400 12px/1.4 ${MONO}`, letterSpacing: "0.1em", color: C.label, textTransform: "uppercase" }}>
                            yantrava labs · live
                        </span>
                    </div>
                </Reveal>
            </Section>
        </div>
    )
}

addPropertyControls(RootedCase, {
    backLabel: { type: ControlType.String, title: "Back label", defaultValue: "← Work" },
})
