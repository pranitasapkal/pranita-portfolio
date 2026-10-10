import * as Framer from "framer"
import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * MoreWork: the "More" fold on Home. One section, one grid: every project outside the four case studies gets
 * the same card (cover, meta, title, one line), and the whole card links out to the live site or its Behance
 * page in a new tab. Rooted is one card among six, with no special treatment. Dark fold, same theme as the
 * rest of the site: Geist, Geist Mono [BRACKET] labels, one Inspiration script word in the title.
 * Earlier versions: framer/archive/MoreWork.v1.tsx (three sections), MoreWork.v2.tsx (Rooted feature card).
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 1400
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

// Rooted screenshots from the Rooted marketing site repo (yantrava/rooted-marketing-site, public/screenshots), resized
// to 400px WebP (about 20 KB each, from 1.2 MB PNGs) and hosted with the case studies on GitHub Pages.
const ROOTED_SHOTS = "https://pranitasapkal.github.io/pranita-portfolio/assets/home/rooted"
const BE = "https://mir-s3-cdn-cf.behance.net"

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

type Cover = { img: string; pos?: string } | { shots: string[]; bg: string } | { word: string; bg: string; prop: string }
type Card = { meta: string[]; status: string; title: string; desc: string; href: string; cta: string; cover: Cover }

const CARDS: Card[] = [
    {
        meta: ["MOBILE APP", "SIDE BUILD"],
        status: "LIVE",
        title: "Rooted",
        desc: "An AI plant-care app: identify a plant from a photo, get a watering schedule for its conditions, diagnose problems.",
        href: "https://rootedplant.org/",
        cta: "Visit rootedplant.org",
        cover: { shots: ["02", "03", "04"].map((n) => `${ROOTED_SHOTS}/${n}.webp`), bg: "#123324" },
    },
    {
        meta: ["WEBSITE", "BRAND"],
        status: "LIVE",
        title: "Yantrava Labs website",
        desc: "I helped design the site for Yantrava Labs, a studio building independent, AI-driven software products.",
        href: "https://yantrava.com/",
        cta: "Visit the website",
        // the laptop mockup of the live hero is uploaded in Framer as the "Yantrava cover" property; the tile is the fallback
        cover: { word: "Yantrava Labs", bg: "#1B1B1F", prop: "yantravaImg" },
    },
    {
        meta: ["DASHBOARD", "WEB APP"],
        status: "BEHANCE",
        title: "Casino game dashboard",
        desc: "A dashboard for an online casino platform: trending games, providers and recent play on one screen.",
        href: "https://www.behance.net/gallery/208113485/Casino-Game-Dashboard",
        cta: "View on Behance",
        cover: { img: `${BE}/project_modules/1400/76cdbc208113485.66e971b580e0b.png` },
    },
    {
        meta: ["AGENCY", "GRAPHIC DESIGN"],
        status: "BEHANCE",
        title: "Wizrdom design portfolio",
        desc: "A selection of the creative work I did at Wizrdom, a digital marketing agency.",
        href: "https://www.behance.net/gallery/227583837/Creative-Design-Portfolio-Wizrdom",
        cta: "View on Behance",
        cover: { img: `${BE}/project_modules/1400/e998b6227583837.68428d1ca7a5c.png`, pos: "left center" },
    },
    {
        meta: ["BRAND", "MASCOT"],
        status: "BEHANCE",
        title: "Cubot, a mascot for Curatal",
        desc: "A friendly brand mascot character designed for Curatal.",
        href: "https://www.behance.net/gallery/199660711/Brand-Mascot-Design-Curatal",
        cta: "View on Behance",
        cover: { img: `${BE}/project_modules/1400/f916b5199660711.6655a89ca936e.png` },
    },
    {
        meta: ["SOCIAL", "MARKETING"],
        status: "BEHANCE",
        title: "Creative marketing posts",
        desc: "Social media campaign posts designed at Wizrdom.",
        href: "https://www.behance.net/gallery/200660903/Creative-Marketing-Social-Media-Posts",
        cta: "View on Behance",
        cover: { img: `${BE}/projects/max_808/ebce0f200660903.Y3JvcCw1MjM2LDQwOTYsMCww.png` },
    },
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

const Pill = ({ children }: any) => (
    <span style={{ font: `400 10px/1 ${MONO}`, letterSpacing: "0.12em", color: C.body, border: `1px solid ${C.line}`, borderRadius: 999, padding: "5px 9px", textTransform: "uppercase" }}>{children}</span>
)

function CoverArt({ cover, hover, props }: { cover: Cover; hover: boolean; props: any }) {
    const zoom = { transform: hover ? "scale(1.04)" : "none", transition: `transform .6s ${EASE}` }
    if ("shots" in cover)
        return (
            <div style={{ position: "absolute", inset: 0, background: cover.bg, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "4%", paddingTop: "7%", ...zoom }}>
                {cover.shots.map((s) => (
                    <img key={s} src={s} alt="" loading="lazy" style={{ width: "27%", borderRadius: 10, boxShadow: "0 18px 30px -12px rgba(0,0,0,.6)" }} />
                ))}
            </div>
        )
    if ("word" in cover && props[cover.prop]) return <img src={props[cover.prop]} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...zoom }} />
    if ("word" in cover)
        return (
            <div style={{ position: "absolute", inset: 0, background: cover.bg, display: "grid", placeItems: "center", ...zoom }}>
                <span style={{ font: `500 clamp(26px,2.6vw,36px)/1 ${SANS}`, letterSpacing: "-0.03em", color: C.head, textTransform: "uppercase" }}>{cover.word}</span>
            </div>
        )
    return <img src={cover.img} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cover.pos || "center", ...zoom }} />
}

function ProjectCard({ c, props }: { c: Card; props: any }) {
    const [hover, setHover] = useState(false)
    return (
        <a
            href={c.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${c.title}: ${c.cta} (opens in a new tab)`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className="mw-card"
            style={{
                display: "flex", flexDirection: "column", borderRadius: 14, overflow: "hidden", height: "100%", boxSizing: "border-box",
                border: `1px solid ${hover ? "rgba(255,255,255,0.28)" : C.line}`, background: hover ? C.plateHover : C.plate,
                color: "inherit", textDecoration: "none", transition: `background .3s ${EASE}, border-color .3s ${EASE}`,
            }}
        >
            <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", borderBottom: `1px solid ${C.line}` }}>
                <CoverArt cover={c.cover} hover={hover} props={props} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.dim }}>{c.meta.join(" · ")}</span>
                    <Pill>{c.status}</Pill>
                </div>
                <div style={{ font: `500 20px/1.3 ${SANS}`, color: C.head }}>{c.title}</div>
                <div style={{ font: `400 15px/1.6 ${SANS}`, color: C.dim, flex: 1 }}>{c.desc}</div>
                <div style={{ marginTop: 6, font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", textTransform: "uppercase", color: C.head }}>
                    {c.cta} <span aria-hidden="true">↗</span>
                </div>
            </div>
        </a>
    )
}

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

export default function MoreWork(props: any) {
    const editorNav = useEditorNav()
    useFonts("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap")
    return (
        <div style={{ background: C.bg, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>{`.mw-card:focus-visible{outline:2px solid #fff;outline-offset:3px}.mw-more{transition:background .25s,border-color .25s}.mw-more:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.4)}
                @media(prefers-reduced-motion:reduce){.mw-card *{transition:none!important;transform:none!important}}
                @media(max-width:1000px){.mw-3{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
                @media(max-width:640px){.mw-3{grid-template-columns:minmax(0,1fr)!important}}`}</style>

            <section style={{ padding: "clamp(72px,9vw,140px) clamp(20px,5vw,80px)" }}>
                <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 28, flexWrap: "wrap" }}>
                        <h2 style={{ margin: 0, font: `400 clamp(64px,9vw,128px)/0.9 ${SANS}`, letterSpacing: "-0.04em", color: C.head, textTransform: "uppercase" }}>
                            MO<span style={{ font: `400 1.1em/0.8 ${SCRIPT}`, textTransform: "none" }}>re</span>
                        </h2>
                        <div style={{ paddingBottom: 14 }}><Label>[BEYOND THE CASE FILES]</Label></div>
                    </div>
                    <p style={{ margin: 0, maxWidth: 720, font: `400 clamp(15px,1.15vw,18px)/1.65 ${SANS}`, color: C.dim }}>
                        Side builds, agency work and earlier projects. Each card opens where the work lives: the live site or Behance.
                    </p>
                    <Reveal className="mw-3" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 24 }}>
                        {CARDS.map((c) => (
                            <ProjectCard key={c.title} c={c} props={props} />
                        ))}
                    </Reveal>
                    <a
                        href="/graphics"
                        className="mw-card mw-more"
                        onClick={(e) => {
                            if (editorNav(e, "CoCI5o9UT")) return
                            // switch page inside the running site (Framer's router reads history.state.routeId), no reload
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button || /(^|\.)framer(canvas)?\.com$/.test(location.hostname)) return
                            e.preventDefault()
                            const state = { routeId: "CoCI5o9UT", localeId: "default" }
                            history.pushState(state, "", "/graphics")
                            dispatchEvent(new PopStateEvent("popstate", { state }))
                            scrollTo(0, 0)
                        }}
                        style={{ alignSelf: "flex-start", marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, minHeight: 48, padding: "0 22px", borderRadius: 999, border: "1px solid rgba(255,255,255,.22)", color: C.head, textDecoration: "none", font: `500 12px/1 ${MONO}`, letterSpacing: ".14em", textTransform: "uppercase" }}
                    >
                        See all graphics and brand work <span aria-hidden="true">→</span>
                    </a>
                </div>
            </section>
        </div>
    )
}

addPropertyControls(MoreWork, {
    yantravaImg: { type: ControlType.Image, title: "Yantrava cover" },
})
