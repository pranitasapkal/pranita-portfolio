import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * ContractPanelCase (same code as CaseStudyFrame.tsx): shows a hosted v5 case study full-screen inside a Framer case page.
 * Template and rules: templates/case-study-v5/TEMPLATE.md (ADR-008).
 *
 * Cases are hosted on GitHub Pages (branch gh-pages, /<slug>/) because each one drives a live prototype
 * through same-origin iframes, which cannot run inside Framer. Set `src` to the live URL; `topOffset`
 * leaves room for the site's floating navbar. Width is 100vw on purpose: Framer's preview did not apply Fill
 * to the Contract page instance (it stayed at the 300px intrinsic width), so the component sizes itself.
 *
 * Go back / Next project: the hosted page posts {type:"pf-nav", href} and waits a moment for "pf-nav-ok". This
 * component answers and switches the route inside the running site (Framer's router reads history.state.routeId
 * on popstate), so Home appears at once instead of the whole site reloading. No answer, or a path not in ROUTES,
 * and the hosted page loads the URL the slow way itself. Route ids come from the live site; re-read them
 * (history.state.routeId after visiting a page) if a page is recreated.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const ROUTES: Record<string, string> = {
    "/": "augiA20Il",
    "/work/trips-panel": "roSw65TG4",
    "/contract-panel": "Xfm4Cw5V9",
    "/dojoin": "Xag1FG9Ce",
    "/smart-home": "gg9IAu2DR",
}

export default function ContractPanelCase(props: any) {
    const { src = "https://pranitasapkal.github.io/pranita-portfolio/contract/", title = "Contract Management case study", topOffset = 96, style } = props
    const frame = useRef<HTMLIFrameElement>(null)
    // The hosted page's prototype lightbox asks for the whole screen ({type:"pf-modal", open}); while it is open this
    // frame covers the viewport, above the site navbar, and the page behind stops scrolling.
    const [full, setFull] = useState(false)
    useEffect(() => {
        const onMsg = (e: MessageEvent) => {
            const d = e.data
            if (!d || d.type !== "pf-modal" || !frame.current || e.source !== frame.current.contentWindow) return
            setFull(!!d.open)
        }
        addEventListener("message", onMsg)
        return () => removeEventListener("message", onMsg)
    }, [])
    useEffect(() => {
        if (!full) return
        const html = document.documentElement
        const prev = html.style.overflow
        html.style.overflow = "hidden"
        return () => {
            html.style.overflow = prev
        }
    }, [full])

    useEffect(() => {
        let fallback: any
        let going = false
        const onMsg = (e: MessageEvent) => {
            const d = e.data
            if (!d || d.type !== "pf-nav" || !frame.current || e.source !== frame.current.contentWindow) return
            if (going) {
                // a double click: the first message is already switching the page
                try {
                    ;(e.source as Window).postMessage({ type: "pf-nav-ok" }, "*")
                } catch (_) {}
                return
            }
            let path = "",
                hash = ""
            try {
                const u = new URL(d.href)
                path = u.pathname.replace(/(.)\/$/, "$1")
                hash = u.hash
            } catch (_) {}
            const routeId = ROUTES[path]
            if (!routeId || /(^|\.)framer(canvas)?\.com$/.test(location.hostname)) return
            try {
                ;(e.source as Window).postMessage({ type: "pf-nav-ok" }, "*")
            } catch (_) {}
            going = true
            const state = { routeId, localeId: "default" }
            history.pushState(state, "", path + hash)
            dispatchEvent(new PopStateEvent("popstate", { state }))
            // this component unmounts when the route changes; if it is still here after 5s (slow networks need the
            // time to fetch the next page), the router ignored us, so load the page normally
            clearTimeout(fallback)
            fallback = setTimeout(() => document.visibilityState === "visible" && location.assign(path + hash), 5000)
        }
        addEventListener("message", onMsg)
        return () => {
            removeEventListener("message", onMsg)
            clearTimeout(fallback)
        }
    }, [])

    return (
        <div
            style={{
                position: "relative",
                maxWidth: "100vw",
                height: "100vh",
                background: "#FFFFFF",
                paddingTop: topOffset,
                boxSizing: "border-box",
                ...style,
                width: "100vw",
                ...(full ? { position: "fixed", inset: 0, zIndex: 2147483000, paddingTop: 0, height: "100vh" } : null),
            }}
        >
            {src ? (
                <iframe
                    ref={frame}
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

addPropertyControls(ContractPanelCase, {
    src: { type: ControlType.String, title: "Case study URL", defaultValue: "https://pranitasapkal.github.io/pranita-portfolio/contract/" },
    title: { type: ControlType.String, title: "Frame title", defaultValue: "Contract Management case study" },
    topOffset: { type: ControlType.Number, title: "Space for navbar", defaultValue: 96, min: 0, max: 200, step: 4 },
})
