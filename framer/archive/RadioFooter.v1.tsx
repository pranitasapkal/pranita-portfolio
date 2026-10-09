import { addPropertyControls, ControlType } from "framer"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * RadioFooter: the site footer as a late-night TV radio, "Pranita FM". Replaces the full-screen TV footer.
 *
 * Left: the hero's retro TV, cut out, is the device. Its screen shows her cat through a CRT (screen-door grid,
 * scanlines, channel tint, flicker), an on-screen display, lyric-style lines and an equaliser driven by the audio.
 * The two dials printed on the TV are real controls: the top one changes channel (with a burst of static), the
 * bottom one is the volume knob (drag or arrow keys). A control deck under the TV repeats play / prev / next.
 * Music is generated live with the Web Audio API (four lo-fi channels, nothing licensed, nothing to download);
 * an uploaded track on a channel replaces its generated loop.
 * Right: contact. Email with copy, LinkedIn, Behance, Medium, resume, Bengaluru time, copyright, back to top.
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
const DEFAULT_CAT = "https://framerusercontent.com/images/bqUKyJKKGjk9ArFQc2oVfoiJQ.jpg?scale-down-to=1024"

type Channel = { name: string; bpm: number; tint: string; glow: string; chords: number[][]; lines: string[]; rain?: boolean; swing: number }
const CHANNELS: Channel[] = [
    {
        name: "Late shift",
        bpm: 76,
        tint: "#5FD3C0",
        glow: "95,211,192",
        swing: 0.14,
        chords: [[48, 52, 55, 59, 62], [45, 48, 52, 55, 59], [50, 53, 57, 60, 64], [43, 47, 53, 57, 64]],
        lines: ["late shift. one more frame to fix", "make the complex feel obvious", "the transporter calls at nine", "save. sync. ship. sleep."],
    },
    {
        name: "QC team on duty",
        bpm: 70,
        tint: "#F2B36B",
        glow: "242,179,107",
        swing: 0.18,
        chords: [[41, 45, 48, 52, 55], [40, 43, 47, 50, 55], [38, 41, 45, 48, 52], [36, 40, 43, 47, 50]],
        lines: ["two supervisors. zero chill.", "every screen ships past them first", "a nap on the keyboard counts as review", "approved, with one paw"],
    },
    {
        name: "No undo",
        bpm: 82,
        tint: "#E58AA6",
        glow: "229,138,166",
        swing: 0.1,
        chords: [[45, 48, 52, 55, 59], [38, 42, 45, 48, 52], [43, 47, 50, 54, 57], [48, 52, 55, 59, 62]],
        lines: ["watercolour. no ctrl+z.", "the paper decides what stays", "no stakeholders, just the brush", "let the mistake become the tiger"],
    },
    {
        name: "Monsoon in BLR",
        bpm: 64,
        tint: "#8FA8FF",
        glow: "143,168,255",
        swing: 0.16,
        rain: true,
        chords: [[39, 43, 46, 50, 53], [36, 39, 43, 46, 50], [44, 48, 51, 55, 58], [46, 50, 53, 56, 60]],
        lines: ["rain on the window, figma on the screen", "silk board traffic, headphones on", "chai number three", "the build is green. the sky is not."],
    },
]

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

// ── generative lo-fi engine ─────────────────────────────────────────────────────────────────────────────────────
class Radio {
    ctx: AudioContext
    master: GainNode
    bus: GainNode
    analyser: AnalyserNode
    noise: AudioBuffer
    ch = 0
    step = 0
    nextTime = 0
    start = 0
    timer: any = 0
    playing = false
    rnd = Math.random
    beds: AudioNode[] = []
    media: HTMLAudioElement | null = null
    mediaNode: MediaElementAudioSourceNode | null = null
    tracks: (string | undefined)[] = []

    constructor() {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext
        this.ctx = new AC()
        const ctx = this.ctx
        this.master = ctx.createGain()
        this.master.gain.value = 0.6
        const tone = ctx.createBiquadFilter()
        tone.type = "lowpass"
        tone.frequency.value = 5200
        const comp = ctx.createDynamicsCompressor()
        comp.threshold.value = -18
        comp.ratio.value = 3
        this.analyser = ctx.createAnalyser()
        this.analyser.fftSize = 256
        this.analyser.smoothingTimeConstant = 0.78
        this.bus = ctx.createGain()
        this.bus.connect(tone).connect(comp).connect(this.master)
        this.master.connect(this.analyser)
        this.analyser.connect(ctx.destination)
        const len = ctx.sampleRate * 2
        this.noise = ctx.createBuffer(1, len, ctx.sampleRate)
        const d = this.noise.getChannelData(0)
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    }

    get chan() {
        return CHANNELS[this.ch]
    }
    get beat() {
        return 60 / this.chan.bpm
    }

    noiseSrc(loop = false) {
        const s = this.ctx.createBufferSource()
        s.buffer = this.noise
        s.loop = loop
        return s
    }

    // vinyl crackle + hiss (+ rain on the monsoon channel) run under the music
    startBeds() {
        this.stopBeds()
        const ctx = this.ctx
        const hiss = this.noiseSrc(true)
        const hp = ctx.createBiquadFilter()
        hp.type = "highpass"
        hp.frequency.value = 5000
        const hg = ctx.createGain()
        hg.gain.value = 0.012
        hiss.connect(hp).connect(hg).connect(this.bus)
        hiss.start()
        this.beds.push(hiss)
        if (this.chan.rain) {
            const rain = this.noiseSrc(true)
            const lp = ctx.createBiquadFilter()
            lp.type = "bandpass"
            lp.frequency.value = 1400
            lp.Q.value = 0.4
            const rg = ctx.createGain()
            rg.gain.value = 0.07
            rain.connect(lp).connect(rg).connect(this.bus)
            rain.start()
            this.beds.push(rain)
        }
    }
    stopBeds() {
        this.beds.forEach((b: any) => {
            try {
                b.stop()
            } catch (_) {}
        })
        this.beds = []
    }

    crackle(t: number) {
        if (this.rnd() > 0.35) return
        const ctx = this.ctx
        const s = this.noiseSrc()
        const g = ctx.createGain()
        const bp = ctx.createBiquadFilter()
        bp.type = "highpass"
        bp.frequency.value = 2500
        const at = t + this.rnd() * this.beat * 0.25
        g.gain.setValueAtTime(0.0001, at)
        g.gain.exponentialRampToValueAtTime(0.05 + this.rnd() * 0.05, at + 0.001)
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.02)
        s.connect(bp).connect(g).connect(this.bus)
        s.start(at, this.rnd(), 0.03)
    }

    keys(notes: number[], t: number, dur: number) {
        const ctx = this.ctx
        notes.forEach((n, i) => {
            const at = t + i * 0.018
            const g = ctx.createGain()
            const lp = ctx.createBiquadFilter()
            lp.type = "lowpass"
            lp.frequency.setValueAtTime(2200, at)
            lp.frequency.exponentialRampToValueAtTime(700, at + dur)
            g.gain.setValueAtTime(0.0001, at)
            g.gain.exponentialRampToValueAtTime(0.055, at + 0.03)
            g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
            ;["triangle", "sine"].forEach((type, k) => {
                const o = ctx.createOscillator()
                o.type = type as OscillatorType
                o.frequency.value = mtof(n + 12)
                o.detune.value = (k ? -6 : 6) + Math.sin(t * 0.7) * 5
                o.connect(lp)
                o.start(at)
                o.stop(at + dur + 0.05)
            })
            lp.connect(g).connect(this.bus)
        })
    }

    bass(n: number, t: number, dur: number) {
        const ctx = this.ctx
        const o = ctx.createOscillator()
        o.type = "sine"
        o.frequency.value = mtof(n - 12)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
        o.connect(g).connect(this.bus)
        o.start(t)
        o.stop(t + dur + 0.05)
    }

    kick(t: number) {
        const ctx = this.ctx
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.frequency.setValueAtTime(120, t)
        o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
        g.gain.setValueAtTime(0.5, t)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32)
        o.connect(g).connect(this.bus)
        o.start(t)
        o.stop(t + 0.35)
    }

    snare(t: number) {
        const ctx = this.ctx
        const s = this.noiseSrc()
        const bp = ctx.createBiquadFilter()
        bp.type = "bandpass"
        bp.frequency.value = 1700
        bp.Q.value = 0.7
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.16, t)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
        s.connect(bp).connect(g).connect(this.bus)
        s.start(t, this.rnd(), 0.2)
    }

    hat(t: number, v: number) {
        const ctx = this.ctx
        const s = this.noiseSrc()
        const hp = ctx.createBiquadFilter()
        hp.type = "highpass"
        hp.frequency.value = 7000
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.035 * v, t)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
        s.connect(hp).connect(g).connect(this.bus)
        s.start(t, this.rnd(), 0.06)
    }

    lead(chord: number[], t: number) {
        const ctx = this.ctx
        const n = chord[1 + Math.floor(this.rnd() * (chord.length - 1))] + 24
        const o = ctx.createOscillator()
        o.type = "sine"
        o.frequency.value = mtof(n)
        const vib = ctx.createOscillator()
        const vg = ctx.createGain()
        vib.frequency.value = 5
        vg.gain.value = 3
        vib.connect(vg).connect(o.frequency)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.04, t + 0.04)
        g.gain.exponentialRampToValueAtTime(0.0001, t + this.beat * 1.4)
        o.connect(g).connect(this.bus)
        o.start(t)
        vib.start(t)
        o.stop(t + this.beat * 1.5)
        vib.stop(t + this.beat * 1.5)
    }

    schedule(i: number, t: number) {
        const c = this.chan
        const bar = Math.floor(i / 16) % c.chords.length
        const s = i % 16
        const chord = c.chords[bar]
        const sw = s % 2 ? c.swing * (this.beat / 4) : 0
        const tt = t + sw
        if (s === 0) this.keys(chord, tt, this.beat * 3.6)
        if (s === 8 && this.rnd() < 0.5) this.keys(chord.slice(1), tt, this.beat * 1.6)
        if (s === 0 || s === 10) this.bass(chord[0], tt, this.beat * (s === 0 ? 1.4 : 0.9))
        if (s === 6 && this.rnd() < 0.4) this.bass(chord[0] + 7, tt, this.beat * 0.5)
        if (s === 0 || s === 10 || (s === 7 && this.rnd() < 0.3)) this.kick(tt)
        if (s === 4 || s === 12) this.snare(tt)
        if (s % 2 === 0) this.hat(tt, s % 4 ? 0.6 : 1)
        if (s % 2 === 0 && this.rnd() < 0.18) this.lead(chord, tt)
        this.crackle(t)
    }

    tick = () => {
        const ahead = this.ctx.currentTime + 0.15
        const sixteenth = this.beat / 4
        while (this.nextTime < ahead) {
            this.schedule(this.step, this.nextTime)
            this.nextTime += sixteenth
            this.step++
        }
    }

    trackFor(ch: number) {
        return this.tracks[ch]
    }

    async play() {
        if (this.ctx.state !== "running") await this.ctx.resume()
        this.playing = true
        const src = this.trackFor(this.ch)
        if (src) return this.playMedia(src)
        this.startBeds()
        this.step = 0
        this.start = this.nextTime = this.ctx.currentTime + 0.06
        clearInterval(this.timer)
        this.timer = setInterval(this.tick, 25)
    }

    playMedia(src: string) {
        if (!this.media) {
            this.media = new Audio()
            this.media.crossOrigin = "anonymous"
            this.media.loop = true
            this.mediaNode = this.ctx.createMediaElementSource(this.media)
            this.mediaNode.connect(this.bus)
        }
        if (this.media.src !== src) this.media.src = src
        this.media.play().catch(() => {})
    }

    stop() {
        this.playing = false
        clearInterval(this.timer)
        this.stopBeds()
        if (this.media) this.media.pause()
    }

    staticBurst() {
        const ctx = this.ctx
        const s = this.noiseSrc()
        const bp = ctx.createBiquadFilter()
        bp.type = "bandpass"
        bp.frequency.value = 3200
        bp.Q.value = 0.5
        const g = ctx.createGain()
        const t = ctx.currentTime
        g.gain.setValueAtTime(0.18, t)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
        s.connect(bp).connect(g).connect(this.master)
        s.start(t, 0, 0.4)
    }

    async setChannel(ch: number) {
        const was = this.playing
        this.stop()
        this.ch = ch
        if (was) {
            this.staticBurst()
            setTimeout(() => this.play(), 260)
        }
    }

    setVolume(v: number) {
        this.master.gain.setTargetAtTime(v * v * 0.9, this.ctx.currentTime, 0.04)
    }

    close() {
        this.stop()
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
        cat,
        email = "sapkalp1997@gmail.com",
        linkedin = "https://linkedin.com/in/pranita-sapkal-86364010a",
        behance = "https://behance.net/pranitasapkal",
        medium = "https://medium.com/@Pranitasapkal",
        resume = "https://framerusercontent.com/assets/rlHNrrGQt7B0gNqyGpI4YRgurt4.pdf",
        track1,
        track2,
        track3,
        track4,
    } = props
    const tvSrc = tv || DEFAULT_TV
    const catSrc = cat || DEFAULT_CAT

    const radio = useRef<Radio | null>(null)
    const [playing, setPlaying] = useState(false)
    const [ch, setCh] = useState(0)
    const [vol, setVol] = useState(0.62)
    const [staticOn, setStaticOn] = useState(false)
    const [line, setLine] = useState(0)
    const [copied, setCopied] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [reduced, setReduced] = useState(false)
    const bars = useRef<HTMLDivElement>(null)
    const catRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const staticCanvas = useRef<HTMLCanvasElement>(null)
    const chan = CHANNELS[ch]

    useEffect(() => {
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return () => radio.current?.close()
    }, [])

    const ensure = () => {
        if (!radio.current) radio.current = new Radio()
        radio.current.tracks = [track1, track2, track3, track4]
        return radio.current
    }

    const toggle = useCallback(async () => {
        const r = ensure()
        if (r.playing) {
            r.stop()
            setPlaying(false)
        } else {
            r.setVolume(vol)
            await r.play()
            setPlaying(true)
        }
    }, [vol, track1, track2, track3, track4])

    const tune = useCallback(
        (dir: number) => {
            const next = (ch + dir + CHANNELS.length) % CHANNELS.length
            setCh(next)
            setLine(0)
            setElapsed(0)
            if (radio.current) radio.current.setChannel(next)
            setStaticOn(true)
            setTimeout(() => setStaticOn(false), reduced ? 120 : 420)
        },
        [ch, reduced]
    )

    const pick = (i: number) => i !== ch && tune(i - ch)

    useEffect(() => {
        radio.current?.setVolume(vol)
    }, [vol])

    // per frame: equaliser bars, cat bob on the beat, screen glow from loudness, lyric line + clock
    useEffect(() => {
        let raf = 0
        const data = new Uint8Array(128)
        const loop = () => {
            const r = radio.current
            let level = 0
            if (r && r.playing) {
                r.analyser.getByteFrequencyData(data)
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
                const t = r.ctx.currentTime - r.start
                const phase = (t / r.beat) % 1
                if (catRef.current && !reduced) {
                    const pulse = Math.pow(1 - phase, 6)
                    catRef.current.style.transform = `scale(${1.04 + pulse * 0.018}) translateY(${-pulse * 3}px)`
                }
                const bar = Math.floor(t / (r.beat * 4))
                setLine((l) => (l !== bar % 4 ? bar % 4 : l))
                setElapsed(Math.max(0, Math.floor(t)))
            } else if (bars.current) {
                for (const k of Array.from(bars.current.children)) (k as HTMLElement).style.transform = "scaleY(0.06)"
            }
            if (glowRef.current) glowRef.current.style.opacity = String(0.35 + level * 1.4)
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

    const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`
    const links: [string, string, string, boolean][] = [
        ["LinkedIn", "Work history", linkedin, true],
        ["Behance", "Visual and earlier work", behance, true],
        ["Medium", "Writing", medium, true],
        ["Resume", "PDF", resume, true],
    ]

    return (
        <footer style={{ background: C.bg, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased", overflow: "hidden" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&family=VT323&display=swap');
                .rf-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(40px,6vw,96px);align-items:center}
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
                @media(prefers-reduced-motion:reduce){.rf-anim{animation:none!important}}`}</style>

            <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(64px,8vw,112px) clamp(20px,5vw,80px) clamp(28px,3vw,40px)" }}>
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
                                <div ref={catRef} style={{ position: "absolute", inset: "-3%", transition: "opacity .6s", opacity: playing ? 1 : 0.42 }}>
                                    <img
                                        src={catSrc}
                                        alt="Pranita's cat, the station mascot"
                                        draggable={false}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(1) contrast(1.15) brightness(.92)" }}
                                    />
                                    <div style={{ position: "absolute", inset: 0, background: chan.tint, mixBlendMode: "color", transition: "background .5s" }} />
                                    <div style={{ position: "absolute", inset: 0, background: chan.tint, mixBlendMode: "soft-light", opacity: 0.35, transition: "background .5s" }} />
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
                                <div style={{ position: "absolute", left: "5%", top: "6%", font: `400 clamp(16px,2.3vw,30px)/1 ${VCR}`, color: "#EFFFFA", textShadow: `0 0 8px rgba(${chan.glow},.9)`, letterSpacing: ".04em" }}>
                                    CH {String(ch + 1).padStart(2, "0")}
                                </div>
                                <div style={{ position: "absolute", right: "5%", top: "6%", font: `400 clamp(14px,2vw,26px)/1 ${VCR}`, color: "#EFFFFA", textShadow: `0 0 8px rgba(${chan.glow},.9)` }}>
                                    {playing ? `▶ ${mmss}` : "❚❚ PAUSE"}
                                </div>
                                <div style={{ position: "absolute", left: "5%", top: "16%", font: `400 clamp(12px,1.5vw,19px)/1 ${VCR}`, color: "rgba(239,255,250,.85)", textTransform: "uppercase" }}>
                                    {chan.name}
                                </div>

                                {/* lyric lines */}
                                <div aria-hidden={!playing} style={{ position: "absolute", left: "8%", right: "8%", bottom: "24%", textAlign: "center" }}>
                                    {playing ? (
                                        <>
                                            <div style={{ font: `500 clamp(13px,1.7vw,21px)/1.25 ${SANS}`, color: "#fff", textShadow: "0 1px 10px rgba(0,0,0,.7)", transition: "opacity .4s" }}>{chan.lines[line]}</div>
                                            <div style={{ marginTop: 6, font: `400 clamp(11px,1.3vw,16px)/1.25 ${SANS}`, color: "rgba(255,255,255,.5)" }}>{chan.lines[(line + 1) % 4]}</div>
                                        </>
                                    ) : (
                                        <div className="rf-anim" style={{ font: `400 clamp(15px,2vw,26px)/1 ${VCR}`, color: "#EFFFFA", letterSpacing: ".06em", animation: "rf-blink 1.2s steps(1) infinite" }}>
                                            PRESS ▶ TO TUNE IN
                                        </div>
                                    )}
                                </div>

                                {/* equaliser */}
                                <div ref={bars} aria-hidden="true" style={{ position: "absolute", left: "5%", right: "5%", bottom: "6%", height: "13%", display: "flex", alignItems: "flex-end", gap: "1.2%" }}>
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
                                aria-label={`Change channel. Now channel ${ch + 1} of ${CHANNELS.length}, ${chan.name}`}
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
                            <DeckButton label="Previous channel" onClick={() => tune(-1)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2v12M13 2 5 8l8 6V2z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                            </DeckButton>
                            <DeckButton big label={playing ? "Pause Pranita FM" : "Play Pranita FM"} pressed={playing} onClick={toggle}>
                                {playing ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="3" width="4.5" height="14" rx="1" fill="currentColor" /><rect x="11.5" y="3" width="4.5" height="14" rx="1" fill="currentColor" /></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3l12 7-12 7V3z" fill="currentColor" /></svg>
                                )}
                            </DeckButton>
                            <DeckButton label="Next channel" onClick={() => tune(1)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 2v12M3 2l8 6-8 6V2z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                            </DeckButton>
                            <div role="group" aria-label="Channels" style={{ display: "flex", gap: 10, marginLeft: 8 }}>
                                {CHANNELS.map((c, i) => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        className="rf-dot"
                                        aria-label={`Channel ${i + 1}, ${c.name}`}
                                        aria-current={i === ch}
                                        onClick={() => pick(i)}
                                        style={{ width: 22, height: 22, display: "grid", placeItems: "center", border: 0, background: "none", cursor: "pointer", padding: 0 }}
                                    >
                                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: i === ch ? c.tint : "rgba(255,255,255,.22)", boxShadow: i === ch ? `0 0 10px ${c.tint}` : "none", transition: "background .3s, box-shadow .3s" }} />
                                    </button>
                                ))}
                            </div>
                            <div aria-live="polite" style={{ marginLeft: "auto", textAlign: "right", minWidth: 0 }}>
                                <div style={{ font: `500 14px/1.3 ${SANS}`, color: C.head }}>{chan.name}</div>
                                <div style={{ font: `400 11px/1.4 ${MONO}`, letterSpacing: ".12em", color: C.dim }}>
                                    CH {String(ch + 1).padStart(2, "0")} · {chan.bpm} BPM · VOL {Math.round(vol * 100)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── right: contact ── */}
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
                        <Label>[Say hello]</Label>
                        <h2 style={{ margin: 0, font: `500 clamp(40px,4.6vw,64px)/1 ${SANS}`, letterSpacing: "-0.03em", color: C.head, textTransform: "uppercase" }}>
                            Let's make it feel <span style={{ font: `400 1.2em/0.8 ${SCRIPT}`, textTransform: "none" }}>obvious</span>.
                        </h2>
                        <p style={{ margin: 0, maxWidth: 440, font: `400 clamp(15px,1.15vw,17px)/1.6 ${SANS}`, color: C.dim }}>
                            Got a messy system that people need to trust? Write to me, or tune the radio while you think about it.
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
        </footer>
    )
}

addPropertyControls(RadioFooter, {
    tv: { type: ControlType.Image, title: "TV (cut out)" },
    cat: { type: ControlType.Image, title: "Cat" },
    email: { type: ControlType.String, title: "Email", defaultValue: "sapkalp1997@gmail.com" },
    linkedin: { type: ControlType.String, title: "LinkedIn", defaultValue: "https://linkedin.com/in/pranita-sapkal-86364010a" },
    behance: { type: ControlType.String, title: "Behance", defaultValue: "https://behance.net/pranitasapkal" },
    medium: { type: ControlType.String, title: "Medium", defaultValue: "https://medium.com/@Pranitasapkal" },
    resume: { type: ControlType.String, title: "Resume URL", defaultValue: "https://framerusercontent.com/assets/rlHNrrGQt7B0gNqyGpI4YRgurt4.pdf" },
    track1: { type: ControlType.File, title: "Track CH 1", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
    track2: { type: ControlType.File, title: "Track CH 2", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
    track3: { type: ControlType.File, title: "Track CH 3", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
    track4: { type: ControlType.File, title: "Track CH 4", allowedFileTypes: ["mp3", "m4a", "wav", "ogg"] },
})
