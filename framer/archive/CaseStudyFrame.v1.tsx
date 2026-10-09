import { addPropertyControls, ControlType } from "framer"

/**
 * CaseStudyFrame: shows a hosted v5 case study full-screen inside a Framer case page.
 * Template and rules: templates/case-study-v5/TEMPLATE.md (ADR-008).
 *
 * Cases are hosted on GitHub Pages (branch gh-pages, /<slug>/) because each one drives a live prototype
 * through same-origin iframes, which cannot run inside Framer. Set `src` to the live URL; `topOffset`
 * leaves room for the site's floating navbar. Width is 100vw on purpose: Framer's preview did not apply Fill
 * to the Contract page instance (it stayed at the 300px intrinsic width), so the component sizes itself.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

export default function CaseStudyFrame(props: any) {
    const { src = "", title = "Case study", topOffset = 96, style } = props
    return (
        <div style={{ position: "relative", maxWidth: "100vw", height: "100vh", background: "#FFFFFF", paddingTop: topOffset, boxSizing: "border-box", ...style, width: "100vw" }}>
            {src ? (
                <iframe
                    src={src}
                    title={title}
                    loading="eager"
                    allow="fullscreen"
                    style={{ display: "block", width: "100%", height: "100%", border: 0 }}
                />
            ) : (
                <div style={{ display: "grid", placeItems: "center", height: "100%", font: "500 14px/1.5 system-ui, sans-serif", color: "#55524D" }}>
                    Set "Case study URL" to https://pranitasapkal.github.io/pranita-portfolio/&lt;slug&gt;/
                </div>
            )}
        </div>
    )
}

addPropertyControls(CaseStudyFrame, {
    src: { type: ControlType.String, title: "Case study URL", defaultValue: "" },
    title: { type: ControlType.String, title: "Frame title", defaultValue: "Case study" },
    topOffset: { type: ControlType.Number, title: "Space for navbar", defaultValue: 96, min: 0, max: 200, step: 4 },
})
