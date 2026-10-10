import { useEffect, useRef, useState } from "react"
import * as Framer from "framer"
import { addPropertyControls, ControlType } from "framer"

/**
 * DoJoinCase (same code as CaseStudyFrame.tsx): shows a hosted v5 case study full-screen inside a Framer case page.
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
 * Framer's editor preview runs in a sandboxed frame that may not change the top page, and its router ignores the
 * history trick, so there the page is switched with Framer's own router (useRouter().navigate), and a "pf-section"
 * event tells RadioFooter which section to land on (the preview does not put the anchor in the URL).
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

export default function DoJoinCase(props: any) {
    const { src = "https://pranitasapkal.github.io/pranita-portfolio/multi-service/", title = "Multi-Service App case study", topOffset = 96, style } = props
    const frame = useRef<HTMLIFrameElement>(null)
    // read off the module so a Framer build without useRouter cannot break the import
    const useRouterHook: any = (Framer as any).useRouter
    const router: any = typeof useRouterHook === "function" ? useRouterHook() : null
    const routerRef = useRef<any>(router)
    routerRef.current = router
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
            if (!routeId) return
            if (/(^|\.)framer(canvas)?\.com$/.test(location.hostname)) {
                // the editor preview
                const r = routerRef.current
                if (!r || typeof r.navigate !== "function") return
                try {
                    ;(e.source as Window).postMessage({ type: "pf-nav-ok" }, "*")
                } catch (_) {}
                going = true
                const id = decodeURIComponent(hash.slice(1))
                r.navigate(routeId, id || undefined)
                if (id) setTimeout(() => dispatchEvent(new CustomEvent("pf-section", { detail: id })), 50)
                // this component unmounts on the route change; if it is still here, let a later click try again
                setTimeout(() => (going = false), 3000)
                return
            }
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

addPropertyControls(DoJoinCase, {
    src: { type: ControlType.String, title: "Case study URL", defaultValue: "https://pranitasapkal.github.io/pranita-portfolio/multi-service/" },
    title: { type: ControlType.String, title: "Frame title", defaultValue: "Multi-Service App case study" },
    topOffset: { type: ControlType.Number, title: "Space for navbar", defaultValue: 96, min: 0, max: 200, step: 4 },
})
