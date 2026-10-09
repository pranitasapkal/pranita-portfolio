import { addPropertyControls, ControlType } from "framer"

/**
 * ArtTicker — the watercolour marquee for the Beyond Pixels section.
 * Twelve paintings: the six already on Home plus the six unique keepers from the
 * Behance gallery (the other five in that gallery were already here).
 *
 * Matches the existing ticker's card treatment: 288x224, radius 16, 1px border,
 * gap 20, infinite horizontal scroll, pauses on hover, fades at both edges.
 * Respects prefers-reduced-motion by standing still.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 224
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/art"

const ART: [string, string][] = [
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
]

export default function ArtTicker(props: any) {
    const {
        cardWidth = 288,
        cardHeight = 224,
        gap = 20,
        speed = 60,
        radius = 16,
        fit = "cover",
        focus = 35,
    } = props

    // two copies back to back so the loop has no seam
    const row = [...ART, ...ART]
    const trackWidth = ART.length * (cardWidth + gap)

    return (
        <div
            style={{
                width: "100%",
                overflow: "hidden",
                position: "relative",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
                maskImage:
                    "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
            }}
        >
            <style>
                {`@keyframes art-marquee { from { transform: translateX(0) } to { transform: translateX(-${trackWidth}px) } }
                  .art-track { animation: art-marquee ${trackWidth / speed}s linear infinite; }
                  .art-wrap:hover .art-track { animation-play-state: paused; }
                  @media (prefers-reduced-motion: reduce) { .art-track { animation: none; } }`}
            </style>
            <div className="art-wrap">
                <div className="art-track" style={{ display: "flex", gap, width: "max-content" }}>
                    {row.map(([file, alt], i) => (
                        <figure
                            key={`${file}-${i}`}
                            style={{
                                margin: 0,
                                flex: `0 0 ${cardWidth}px`,
                                width: cardWidth,
                                height: cardHeight,
                                borderRadius: radius,
                                overflow: "hidden",
                                border: "1px solid rgba(0,0,0,0.12)",
                                background: "rgba(0,0,0,0.04)",
                            }}
                        >
                            <img
                                src={`${CDN}/${file}`}
                                alt={alt}
                                loading="lazy"
                                style={{
                                    display: "block",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: fit,
                                    objectPosition: `center ${focus}%`,
                                    background: "#ffffff",
                                }}
                            />
                        </figure>
                    ))}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(ArtTicker, {
    cardWidth: { type: ControlType.Number, title: "Card W", defaultValue: 288, min: 120, max: 600 },
    cardHeight: { type: ControlType.Number, title: "Card H", defaultValue: 224, min: 100, max: 600 },
    gap: { type: ControlType.Number, title: "Gap", defaultValue: 20, min: 0, max: 80 },
    speed: { type: ControlType.Number, title: "Speed", defaultValue: 60, min: 10, max: 200 },
    radius: { type: ControlType.Number, title: "Radius", defaultValue: 16, min: 0, max: 40 },
    fit: {
        type: ControlType.Enum,
        title: "Fit",
        options: ["cover", "contain"],
        optionTitles: ["Fill the card", "Show the whole painting"],
        defaultValue: "cover",
    },
    focus: { type: ControlType.Number, title: "Focus %", defaultValue: 35, min: 0, max: 100 },
})
