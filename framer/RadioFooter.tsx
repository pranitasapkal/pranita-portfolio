import { addPropertyControls, ControlType } from "framer"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

/**
 * RadioFooter: the site footer as a late-night TV radio, "Pranita FM". Replaces the full-screen TV footer.
 *
 * Left: the hero's retro TV, cut out, is the device. Four stations, each a cat, a song and a joke. The screen shows
 * the cat through a CRT (scanlines, screen-door grid, flicker, vignette), an on-screen display and an equaliser
 * that reacts to the real audio. Changing station flips the tube (collapse to a line, static snow, a burst of
 * hiss) and loads the next cat and song. The two dials printed on the TV are real controls: the top one changes
 * station, the bottom one is the volume knob (drag, arrow keys, wheel). The deck repeats prev / play / next.
 * Audio: Apple's official 30-second previews (CORS-open, fetched live from the iTunes Search API so the links
 * never go stale), with a "full song" link out. A "Full track" file property per station replaces the preview
 * with a track Pranita owns or has licensed.
 * Right: contact. Email with copy, LinkedIn, Behance, Medium, resume, Bengaluru time, copyright, back to top.
 * Resume: opens a preview (page images); the download asks name + email first and mails Pranita who took it.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 760
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const SANS = '"Geist", "Inter", system-ui, sans-serif'
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, monospace'
const SCRIPT = '"Inspiration", "Geist", cursive'
const VCR = '"VT323", "Geist Mono", monospace'
const EASE = "cubic-bezier(.65,0,.35,1)"
const C = { bg: "#0E0E0E", head: "#FFFFFF", body: "#E0E0E0", dim: "#9E9E9E", line: "rgba(255,255,255,0.14)", plate: "rgba(255,255,255,0.04)" }

// Geometry of the cut-out TV image (2263 x 1596): the see-through screen and the two dials, as fractions.
const TV_RATIO = 2263 / 1596
const SCREEN = { l: 0.0751, r: 0.7291, t: 0.1003, b: 0.787 }
const DIAL_CH = { x: 0.9076, y: 0.532, r: 0.0508 }
const DIAL_VOL = { x: 0.9068, y: 0.7074, r: 0.0508 }

const DEFAULT_TV = "https://framerusercontent.com/images/DJmgEyS6aXK9ScQoQF627rroM.png"
const YAWN_CAT = "https://framerusercontent.com/images/bqUKyJKKGjk9ArFQc2oVfoiJQ.jpg?scale-down-to=1024"

type Station = { name: string; artist: string; song: string; query: string; tint: string; glow: string; joke: string; sub: string; alt: string; pos: string }
// Song 1 is the one rizzabh.me/party plays. The rest keep the same slow, warm, slightly dramatic vibe.
const STATIONS: Station[] = [
    {
        name: "This Is Fine FM",
        artist: "Radiohead",
        song: "No Surprises",
        query: "radiohead no surprises",
        tint: "#FF8A3D",
        glow: "255,138,61",
        joke: "Prod is on fire. My oat latte is not.",
        sub: "No alarms. No surprises. One P0.",
        alt: "A cat in sunglasses and a headscarf sips a latte in front of an erupting volcano",
        pos: "center 92%",
    },
    {
        name: "Standup Survivor",
        artist: "Cigarettes After Sex",
        song: "Apocalypse",
        query: "cigarettes after sex apocalypse",
        tint: "#8FA8FF",
        glow: "143,168,255",
        joke: "When someone says “quick sync” at 6:58 pm.",
        sub: "It was not quick. It was not a sync.",
        alt: "A fluffy white cat lying on a table, mid-yawn",
        pos: "center 35%",
    },
    {
        name: "Post-Review Recovery",
        artist: "Prateek Kuhad",
        song: "cold/mess",
        query: "prateek kuhad cold mess",
        tint: "#E58AA6",
        glow: "229,138,166",
        joke: "Me after “can we just try it in blue?”",
        sub: "final_final_v3_REAL.fig",
        alt: "A cat slumped against a wall with its mouth open, defeated",
        pos: "center 26%",
    },
    {
        name: "Guardian of the Grid",
        artist: "Tame Impala",
        song: "Let It Happen",
        query: "tame impala let it happen",
        tint: "#7FE0B0",
        glow: "127,224,176",
        joke: "Sworn protector of the 8px grid.",
        sub: "Touch my spacing tokens. I dare you.",
        alt: "A ginger kitten in a suit of armour holding a sword, with a pink bow",
        pos: "center 40%",
    },
]

// ── the player ─────────────────────────────────────────────────────────────────────────────────────────────────
class Player {
    ctx: AudioContext
    master: GainNode
    analyser: AnalyserNode
    media: HTMLAudioElement
    noise: AudioBuffer
    cache: Record<number, string> = {}

    constructor() {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext
        this.ctx = new AC()
        const ctx = this.ctx
        this.media = new Audio()
        this.media.crossOrigin = "anonymous"
        this.media.preload = "auto"
        const src = ctx.createMediaElementSource(this.media)
        this.master = ctx.createGain()
        this.master.gain.value = 0.6
        this.analyser = ctx.createAnalyser()
        this.analyser.fftSize = 256
        this.analyser.smoothingTimeConstant = 0.8
        src.connect(this.master).connect(this.analyser).connect(ctx.destination)
        const len = ctx.sampleRate
        this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
        const d = this.noise.getChannelData(0)
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    }

    // the official preview for a station, looked up live (the iTunes Search API is CORS-open)
    async url(i: number, override?: string) {
        if (override) return override
        if (this.cache[i]) return this.cache[i]
        const s = STATIONS[i]
        const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(s.query)}&entity=song&limit=5&country=in`)
        const j = await r.json()
        const want = s.song.toLowerCase().split("/")[0]
        const hit = (j.results || []).find((x: any) => x.previewUrl && String(x.trackName || "").toLowerCase().includes(want)) || (j.results || [])[0]
        if (hit) {
            this.cache[i] = hit.previewUrl
            ;(STATIONS[i] as any).link = hit.trackViewUrl
        }
        return this.cache[i]
    }

    async play(i: number, override?: string) {
        if (this.ctx.state !== "running") await this.ctx.resume()
        const u = await this.url(i, override)
        if (!u) return false
        if (this.media.src !== u) this.media.src = u
        await this.media.play()
        return true
    }

    pause() {
        this.media.pause()
    }

    load(i: number, override?: string) {
        this.media.pause()
        return this.url(i, override).catch(() => undefined)
    }

    hiss() {
        const ctx = this.ctx
        if (ctx.state !== "running") return
        const s = ctx.createBufferSource()
        s.buffer = this.noise
        const bp = ctx.createBiquadFilter()
        bp.type = "bandpass"
        bp.frequency.value = 3000
        bp.Q.value = 0.4
        const g = ctx.createGain()
        const t = ctx.currentTime
        g.gain.setValueAtTime(0.14 * this.master.gain.value + 0.02, t)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
        s.connect(bp).connect(g).connect(ctx.destination)
        s.start(t, 0, 0.5)
    }

    setVolume(v: number) {
        this.master.gain.setTargetAtTime(v * v, this.ctx.currentTime, 0.04)
    }

    close() {
        this.media.pause()
        try {
            this.ctx.close()
        } catch (_) {}
    }
}

// ── small parts ────────────────────────────────────────────────────────────────────────────────────────────────

const Label = ({ children, style }: any) => (
    <div style={{ font: `400 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.dim, textTransform: "uppercase", ...style }}>{children}</div>
)

function DeckButton({ label, onClick, big, children, pressed }: any) {
    const s = big ? 64 : 46
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={pressed}
            onClick={onClick}
            className="rf-btn"
            style={{
                width: s,
                height: s,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "radial-gradient(120% 120% at 30% 25%, #2A2A2A 0%, #161616 55%, #0B0B0B 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 22px -12px rgba(0,0,0,0.9)",
                color: C.head,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                padding: 0,
            }}
        >
            {children}
        </button>
    )
}

// ── resume: preview free, download behind a short form that emails Pranita who took it ──────────────────────────
// Any link on the page that points at a Framer-hosted PDF (the hero's "Download my resume" too) opens this instead.
// The notification goes through FormSubmit (formsubmit.co), which mails `notify` with the form fields.

const RESUME_NAME = "PranitaSapkal_Resume.pdf"
const RV_KEY = "pf-resume-reader"

async function saveFile(url: string) {
    try {
        const blob = await (await fetch(url)).blob()
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = RESUME_NAME
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(a.href), 4000)
    } catch (_) {
        window.open(url, "_blank", "noopener")
    }
}

function tell(notify: string, who: { name: string; email: string; company: string }) {
    const ctl = new AbortController()
    setTimeout(() => ctl.abort(), 8000)
    return fetch(`https://formsubmit.co/ajax/${notify}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            name: who.name,
            email: who.email,
            company: who.company || "Not given",
            page: window.location.href,
            _subject: `Resume downloaded by ${who.name}`,
            _template: "table",
            _captcha: "false",
        }),
        signal: ctl.signal,
    }).catch(() => null)
}

function ResumeModal({ open, onClose, pdf, pages, notify }: { open: boolean; onClose: () => void; pdf: string; pages: string[]; notify: string }) {
    const [step, setStep] = useState<"read" | "form" | "done">("read")
    const [who, setWho] = useState({ name: "", email: "", company: "" })
    const [err, setErr] = useState<{ name?: string; email?: string }>({})
    const [busy, setBusy] = useState(false)
    const panel = useRef<HTMLDivElement>(null)
    const back = useRef<HTMLElement | null>(null)
    const first = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!open) return
        back.current = document.activeElement as HTMLElement
        setStep("read")
        setErr({})
        try {
            const saved = JSON.parse(localStorage.getItem(RV_KEY) || "null")
            if (saved && saved.name && saved.email) setWho(saved)
        } catch (_) {}
        const html = document.documentElement
        const prev = html.style.overflow
        html.style.overflow = "hidden"
        setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-rv-close]")?.focus(), 30)
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key !== "Tab" || !panel.current) return
            const f = [...panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,[tabindex='0']")]
            if (!f.length) return
            if (e.shiftKey && document.activeElement === f[0]) (f[f.length - 1].focus(), e.preventDefault())
            else if (!e.shiftKey && document.activeElement === f[f.length - 1]) (f[0].focus(), e.preventDefault())
        }
        document.addEventListener("keydown", onKey)
        return () => {
            html.style.overflow = prev
            document.removeEventListener("keydown", onKey)
            back.current?.focus?.()
        }
    }, [open])

    useEffect(() => {
        if (step === "form") setTimeout(() => first.current?.focus(), 30)
    }, [step])

    if (!open) return null

    const submit = async (e: any) => {
        e.preventDefault()
        if (e.target._honey?.value) return
        const n: typeof err = {}
        if (who.name.trim().length < 2) n.name = "Add your name so I know who's reading."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(who.email.trim())) n.email = "That email doesn't look right."
        setErr(n)
        if (n.name || n.email) return
        setBusy(true)
        const clean = { name: who.name.trim(), email: who.email.trim(), company: who.company.trim() }
        try {
            localStorage.setItem(RV_KEY, JSON.stringify(clean))
        } catch (_) {}
        await Promise.all([tell(notify, clean), saveFile(pdf)])
        setBusy(false)
        setStep("done")
    }

    const field = (key: "name" | "email" | "company", label: string, type: string, auto: string, ref?: any) => (
        <label style={{ display: "grid", gap: 6 }}>
            <span style={{ font: `500 11px/1 ${MONO}`, letterSpacing: ".14em", textTransform: "uppercase", color: C.dim }}>{label}</span>
            <input
                ref={ref}
                type={type}
                autoComplete={auto}
                value={who[key]}
                onChange={(e) => setWho({ ...who, [key]: e.target.value })}
                aria-invalid={!!(err as any)[key]}
                aria-describedby={(err as any)[key] ? `rv-${key}-err` : undefined}
                style={{ font: `400 16px/1.3 ${SANS}`, color: C.head, background: "rgba(255,255,255,.05)", border: `1px solid ${(err as any)[key] ? "#FF8A80" : "rgba(255,255,255,.18)"}`, borderRadius: 10, padding: "12px 14px", outline: "none", minHeight: 48, boxSizing: "border-box", width: "100%" }}
            />
            {(err as any)[key] && (
                <span id={`rv-${key}-err`} style={{ font: `400 13px/1.3 ${SANS}`, color: "#FF8A80" }}>
                    {(err as any)[key]}
                </span>
            )}
        </label>
    )

    const pill = (filled: boolean) => ({
        font: `500 12px/1 ${MONO}`,
        letterSpacing: ".12em",
        textTransform: "uppercase" as const,
        color: filled ? "#0E0E0E" : C.head,
        background: filled ? "#fff" : "transparent",
        border: `1px solid ${filled ? "#fff" : "rgba(255,255,255,.3)"}`,
        borderRadius: 999,
        padding: "0 18px",
        minHeight: 44,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        textDecoration: "none",
        whiteSpace: "nowrap" as const,
    })

    return createPortal(
        <div
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
            style={{ position: "fixed", inset: 0, zIndex: 2147483000, background: "rgba(0,0,0,.72)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "clamp(0px,3vw,32px)", fontFamily: SANS }}
        >
            <style>{`.rv-btn:focus-visible,.rv-panel input:focus-visible{outline:2px solid #fff;outline-offset:3px}.rv-panel input:focus{border-color:#fff!important}`}</style>
            <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="rv-title"
                className="rv-panel"
                style={{ width: "min(980px,100%)", height: "min(92vh,1200px)", background: "#141414", border: `1px solid ${C.line}`, borderRadius: "clamp(0px,2vw,18px)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 40px 80px -30px rgba(0,0,0,.9)" }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px clamp(14px,2vw,22px)", borderBottom: `1px solid ${C.line}`, flexWrap: "wrap" }}>
                    <div style={{ marginRight: "auto", minWidth: 0 }}>
                        <div id="rv-title" style={{ font: `500 16px/1.3 ${SANS}`, color: C.head }}>Pranita Sapkal · Resume</div>
                        <div style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: ".12em", textTransform: "uppercase", color: C.dim }}>2 pages · PDF</div>
                    </div>
                    {step === "read" && (
                        <button type="button" className="rv-btn" onClick={() => setStep("form")} style={pill(true)}>
                            Download PDF <span aria-hidden="true">↓</span>
                        </button>
                    )}
                    <button type="button" data-rv-close className="rv-btn" onClick={onClose} aria-label="Close resume" style={{ ...pill(false), padding: 0, width: 44, justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    </button>
                </div>

                <div data-lenis-prevent="" style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", background: "#1C1C1C", padding: "clamp(12px,3vw,32px)", display: "grid", gap: 20, justifyItems: "center", alignContent: "start" }}>
                    {step === "form" && (
                        <form onSubmit={submit} noValidate style={{ width: "min(520px,100%)", display: "grid", gap: 16, padding: "clamp(18px,3vw,28px)", border: `1px solid ${C.line}`, borderRadius: 16, background: "#141414" }}>
                            <div style={{ font: `500 22px/1.25 ${SANS}`, color: C.head }}>Before you download</div>
                            <p style={{ margin: 0, font: `400 15px/1.55 ${SANS}`, color: C.dim }}>
                                I get a note with your name and email, so I know who's reading. That's all I use it for.
                            </p>
                            {field("name", "Your name", "text", "name", first)}
                            {field("email", "Work email", "email", "email")}
                            {field("company", "Company or role (optional)", "text", "organization")}
                            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                                <button type="submit" disabled={busy} className="rv-btn" style={{ ...pill(true), opacity: busy ? 0.7 : 1 }}>
                                    {busy ? "Preparing…" : "Download resume"} <span aria-hidden="true">↓</span>
                                </button>
                                <button type="button" className="rv-btn" onClick={() => setStep("read")} style={pill(false)}>
                                    Back to preview
                                </button>
                            </div>
                        </form>
                    )}
                    {step === "done" && (
                        <div role="status" style={{ width: "min(520px,100%)", padding: "18px 22px", border: `1px solid ${C.line}`, borderRadius: 16, background: "#141414", font: `400 15px/1.55 ${SANS}`, color: C.body }}>
                            Thanks, {who.name.trim().split(" ")[0]}. Your download has started.{" "}
                            <a href={pdf} target="_blank" rel="noreferrer" style={{ color: C.head }}>
                                Open it here
                            </a>{" "}
                            if it didn't.
                        </div>
                    )}
                    {pages.filter(Boolean).map((src, i) => (
                        <img key={src} src={src} alt={`Resume, page ${i + 1} of ${pages.filter(Boolean).length}`} loading={i ? "lazy" : "eager"} style={{ width: "100%", maxWidth: 860, height: "auto", aspectRatio: "960 / 1358", background: "#fff", borderRadius: 6, boxShadow: "0 18px 40px -20px rgba(0,0,0,.9)" }} />
                    ))}
                    {!pages.filter(Boolean).length && (
                        <a href={pdf} target="_blank" rel="noreferrer" style={{ color: C.head }}>
                            Open the PDF
                        </a>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}

function ClockBLR() {
    const [now, setNow] = useState("")
    useEffect(() => {
        const f = () => setNow(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", hour12: false }).format(new Date()))
        f()
        const id = setInterval(f, 15000)
        return () => clearInterval(id)
    }, [])
    return <span>{now} IST</span>
}

// ── the footer ─────────────────────────────────────────────────────────────────────────────────────────────────

export default function RadioFooter(props: any) {
    const {
        tv,
        img1,
        img2,
        img3,
        img4,
        email = "sapkalp1997@gmail.com",
        linkedin = "https://www.linkedin.com/in/pranita-sapkal-86364010a/",
        behance = "https://www.behance.net/pranitasapkal",
        medium = "https://medium.com/@sapkalp1997",
        resume = "https://framerusercontent.com/assets/rlHNrrGQt7B0gNqyGpI4YRgurt4.pdf",
        resumeFile,
        resumePage1,
        resumePage2,
        notify = "sapkalp1997@gmail.com",
        track1,
        track2,
        track3,
        track4,
    } = props
    const tvSrc = tv || DEFAULT_TV
    const imgs = [img1, img2 || YAWN_CAT, img3, img4]
    const tracks = [track1, track2, track3, track4]

    const player = useRef<Player | null>(null)
    const [playing, setPlaying] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ch, setCh] = useState(0)
    const [vol, setVol] = useState(0.7)
    const [staticOn, setStaticOn] = useState(false)
    const [flip, setFlip] = useState(false)
    const [copied, setCopied] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [total, setTotal] = useState(30)
    const [reduced, setReduced] = useState(false)
    const [failed, setFailed] = useState(false)
    const [resumeOpen, setResumeOpen] = useState(false)
    const pdf = resumeFile || resume
    const bars = useRef<HTMLDivElement>(null)
    const catRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const staticCanvas = useRef<HTMLCanvasElement>(null)
    const chRef = useRef(0)
    const playingRef = useRef(false)
    const chan = STATIONS[ch]

    useEffect(() => {
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        imgs.forEach((u) => u && (new Image().src = u))
        return () => player.current?.close()
    }, [])

    // every resume link on the page (the hero button too) opens the viewer instead of a bare file
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const a = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null
            if (!a || a.dataset.rvSkip !== undefined) return
            const h = a.href
            if (h === pdf || /framerusercontent\.com\/assets\/[^?#]+\.pdf/i.test(h) || /#resume$/.test(h)) {
                e.preventDefault()
                e.stopPropagation()
                setResumeOpen(true)
            }
        }
        document.addEventListener("click", onClick, true)
        return () => document.removeEventListener("click", onClick, true)
    }, [pdf])

    const ensure = () => {
        if (!player.current) {
            const p = new Player()
            p.media.loop = true // a station repeats until the visitor turns the dial
            p.media.addEventListener("loadedmetadata", () => setTotal(Math.round(p.media.duration) || 30))
            player.current = p
        }
        return player.current
    }

    const start = async (i: number) => {
        const p = ensure()
        p.setVolume(vol)
        setLoading(true)
        try {
            const ok = await p.play(i, tracks[i])
            if (chRef.current !== i) return
            setFailed(!ok)
            setPlaying(ok)
            playingRef.current = ok
        } catch (_) {
            setFailed(true)
            setPlaying(false)
            playingRef.current = false
        }
        setLoading(false)
    }

    const toggle = async () => {
        if (playingRef.current) {
            player.current?.pause()
            setPlaying(false)
            playingRef.current = false
        } else await start(chRef.current)
    }

    // change station: the tube collapses to a line, snows, hisses, and comes back on the next cat and song
    const tune = (dir: number) => {
        const next = (chRef.current + dir + STATIONS.length) % STATIONS.length
        const wasPlaying = playingRef.current
        chRef.current = next
        setFlip(true)
        setStaticOn(true)
        setElapsed(0)
        setFailed(false)
        if (player.current) {
            player.current.hiss()
            player.current.load(next, tracks[next])
        }
        setTimeout(() => setCh(next), reduced ? 0 : 230)
        setTimeout(() => setFlip(false), reduced ? 0 : 300)
        setTimeout(() => setStaticOn(false), reduced ? 120 : 620)
        if (wasPlaying) setTimeout(() => start(next), reduced ? 120 : 520)
    }

    const pick = (i: number) => i !== chRef.current && tune(i - chRef.current)

    useEffect(() => {
        player.current?.setVolume(vol)
    }, [vol])

    // per frame: equaliser from the real audio, cat thumps on the bass, screen glow from loudness, timer
    useEffect(() => {
        let raf = 0
        const data = new Uint8Array(128)
        let lastSec = -1
        const loop = () => {
            const p = player.current
            let level = 0
            if (p && playingRef.current) {
                p.analyser.getByteFrequencyData(data)
                const el = bars.current
                if (el) {
                    const kids = el.children
                    for (let i = 0; i < kids.length; i++) {
                        const v = data[2 + i * 3] / 255
                        level += v
                        ;(kids[i] as HTMLElement).style.transform = `scaleY(${Math.max(0.06, v)})`
                    }
                    level /= kids.length
                }
                const bass = (data[1] + data[2] + data[3]) / (3 * 255)
                if (catRef.current && !reduced) {
                    const pulse = Math.pow(Math.max(0, bass - 0.55) / 0.45, 2)
                    catRef.current.style.transform = `scale(${1.04 + pulse * 0.03}) translateY(${-pulse * 4}px)`
                }
                const sec = Math.floor(p.media.currentTime)
                if (sec !== lastSec) {
                    lastSec = sec
                    setElapsed(sec)
                }
            } else if (bars.current) {
                for (const k of Array.from(bars.current.children)) (k as HTMLElement).style.transform = "scaleY(0.06)"
            }
            if (glowRef.current) glowRef.current.style.opacity = String(0.4 + level * 1.4)
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [reduced])

    // static snow while changing channel
    useEffect(() => {
        if (!staticOn || reduced) return
        const cv = staticCanvas.current
        if (!cv) return
        const g = cv.getContext("2d")!
        let raf = 0
        const draw = () => {
            const w = (cv.width = 160)
            const h = (cv.height = 110)
            const img = g.createImageData(w, h)
            for (let i = 0; i < img.data.length; i += 4) {
                const v = Math.random() * 255
                img.data[i] = img.data[i + 1] = img.data[i + 2] = v
                img.data[i + 3] = 255
            }
            g.putImageData(img, 0, 0)
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => cancelAnimationFrame(raf)
    }, [staticOn, reduced])

    // volume knob: drag up/right to raise, arrow keys, wheel
    const knobDrag = useRef<{ y: number; x: number; v: number } | null>(null)
    const onKnobDown = (e: any) => {
        knobDrag.current = { y: e.clientY, x: e.clientX, v: vol }
        e.currentTarget.setPointerCapture?.(e.pointerId)
        e.preventDefault()
    }
    const onKnobMove = (e: any) => {
        const d = knobDrag.current
        if (!d) return
        const delta = (d.y - e.clientY + (e.clientX - d.x)) / 180
        setVol(Math.min(1, Math.max(0, d.v + delta)))
    }
    const onKnobUp = () => (knobDrag.current = null)
    const onKnobKey = (e: any) => {
        const step = e.shiftKey ? 0.1 : 0.05
        if (e.key === "ArrowUp" || e.key === "ArrowRight") (setVol((v) => Math.min(1, v + step)), e.preventDefault())
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") (setVol((v) => Math.max(0, v - step)), e.preventDefault())
        if (e.key === "Home") (setVol(0), e.preventDefault())
        if (e.key === "End") (setVol(1), e.preventDefault())
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch (_) {
            window.location.href = `mailto:${email}`
        }
    }

    const dialStyle = (d: typeof DIAL_CH, rot: number) => ({
        position: "absolute" as const,
        left: `${(d.x - d.r) * 100}%`,
        top: `${(d.y - d.r * TV_RATIO) * 100}%`,
        width: `${d.r * 200}%`,
        aspectRatio: "1",
        borderRadius: "50%",
        backgroundImage: `url(${tvSrc})`,
        backgroundSize: `${(1 / (d.r * 2)) * 100}% auto`,
        backgroundPosition: `${((d.x - d.r) / (1 - d.r * 2)) * 100}% ${((d.y - (d.r * TV_RATIO)) / (1 - d.r * 2 * TV_RATIO)) * 100}%`,
        transform: `rotate(${rot}deg)`,
        transition: knobDrag.current ? "none" : `transform .45s ${EASE}`,
    })

    const t2 = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`
    const mmss = `${t2(elapsed)} / ${t2(total)}`
    const songLink = (chan as any).link || `https://music.apple.com/in/search?term=${encodeURIComponent(chan.query)}`
    const links: [string, string, string, boolean][] = [
        ["LinkedIn", "Work history", linkedin, true],
        ["Behance", "Visual and earlier work", behance, true],
        ["Medium", "Writing", medium, true],
        ["Resume", "Preview or download", pdf, true],
    ]

    return (
        <footer style={{ background: C.bg, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased", overflow: "hidden" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&family=VT323&display=swap');
                .rf-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(36px,4.5vw,72px);align-items:center}
                @media(max-width:900px){.rf-grid{grid-template-columns:minmax(0,1fr)}}
                .rf-btn{transition:transform .18s ${EASE},border-color .2s}
                .rf-btn:hover{border-color:rgba(255,255,255,.32)}
                .rf-btn:active{transform:scale(.94)}
                .rf-btn:focus-visible,.rf-dial:focus-visible,.rf-link:focus-visible,.rf-copy:focus-visible,.rf-dot:focus-visible{outline:2px solid #fff;outline-offset:3px}
                .rf-dial{cursor:pointer;border:0;padding:0;background:none}
                .rf-dial:hover .rf-ring,.rf-dial:focus-visible .rf-ring{opacity:1}
                .rf-dial:hover .rf-tip,.rf-dial:focus-visible .rf-tip{opacity:1;transform:translate(-50%,0)}
                .rf-link{transition:background .25s ${EASE}}
                .rf-link:hover{background:rgba(255,255,255,.04)}
                .rf-link:hover .rf-arrow{transform:translate(3px,-3px)}
                .rf-arrow{transition:transform .25s ${EASE}}
                @keyframes rf-flicker{0%,100%{opacity:.97}50%{opacity:1}}
                @keyframes rf-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
                @keyframes rf-roll{from{background-position:0 0}to{background-position:0 6px}}
                @keyframes rf-off{0%{transform:scale(1,1);filter:brightness(1)}55%{transform:scale(1,.012);filter:brightness(4)}100%{transform:scale(.02,.012);filter:brightness(6)}}
                @keyframes rf-on{0%{transform:scale(1,.012);filter:brightness(5)}100%{transform:scale(1,1);filter:brightness(1)}}
                .rf-tube{transform-origin:50% 50%}
                .rf-tube.off{animation:rf-off .23s cubic-bezier(.7,0,1,.4) forwards}
                .rf-tube.on{animation:rf-on .32s cubic-bezier(0,.6,.3,1)}
                @media(prefers-reduced-motion:reduce){.rf-anim{animation:none!important}}`}</style>

            <div style={{ maxWidth: 1360, margin: "0 auto", padding: "clamp(64px,8vw,112px) clamp(20px,5vw,72px) clamp(28px,3vw,40px)" }}>
                <div className="rf-grid">
                    {/* ── left: the radio ── */}
                    <div style={{ minWidth: 0 }}>
                        <Label style={{ marginBottom: 18 }}>[Pranita FM · 24/7 from BLR]</Label>
                        <div style={{ position: "relative", width: "100%", aspectRatio: `${TV_RATIO}` }}>
                            {/* light spilling from the screen */}
                            <div
                                ref={glowRef}
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    left: "-8%",
                                    right: "16%",
                                    top: "-6%",
                                    bottom: "4%",
                                    background: `radial-gradient(closest-side, rgba(${chan.glow},${playing ? 0.32 : 0.12}), transparent 72%)`,
                                    filter: "blur(28px)",
                                    transition: "background .6s",
                                    pointerEvents: "none",
                                }}
                            />
                            {/* the screen, under the TV frame */}
                            <div
                                className="rf-anim"
                                style={{
                                    position: "absolute",
                                    left: `${SCREEN.l * 100}%`,
                                    width: `${(SCREEN.r - SCREEN.l) * 100}%`,
                                    top: `${SCREEN.t * 100}%`,
                                    height: `${(SCREEN.b - SCREEN.t) * 100}%`,
                                    overflow: "hidden",
                                    background: "#05090A",
                                    animation: playing ? "rf-flicker .12s infinite" : "none",
                                }}
                            >
                                <div className={`rf-tube rf-anim ${flip ? "off" : "on"}`} key={ch} style={{ position: "absolute", inset: 0 }}>
                                    <div ref={catRef} style={{ position: "absolute", inset: "-3%", transition: "opacity .5s", opacity: playing ? 1 : 0.62 }}>
                                        <img
                                            src={imgs[ch] || YAWN_CAT}
                                            alt={chan.alt}
                                            draggable={false}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: chan.pos, filter: "contrast(1.08) saturate(1.12) brightness(.95)" }}
                                        />
                                        <div style={{ position: "absolute", inset: 0, background: chan.tint, mixBlendMode: "soft-light", opacity: 0.28 }} />
                                    </div>
                                </div>
                                {/* screen-door grid, scanlines, vignette */}
                                <div
                                    aria-hidden="true"
                                    className="rf-anim"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundImage:
                                            "repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px)",
                                        animation: playing ? "rf-roll .6s linear infinite" : "none",
                                    }}
                                />
                                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 95% at 50% 50%, transparent 55%, rgba(0,0,0,.65) 100%)" }} />

                                {/* on-screen display */}
                                <div style={{ position: "absolute", left: "5%", top: "6%", font: `400 clamp(16px,2.3vw,30px)/1 ${VCR}`, color: "#FFFDF5", textShadow: `0 0 8px rgba(${chan.glow},.95), 0 1px 2px rgba(0,0,0,.8)`, letterSpacing: ".04em" }}>
                                    CH {String(ch + 1).padStart(2, "0")}
                                </div>
                                <div style={{ position: "absolute", right: "5%", top: "6%", font: `400 clamp(14px,2vw,26px)/1 ${VCR}`, color: "#FFFDF5", textShadow: `0 0 8px rgba(${chan.glow},.95), 0 1px 2px rgba(0,0,0,.8)` }}>
                                    {loading ? "TUNING…" : playing ? `▶ ${mmss}` : "❚❚ PAUSE"}
                                </div>
                                <div style={{ position: "absolute", left: "5%", top: "16%", font: `400 clamp(12px,1.5vw,19px)/1 ${VCR}`, color: "#FFFDF5", textShadow: "0 1px 3px rgba(0,0,0,.9)", textTransform: "uppercase" }}>
                                    {chan.name}
                                </div>

                                {/* the joke, meme-style */}
                                <div style={{ position: "absolute", left: "5%", right: "5%", bottom: "16%", textAlign: "center" }}>
                                    <div style={{ font: `700 clamp(14px,1.75vw,23px)/1.15 ${SANS}`, letterSpacing: "-0.01em", color: "#fff", textShadow: "0 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 -2px 0 #000, 0 0 14px rgba(0,0,0,.85)" }}>
                                        {chan.joke}
                                    </div>
                                    <div style={{ marginTop: 6, font: `400 clamp(11px,1.35vw,17px)/1.2 ${VCR}`, letterSpacing: ".04em", color: "#FFFDF5", textShadow: "0 1px 3px #000, 0 0 8px rgba(0,0,0,.9)" }}>
                                        {failed ? "NO SIGNAL. TRY THE NEXT CHANNEL." : playing ? `♪ ${chan.song} · ${chan.artist}` : chan.sub}
                                    </div>
                                </div>
                                {!playing && !loading && (
                                    <div className="rf-anim" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: "34%", textAlign: "center", font: `400 clamp(15px,2vw,26px)/1 ${VCR}`, color: "#FFFDF5", letterSpacing: ".06em", textShadow: "0 1px 3px #000, 0 0 10px rgba(0,0,0,.9)", animation: "rf-blink 1.2s steps(1) infinite" }}>
                                        PRESS ▶ TO TUNE IN
                                    </div>
                                )}

                                {/* equaliser */}
                                <div ref={bars} aria-hidden="true" style={{ position: "absolute", left: "5%", right: "5%", bottom: "5%", height: "8%", display: "flex", alignItems: "flex-end", gap: "1.2%" }}>
                                    {Array.from({ length: 28 }, (_, i) => (
                                        <div key={i} style={{ flex: 1, height: "100%", background: `rgba(${chan.glow},.85)`, transformOrigin: "bottom", transform: "scaleY(.06)", boxShadow: `0 0 6px rgba(${chan.glow},.6)` }} />
                                    ))}
                                </div>

                                {/* static between channels */}
                                <canvas
                                    ref={staticCanvas}
                                    aria-hidden="true"
                                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated", opacity: staticOn ? 0.9 : 0, transition: "opacity .15s", pointerEvents: "none" }}
                                />
                            </div>

                            {/* the TV itself */}
                            <img src={tvSrc} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", userSelect: "none" }} />

                            {/* the printed dials, made real: channel (click) and volume (drag, keys) */}
                            <button
                                type="button"
                                className="rf-dial"
                                aria-label={`Change station. Now ${ch + 1} of ${STATIONS.length}: ${chan.name}, ${chan.song} by ${chan.artist}`}
                                onClick={() => tune(1)}
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                            >
                                <span style={{ ...dialStyle(DIAL_CH, ch * 42), pointerEvents: "auto" }} />
                                <span className="rf-ring" style={{ position: "absolute", left: `${(DIAL_CH.x - DIAL_CH.r) * 100}%`, top: `${(DIAL_CH.y - DIAL_CH.r * TV_RATIO) * 100}%`, width: `${DIAL_CH.r * 200}%`, aspectRatio: "1", borderRadius: "50%", boxShadow: `0 0 0 2px rgba(255,255,255,.7), 0 0 22px rgba(${chan.glow},.8)`, opacity: 0, transition: "opacity .2s", pointerEvents: "none" }} />
                                <span className="rf-tip" style={{ position: "absolute", left: `${DIAL_CH.x * 100}%`, top: `calc(${(DIAL_CH.y + DIAL_CH.r * TV_RATIO) * 100}% + 6px)`, transform: "translate(-50%,4px)", opacity: 0, transition: `opacity .2s, transform .2s ${EASE}`, font: `500 10px/1 ${MONO}`, letterSpacing: ".12em", color: "#fff", background: "#000", padding: "6px 8px", borderRadius: 6, whiteSpace: "nowrap", pointerEvents: "none" }}>
                                    CHANNEL
                                </span>
                            </button>
                            <div
                                role="slider"
                                tabIndex={0}
                                className="rf-dial"
                                aria-label="Volume"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(vol * 100)}
                                onPointerDown={onKnobDown}
                                onPointerMove={onKnobMove}
                                onPointerUp={onKnobUp}
                                onPointerCancel={onKnobUp}
                                onKeyDown={onKnobKey}
                                onWheel={(e) => setVol((v) => Math.min(1, Math.max(0, v - e.deltaY / 1500)))}
                                style={{ ...dialStyle(DIAL_VOL, -135 + vol * 270), touchAction: "none", cursor: "ns-resize" }}
                            >
                                <span className="rf-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `0 0 0 2px rgba(255,255,255,.7), 0 0 22px rgba(${chan.glow},.8)`, opacity: 0, transition: "opacity .2s", pointerEvents: "none" }} />
                            </div>
                            
                        </div>

                        {/* the deck */}
                        <div style={{ marginTop: "clamp(20px,2.4vw,32px)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                            <DeckButton label="Previous station" onClick={() => tune(-1)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2v12M13 2 5 8l8 6V2z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                            </DeckButton>
                            <DeckButton big label={playing ? "Pause Pranita FM" : "Play Pranita FM"} pressed={playing} onClick={toggle}>
                                {playing ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="3" width="4.5" height="14" rx="1" fill="currentColor" /><rect x="11.5" y="3" width="4.5" height="14" rx="1" fill="currentColor" /></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3l12 7-12 7V3z" fill="currentColor" /></svg>
                                )}
                            </DeckButton>
                            <DeckButton label="Next station: new cat, new song" onClick={() => tune(1)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 2v12M3 2l8 6-8 6V2z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                            </DeckButton>
                            <div role="group" aria-label="Channels" style={{ display: "flex", gap: 10, marginLeft: 8 }}>
                                {STATIONS.map((c, i) => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        className="rf-dot"
                                        aria-label={`Station ${i + 1}, ${c.name}`}
                                        aria-current={i === ch}
                                        onClick={() => pick(i)}
                                        style={{ width: 22, height: 22, display: "grid", placeItems: "center", border: 0, background: "none", cursor: "pointer", padding: 0 }}
                                    >
                                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: i === ch ? c.tint : "rgba(255,255,255,.22)", boxShadow: i === ch ? `0 0 10px ${c.tint}` : "none", transition: "background .3s, box-shadow .3s" }} />
                                    </button>
                                ))}
                            </div>
                            <div aria-live="polite" style={{ marginLeft: "auto", textAlign: "right", minWidth: 0 }}>
                                <div style={{ font: `500 14px/1.3 ${SANS}`, color: C.head }}>{chan.song} · {chan.artist}</div>
                                <a href={songLink} target="_blank" rel="noreferrer" className="rf-link" style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: ".12em", color: C.dim, textDecoration: "none", textTransform: "uppercase" }}>
                                    30s preview · full song <span aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── right: contact ── */}
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
                        <Label>[Say hello]</Label>
                        <h2 style={{ margin: 0, font: `500 clamp(40px,4.6vw,64px)/1 ${SANS}`, letterSpacing: "-0.03em", color: C.head, textTransform: "uppercase" }}>
                            <span style={{ display: "block" }}>Still here?</span>
                            Say <span style={{ font: `400 1.2em/0.8 ${SCRIPT}`, textTransform: "none" }}>hi</span>.
                        </h2>
                        <p style={{ margin: 0, maxWidth: 440, font: `400 clamp(15px,1.15vw,17px)/1.6 ${SANS}`, color: C.dim }}>
                            You made it all the way down here, past a cat radio. That's basically a first interview. My inbox is open.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.plate }}>
                            <a href={`mailto:${email}`} className="rf-link" style={{ font: `500 clamp(16px,1.5vw,20px)/1.3 ${SANS}`, color: C.head, textDecoration: "none", overflowWrap: "anywhere", marginRight: "auto" }}>
                                {email}
                            </a>
                            <button type="button" className="rf-copy" onClick={copy} aria-label={copied ? "Email copied" : "Copy email address"} style={{ font: `500 11px/1 ${MONO}`, letterSpacing: ".12em", textTransform: "uppercase", color: copied ? "#0E0E0E" : C.head, background: copied ? "#fff" : "transparent", border: `1px solid ${copied ? "#fff" : "rgba(255,255,255,.3)"}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", transition: "background .2s, color .2s" }}>
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <a href={`mailto:${email}`} className="rf-copy" style={{ font: `500 11px/1 ${MONO}`, letterSpacing: ".12em", textTransform: "uppercase", color: "#0E0E0E", background: "#fff", borderRadius: 999, padding: "11px 14px", textDecoration: "none" }}>
                                Write ↗
                            </a>
                        </div>

                        <nav aria-label="Elsewhere" style={{ borderTop: `1px solid ${C.line}` }}>
                            {links.map(([name, sub, href]) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rf-link"
                                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 6px", borderBottom: `1px solid ${C.line}`, color: C.head, textDecoration: "none" }}
                                >
                                    <span style={{ font: `500 13px/1 ${MONO}`, letterSpacing: ".14em", textTransform: "uppercase", minWidth: 110 }}>{name}</span>
                                    <span style={{ font: `400 14px/1.3 ${SANS}`, color: C.dim, marginRight: "auto" }}>{sub}</span>
                                    <span className="rf-arrow" aria-hidden="true" style={{ font: `400 16px/1 ${SANS}` }}>
                                        {name === "Resume" ? "↓" : "↗"}
                                    </span>
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* base line */}
                <div style={{ marginTop: "clamp(48px,6vw,80px)", paddingTop: 20, borderTop: `1px solid ${C.line}`, display: "flex", flexWrap: "wrap", gap: "10px 28px", alignItems: "center", font: `400 12px/1.4 ${MONO}`, letterSpacing: ".12em", textTransform: "uppercase", color: C.dim }}>
                    <span>BLR · <ClockBLR /></span>
                    <span>©{new Date().getFullYear()} Pranita Sapkal</span>
                    <a href="#" onClick={(e) => (e.preventDefault(), window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }))} className="rf-link" style={{ marginLeft: "auto", color: C.head, textDecoration: "none", padding: "6px 0" }}>
                        Back to top ↑
                    </a>
                </div>
            </div>
            <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} pdf={pdf} pages={[resumePage1, resumePage2]} notify={notify} />
        </footer>
    )
}

addPropertyControls(RadioFooter, {
    tv: { type: ControlType.Image, title: "TV (cut out)" },
    img1: { type: ControlType.Image, title: "CH1 image (volcano)" },
    img2: { type: ControlType.Image, title: "CH2 image (yawn)" },
    img3: { type: ControlType.Image, title: "CH3 image (slumped)" },
    img4: { type: ControlType.Image, title: "CH4 image (knight)" },
    email: { type: ControlType.String, title: "Email", defaultValue: "sapkalp1997@gmail.com" },
    linkedin: { type: ControlType.String, title: "LinkedIn", defaultValue: "https://www.linkedin.com/in/pranita-sapkal-86364010a/" },
    behance: { type: ControlType.String, title: "Behance", defaultValue: "https://www.behance.net/pranitasapkal" },
    medium: { type: ControlType.String, title: "Medium", defaultValue: "https://medium.com/@sapkalp1997" },
    resumeFile: { type: ControlType.File, title: "Resume PDF", allowedFileTypes: ["pdf"] },
    resumePage1: { type: ControlType.Image, title: "Resume page 1" },
    resumePage2: { type: ControlType.Image, title: "Resume page 2" },
    notify: { type: ControlType.String, title: "Notify on download", defaultValue: "sapkalp1997@gmail.com" },
    resume: { type: ControlType.String, title: "Resume URL", defaultValue: "https://framerusercontent.com/assets/rlHNrrGQt7B0gNqyGpI4YRgurt4.pdf" },
    track1: { type: ControlType.File, title: "Full track CH 1 (optional)", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
    track2: { type: ControlType.File, title: "Full track CH 2 (optional)", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
    track3: { type: ControlType.File, title: "Full track CH 3 (optional)", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
    track4: { type: ControlType.File, title: "Full track CH 4 (optional)", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
})
