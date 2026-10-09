import { addPropertyControls, ControlType } from "framer"

/**
 * Trips panel: case study 01 (v5, from Claude Design).
 * The case study runs as its own page because it drives a live prototype through same-origin iframes
 * (window.__vt.scene). This component shows that page full-screen in place of the old v3 layout.
 * The old v3 component is kept in framer/archive/TripsPanelCase.v3.tsx.
 *
 * Source bundle: case-study-redesign-request/project/Trips Case Study v5.dc.html
 * Hosted from branch gh-pages: https://pranitasapkal.github.io/pranita-portfolio/trips/
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

export default function TripsPanelCase(props: any) {
    const { src = "https://pranitasapkal.github.io/pranita-portfolio/trips/", topOffset = 96, style } = props
    return (
        <div style={{ position: "relative", width: "100%", height: "100vh", background: "#FFFFFF", paddingTop: topOffset, boxSizing: "border-box", ...style }}>
            <iframe
                src={src}
                title="Trips panel case study"
                loading="eager"
                allow="fullscreen"
                style={{ display: "block", width: "100%", height: "100%", border: 0 }}
            />
        </div>
    )
}

addPropertyControls(TripsPanelCase, {
    src: { type: ControlType.String, title: "Case study URL", defaultValue: "https://pranitasapkal.github.io/pranita-portfolio/trips/" },
    topOffset: { type: ControlType.Number, title: "Space for navbar", defaultValue: 96, min: 0, max: 200, step: 4 },
})
