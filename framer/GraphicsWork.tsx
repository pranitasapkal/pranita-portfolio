import * as Framer from "framer"
import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * Graphics & brand work: mascot, campaigns, brand systems.
 * Same theme contract as the case pages: Geist / Geist Mono / Inspiration, light page.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 5000
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/graphics"
const img = (n: string) => `${CDN}/${n}`

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
            <div style={{ maxWidth: 1360, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
                {children}
            </div>
        </section>
    )
}

function Plate({ src, alt, cap }: any) {
    return (
        <figure style={{ margin: 0 }}>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, background: C.plate }}>
                <img src={src} alt={alt} loading="lazy" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            {cap && (
                <figcaption style={{ font: `400 14px/1.6 ${MONO}`, color: C.label, marginTop: 12, letterSpacing: "0.02em" }}>
                    {cap}
                </figcaption>
            )}
        </figure>
    )
}

// ── content ──────────────────────────────────────────────────────────────────

const MASCOT: [string, string][] = [
    ["mascot-why-a-robot.png", "Why a robot at all: the argument, before the drawing."],
    ["mascot-moodboard.png", "Moodboard: what a friendly machine already looks like to people."],
    ["mascot-personality.png", "Three traits Cubot had to hold: knowledgeable, approachable, forward-thinking."],
    ["mascot-exploration.png", "Character exploration: a grid of wrong answers on the way to the right one."],
    ["mascot-design-concept.png", "The concept locked: colour, form, face, gesture, and how the logo folds in."],
    ["mascot-pattern.png", "One character, many poses: the pattern that makes it a system, not a sticker."],
    ["mascot-stationery.png", "Stationery."],
    ["mascot-product.jpg", "In the product, where a recruiter actually meets it."],
    ["mascot-merch.jpg", "Cups, signage, a t-shirt: the test of whether a mascot survives being small."],
]

const WIZ: [string, string][] = [
    ["wiz-gokhana.jpg", "GoKhana: food-tech campaign concepts."],
    ["wiz-food-whisperer.jpg", "The Food Whisperer: launch identity and campaign for a new food brand."],
    ["wiz-poochkoo.jpg", "Poochkoo: pet care, where the cuteness has to carry the offer."],
    ["wiz-mamash.jpg", "Mamash: organic skincare, ayurvedic cues as a design element."],
    ["wiz-xencia.png", "Xencia: B2B security campaigns for a Microsoft partner."],
    ["wiz-branding.jpg", "Logo design and branding guidelines: the system behind the posts."],
    ["wiz-comic.jpg", "UKG: a comic strip, because some stories only work as panels."],
    ["wiz-standee.png", "Standee and booth design: the same brand, printed at human height."],
    ["wiz-landing.png", "A landing page built for a campaign, not for a homepage."],
]

// ── page ─────────────────────────────────────────────────────────────────────

// Fonts load through a <link> added after hydration. An @import inside a rendered <style> is rewritten by Framer's
// server render, so the browser's first render no longer matches, React re-renders the whole page on the client,
// and Framer then shows the desktop navbar on phones.
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

// Framer's editor preview: a plain link would load the page into the preview's own sandboxed frame and break it, so
// there the page is switched with Framer's router. The live site keeps the plain link. The "pf-section" event tells
// RadioFooter which section to land on (the preview keeps no anchor in the URL).
const inEditor = () => typeof location !== "undefined" && /(^|\.)framer(canvas)?\.com$/.test(location.hostname)
function useEditorNav() {
    const hook: any = (Framer as any).useRouter
    const router: any = typeof hook === "function" ? hook() : null
    return (e: any, routeId: string, section?: string) => {
        if (!inEditor() || !router || typeof router.navigate !== "function" || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return false
        e.preventDefault()
        router.navigate(routeId, section)
        if (section) setTimeout(() => dispatchEvent(new CustomEvent("pf-section", { detail: section })), 50)
        return true
    }
}

export default function GraphicsWork(props: any) {
    const editorNav = useEditorNav()
    useFonts("https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap")
    const { backLabel = "← Work" } = props
    return (
        <div style={{ background: C.page, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>
                {`.gw-grid{display:grid;gap:28px}
                  @media(max-width:900px){.gw-2,.gw-3,.gw-split{grid-template-columns:1fr!important}}`}
            </style>

            {/* hero */}
            <Section pad="clamp(96px,11vw,180px)">
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Label>[graphics] &nbsp;mascots · campaigns · brand systems</Label>
                    <h1
                        style={{
                            margin: 0,
                            font: `500 clamp(36px,6vw,80px)/1.02 ${SANS}`,
                            letterSpacing: "-0.035em",
                            color: C.head,
                            textTransform: "uppercase",
                        }}
                    >
                        The work that had to be{" "}
                        <span style={{ font: `400 1.15em/0.8 ${SCRIPT}`, textTransform: "none" }}>looked</span>{" "}
                        at, not used
                    </h1>
                    <Body max={800}>
                        Product design is judged on whether someone can finish a task. This is the other half of
                        my practice: a brand mascot, campaign creative across an agency roster, and a social system,
                        judged on whether someone stops scrolling. Same discipline, different proof.
                    </Body>
                </Reveal>
            </Section>

            <Rule />

            {/* 01 · mascot */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[01 · brand mascot]</Label>
                    <Title pre="Cubot, for " script="Curatal" />
                    <div className="gw-grid gw-split" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 48, alignItems: "start" }}>
                        <Plate src={img("mascot-cover.png")} alt="Cubot brand mascot for Curatal" />
                        <Body dim>
                            Curatal is an AI recruitment platform. A robot is the obvious mascot for that and the
                            obvious mascot is usually the wrong one, so the project starts by arguing the case:
                            precision, adaptability, and a machine that is unbiased about candidates. Then it
                            earns the friendliness back with soft curves, a simplified non-human face, and arms
                            that can point at things.
                        </Body>
                    </div>
                    <div className="gw-grid gw-2" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 40 }}>
                        {MASCOT.map(([f, cap]) => (
                            <Plate key={f} src={img(f)} alt={cap} cap={cap} />
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 02 · wizrdom client work */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[02 · campaign & brand work · wizrdom]</Label>
                    <Title pre="One roster, many " script="voices" />
                    <div className="gw-grid gw-split" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 48, alignItems: "start" }}>
                        <Plate src={img("wiz-cover.png")} alt="Wizrdom design portfolio" />
                        <Body dim>
                            Food-tech, pet care, skincare, enterprise security, workplace software. The job in an
                            agency is to be unrecognisable between accounts: a Poochkoo post and a Xencia post
                            should not look like they came from the same hand. What carries across is the
                            structure underneath: one message per asset, and the offer never buried.
                        </Body>
                    </div>
                    <div className="gw-grid gw-2" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 40 }}>
                        {WIZ.map(([f, cap]) => (
                            <Plate key={f} src={img(f)} alt={cap} cap={cap} />
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 03 · own-brand social */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[03 · social system · wizrdom's own brand]</Label>
                    <Title pre="The hardest client is the one you " script="work" post=" for" />
                    <Body max={820} dim>
                        Client work has a brief. This one had none: a marketing agency's own feed, where the
                        posts have to prove the service they are selling. One visual language across dozens of
                        posts: the wordmark in the same corner every time, one loud idea per frame, and copy
                        that earns the pun.
                    </Body>
                    <div
                        style={{
                            borderRadius: 14,
                            overflow: "hidden",
                            border: `1px solid ${C.line}`,
                            background: C.plate,
                            maxHeight: 1200,
                            overflowY: "auto",
                        }}
                    >
                        <img
                            src={img("social-board.jpg")}
                            alt="Wizrdom's own-brand social media posts"
                            loading="lazy"
                            style={{ display: "block", width: "100%", height: "auto" }}
                        />
                    </div>
                    <div style={{ font: `400 13px/1.6 ${MONO}`, color: C.label, letterSpacing: "0.02em" }}>
                        Scroll the board.
                    </div>
                </Reveal>
            </Section>

            <Rule />

            <Section pad="clamp(56px,7vw,100px)">
                <Reveal>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "center" }}>
                        <a
                            href="/#work"
                            onClick={(e) => editorNav(e, "augiA20Il", "work")}
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
                            agency work · published on behance
                        </span>
                    </div>
                </Reveal>
            </Section>
        </div>
    )
}

addPropertyControls(GraphicsWork, {
    backLabel: { type: ControlType.String, title: "Back label", defaultValue: "← Work" },
})
