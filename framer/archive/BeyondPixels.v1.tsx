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

const ART =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/art"
const FU = "https://framerusercontent.com/images"

const CATS = [
    "Rn5jdgpWWL3OtfkpikEV2BxLuX0.jpg?width=750&height=1000",
    "jGHTBUZwGacvPztLnydY8JIjfKE.jpg?scale-down-to=1024&width=674&height=1200",
    "piTIRdfN1n5l769cDlMKfE2s.jpg?scale-down-to=1024&width=900&height=1200",
    "g1uPeORreq2zz00fDlRKXFQIo.jpg?scale-down-to=1024&width=900&height=1200",
    "AJWoqAZ8BTDeENGW5Fm7qPkZhs.jpg?scale-down-to=1024&width=900&height=1200",
    "N4zN9DgBpxcOiLE4QPvSEPZhvyg.jpg?scale-down-to=1024&width=993&height=1200",
    "bqUKyJKKGjk9ArFQc2oVfoiJQ.jpg?scale-down-to=1024&width=675&height=1200",
    "eOLH9n06hFmPx5wktNF7pTTy0.jpg?scale-down-to=1024&width=900&height=1200",
    "6zaAgSE0Iw0DmWMZvOhnKVm22E.jpg?scale-down-to=1024&width=900&height=1200",
    "jcvLLVg1WnLJHor5SxVPXdOlD9k.jpg?scale-down-to=1024&width=900&height=1200",
].map((f) => [`${FU}/${f}`, "Quality control cat"] as [string, string])

const PAINTINGS: [string, string][] = [
    ["tiger.jpg", "Tiger, watercolour"],
    ["lion-cub.jpg", "Lion and cub, watercolour"],
    ["three-cats.jpg", "Three cats, watercolour"],
    ["parrot.jpg", "Macaw, watercolour"],
    ["boy-portrait.jpg", "Portrait, watercolour"],
    ["flower-crown.jpg", "Portrait with flower crown, watercolour"],
    ["red-lips.jpg", "Portrait, watercolour"],
    ["lighter.jpg", "Portrait with a lighter, watercolour"],
    ["chai-samosa.jpg", "Chai and samosa, watercolour"],
    ["kettle.jpg", "Kettle on a wood fire, watercolour"],
    ["onions.jpg", "Onions on a table, watercolour"],
    ["spice-shelf.jpg", "Spice shelf, watercolour"],
].map(([f, a]) => [`${ART}/${f}`, a] as [string, string])

const ROWS: { prompt: string; caption: string; images: [string, string][] }[] = [
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
    },
]

const SANS = '"Geist", "Inter", system-ui, sans-serif'
const EASE = "cubic-bezier(.65,0,.35,1)"

function Ticker({ images, cardW, cardH, gap, speed, radius, id }: any) {
    const row = [...images, ...images]
    const track = images.length * (cardW + gap)
    return (
        <div
            className={`bp-wrap-${id}`}
            style={{
                width: "100%",
                overflow: "hidden",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
                maskImage:
                    "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
            }}
        >
            <style>{`
                @keyframes bp-marquee-${id} { from { transform: translateX(0) } to { transform: translateX(-${track}px) } }
                .bp-track-${id} { animation: bp-marquee-${id} ${track / speed}s linear infinite; }
                .bp-wrap-${id}:hover .bp-track-${id} { animation-play-state: paused; }
                @media (prefers-reduced-motion: reduce) { .bp-track-${id} { animation: none; } }
            `}</style>
            <div className={`bp-track-${id}`} style={{ display: "flex", gap, width: "max-content" }}>
                {row.map(([src, alt], i) => (
                    <figure
                        key={`${src}-${i}`}
                        style={{
                            margin: 0,
                            flex: `0 0 ${cardW}px`,
                            width: cardW,
                            height: cardH,
                            borderRadius: radius,
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(255,255,255,0.04)",
                        }}
                    >
                        <img
                            src={src}
                            alt={alt}
                            loading="lazy"
                            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
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
            {ROWS.map((r, i) => {
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
                                        <Ticker images={r.images} cardW={cardW} cardH={cardH} gap={gap} speed={speed} radius={radius} id={i} />
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
})
