import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * BeyondPixels — the three "Beyond Pixels" rows on Home, opened on HOVER.
 * Replaces the click-driven "Beyond accordion" the Framer Agent built.
 *
 * Hover (or keyboard focus) on a row header reveals its caption + marquee; leaving the
 * component collapses everything. On touch devices (no hover) a tap toggles instead.
 * Copy is verbatim from the current site — the words are being rewritten separately.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 640
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

// Paintings as 560px-tall WebP (2x the 280px cards), hosted with the case studies on GitHub Pages.
const ART = "https://pranitasapkal.github.io/pranita-portfolio/assets/home/art"
const FU = "https://framerusercontent.com/images"

const CATS = [
    "Rn5jdgpWWL3OtfkpikEV2BxLuX0.jpg?width=750&height=1000",
    "jGHTBUZwGacvPztLnydY8JIjfKE.jpg?scale-down-to=1024&width=674&height=1200",
    "piTIRdfN1n5l769cDlMKfE2s.jpg?scale-down-to=1024&width=900&height=1200",
    "g1uPeORreq2zz00fDlRKXFQIo.jpg?scale-down-to=1024&width=900&height=1200",
    "AJWoqAZ8BTDeENGW5Fm7qPkZhs.jpg?scale-down-to=1024&width=900&height=1200",
    "bqUKyJKKGjk9ArFQc2oVfoiJQ.jpg?scale-down-to=1024&width=675&height=1200",
    "eOLH9n06hFmPx5wktNF7pTTy0.jpg?scale-down-to=1024&width=900&height=1200",
    "6zaAgSE0Iw0DmWMZvOhnKVm22E.jpg?scale-down-to=1024&width=900&height=1200",
    "jcvLLVg1WnLJHor5SxVPXdOlD9k.jpg?scale-down-to=1024&width=900&height=1200",
].map((f) => [`${FU}/${f}`, "Quality control cat"] as [string, string])

// [file, alt, width / height of the scan]
const PAINTINGS: [string, string, number][] = [
    ["tiger.jpg", "Tiger, watercolour", 626 / 900],
    ["lion-cub.jpg", "Lion and cub, watercolour", 1013 / 1440],
    ["three-cats.jpg", "Three cats, watercolour", 1029 / 1440],
    ["parrot.jpg", "Macaw, watercolour", 1100 / 802],
    ["boy-portrait.jpg", "Portrait, watercolour", 639 / 900],
    ["flower-crown.jpg", "Portrait with flower crown, watercolour", 635 / 900],
    ["red-lips.jpg", "Portrait, watercolour", 596 / 900],
    ["lighter.jpg", "Portrait with a lighter, watercolour", 1018 / 1440],
    ["chai-samosa.jpg", "Chai and samosa, watercolour", 900 / 657],
    ["kettle.jpg", "Kettle on a wood fire, watercolour", 1035 / 1440],
    ["onions.jpg", "Onions on a table, watercolour", 1035 / 1440],
    ["spice-shelf.jpg", "Spice shelf, watercolour", 900 / 660],
].map(([f, a, r]) => [`${ART}/${f.replace(".jpg", ".webp")}`, a, r] as [string, string, number])

const ROWS: { prompt: string; caption: string; images: any[]; fit?: boolean }[] = [
    {
        prompt: "MY QUALITY CONTROL TEAM:",
        caption: "Two supervisors. Zero chill. Every screen ships past them first.",
        images: CATS,
    },
    {
        prompt: "WHERE MY MONEY ACTUALLY GOES:",
        caption: "Placeholder: plants, cat treats, and fonts I did not need.",
        images: [],
    },
    {
        prompt: "WHERE CTRL+Z DOES NOT WORK:",
        caption: "I do art too. Watercolour and acrylic. No undo, no stakeholders.",
        images: PAINTINGS,
        fit: true,
    },
]

const SANS = '"Geist", "Inter", system-ui, sans-serif'
const EASE = "cubic-bezier(.65,0,.35,1)"

function Ticker({ images, cardW, cardH, gap, speed, radius, id, fit }: any) {
    const row = [...images, ...images]
    // fit: each card takes the image's own proportions at a taller fixed height, so a painting is never cropped
    // and never letterboxed. Otherwise every card is cardW x cardH with the image cropped to fill.
    const h = fit ? Math.round(cardH * 1.25) : cardH
    const w = (r?: number) => (fit && r ? Math.round(h * r) : cardW)
    const track = images.reduce((sum: number, im: any) => sum + w(im[2]) + gap, 0)

    // Drift on its own, and let people drag it either way (mouse, pen or touch). Pauses while hovered or dragged.
    // Arrow keys move it one card when the strip has focus. Reduced motion: no drift, dragging still works.
    const trackRef = useRef<HTMLDivElement>(null)
    const x = useRef(0)
    const drag = useRef<{ startX: number; startOff: number; moved: boolean; id: number } | null>(null)
    const hover = useRef(false)
    const [grabbing, setGrabbing] = useState(false)

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let raf = 0
        let last = performance.now()
        const tick = (now: number) => {
            const dt = Math.min(64, now - last) / 1000
            last = now
            if (!reduced && !drag.current && !hover.current) x.current -= speed * dt
            // wrap into (-track, 0] so the duplicated row loops seamlessly in both directions
            x.current = ((x.current % track) - track) % track
            if (trackRef.current) trackRef.current.style.transform = `translate3d(${x.current}px,0,0)`
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [speed, track])

    const onDown = (e: any) => {
        if (e.pointerType === "mouse" && e.button !== 0) return
        drag.current = { startX: e.clientX, startOff: x.current, moved: false, id: e.pointerId }
        e.currentTarget.setPointerCapture?.(e.pointerId)
        setGrabbing(true)
    }
    const onMove = (e: any) => {
        const d = drag.current
        if (!d || d.id !== e.pointerId) return
        const dx = e.clientX - d.startX
        if (Math.abs(dx) > 3) d.moved = true
        x.current = d.startOff + dx
    }
    const onUp = (e: any) => {
        if (!drag.current) return
        e.currentTarget.releasePointerCapture?.(drag.current.id)
        drag.current = null
        setGrabbing(false)
    }
    const step = (dir: number) => (x.current += dir * (w(images[0]?.[2]) + gap))

    return (
        <div
            role="region"
            aria-label="Image strip. Drag, or use the left and right arrow keys, to browse."
            tabIndex={0}
            className={`bp-wrap-${id}`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onMouseEnter={() => (hover.current = true)}
            onMouseLeave={() => (hover.current = false)}
            onKeyDown={(e) => {
                if (e.key === "ArrowLeft") (step(1), e.preventDefault())
                if (e.key === "ArrowRight") (step(-1), e.preventDefault())
            }}
            onDragStart={(e) => e.preventDefault()}
            style={{
                width: "100%",
                overflow: "hidden",
                cursor: grabbing ? "grabbing" : "grab",
                touchAction: "pan-y",
                userSelect: "none",
                WebkitUserSelect: "none",
                outlineOffset: 4,
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
                maskImage:
                    "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
            }}
        >
            <div ref={trackRef} style={{ display: "flex", gap, width: "max-content", willChange: "transform" }}>
                {row.map(([src, alt, r], i) => (
                    <figure
                        key={`${src}-${i}`}
                        aria-hidden={i >= images.length}
                        style={{
                            margin: 0,
                            flex: `0 0 ${w(r)}px`,
                            width: w(r),
                            height: h,
                            borderRadius: radius,
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(255,255,255,0.04)",
                        }}
                    >
                        <img
                            src={src}
                            alt={i >= images.length ? "" : alt}
                            loading="lazy"
                            draggable={false}
                            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: fit ? "center" : "center 35%", pointerEvents: "none" }}
                        />
                    </figure>
                ))}
            </div>
        </div>
    )
}

export default function BeyondPixels(props: any) {
    const {
        headingColor = "#E0E0E0",
        headingHover = "#FFFFFF",
        captionColor = "#9E9E9E",
        lineColor = "rgba(255,255,255,0.18)",
        headingSize = 56,
        cardW = 288,
        cardH = 224,
        gap = 20,
        speed = 60,
        radius = 16,
    } = props
    // The money row's strip comes from six image properties (Game 1-6), uploaded in Framer.
    const games = [1, 2, 3, 4, 5, 6]
        .map((n) => props[`game${n}`])
        .filter(Boolean)
        .map((src: string) => [src, "A game I am playing"] as [string, string])
    const rows = ROWS.map((r, i) => (i === 1 && games.length ? { ...r, images: games } : r))

    const [open, setOpen] = useState<number | null>(null)
    const [hoverable, setHoverable] = useState(true)
    const [reduced, setReduced] = useState(false)
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setHoverable(window.matchMedia("(hover: hover)").matches)
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }, [])

    const trans = reduced ? "none" : `grid-template-rows .5s ${EASE}, opacity .5s ${EASE}`

    return (
        <div
            ref={hostRef}
            onMouseLeave={() => hoverable && setOpen(null)}
            style={{ width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');`}</style>
            {rows.map((r, i) => {
                const isOpen = open === i
                return (
                    <div
                        key={r.prompt}
                        onMouseEnter={() => hoverable && setOpen(i)}
                        style={{ borderTop: `1px solid ${lineColor}` }}
                    >
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`bp-panel-${i}`}
                            onClick={() => !hoverable && setOpen(isOpen ? null : i)}
                            onFocus={() => setOpen(i)}
                            style={{
                                all: "unset",
                                boxSizing: "border-box",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                minHeight: 88,
                                padding: "28px 16px",
                                cursor: "pointer",
                                textAlign: "center",
                                font: `500 clamp(28px, 4.2vw, ${headingSize}px)/1.05 ${SANS}`,
                                letterSpacing: "-0.02em",
                                textTransform: "uppercase",
                                color: isOpen ? headingHover : headingColor,
                                transition: reduced ? "none" : `color .3s ${EASE}`,
                            }}
                        >
                            {r.prompt}
                        </button>
                        <div
                            id={`bp-panel-${i}`}
                            role="region"
                            aria-hidden={!isOpen}
                            style={{
                                display: "grid",
                                gridTemplateRows: isOpen ? "1fr" : "0fr",
                                opacity: isOpen ? 1 : 0,
                                transition: trans,
                            }}
                        >
                            <div style={{ overflow: "hidden" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "0 0 40px" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            textAlign: "center",
                                            font: `400 clamp(15px,1.15vw,18px)/1.6 ${SANS}`,
                                            color: captionColor,
                                        }}
                                    >
                                        {r.caption}
                                    </p>
                                    {r.images.length > 0 && (
                                        <Ticker images={r.images} cardW={cardW} cardH={cardH} gap={gap} speed={speed} radius={radius} id={i} fit={r.fit} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
            <div style={{ borderTop: `1px solid ${lineColor}` }} />
        </div>
    )
}

addPropertyControls(BeyondPixels, {
    headingColor: { type: ControlType.Color, title: "Heading", defaultValue: "#E0E0E0" },
    headingHover: { type: ControlType.Color, title: "Heading hover", defaultValue: "#FFFFFF" },
    captionColor: { type: ControlType.Color, title: "Caption", defaultValue: "#9E9E9E" },
    lineColor: { type: ControlType.Color, title: "Hairline", defaultValue: "rgba(255,255,255,0.18)" },
    headingSize: { type: ControlType.Number, title: "Heading px", defaultValue: 56, min: 24, max: 96 },
    cardW: { type: ControlType.Number, title: "Card W", defaultValue: 288, min: 120, max: 600 },
    cardH: { type: ControlType.Number, title: "Card H", defaultValue: 224, min: 100, max: 600 },
    gap: { type: ControlType.Number, title: "Gap", defaultValue: 20, min: 0, max: 80 },
    speed: { type: ControlType.Number, title: "Speed", defaultValue: 60, min: 10, max: 200 },
    radius: { type: ControlType.Number, title: "Radius", defaultValue: 16, min: 0, max: 40 },
    game1: { type: ControlType.Image, title: "Game 1" },
    game2: { type: ControlType.Image, title: "Game 2" },
    game3: { type: ControlType.Image, title: "Game 3" },
    game4: { type: ControlType.Image, title: "Game 4" },
    game5: { type: ControlType.Image, title: "Game 5" },
    game6: { type: ControlType.Image, title: "Game 6" },
})
