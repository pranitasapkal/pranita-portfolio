import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * DoJoin Ride — Huntment, remote UAE, Nov 2023 – Jan 2024. Case 03.
 *
 * Rebuilt 2026-09-21 to the L2 structure in tasks/case-study-l2-structure.md:
 * label → statement → evidence, hairline-separated, a caption under every visual,
 * bullet rows instead of prose, asymmetric two-column splits, one pull-quote,
 * inventory cards for the architecture, big numerals for the outcome.
 * Theme unchanged: Geist / Geist Mono / Inspiration on white. No em dashes.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 8200
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/dojoin"
const img = (n: string) => `${CDN}/${n}.jpg`

const C = {
    page: "#FFFFFF",
    grey: "#9E9E9E",
    label: "#424242",
    body: "#242424",
    head: "#000000",
    line: "rgba(0,0,0,0.12)",
    hair: "rgba(0,0,0,0.08)",
    plate: "rgba(0,0,0,0.04)",
    shot: "#150A2C",
    live: "#3BB77E",
}
const SANS = '"Geist", "Inter", system-ui, sans-serif'
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, monospace'
const SCRIPT = '"Inspiration", "Geist", cursive'
const EASE = "cubic-bezier(.65,0,.35,1)"

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
        const io = new IntersectionObserver(
            ([e]) => e.isIntersecting && (setOn(true), io.disconnect()),
            { rootMargin: "0px 0px -12% 0px" }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: on ? 1 : 0,
                transform: on ? "none" : "translateY(14px)",
                transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

const Eyebrow = ({ children }: any) => (
    <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.16em", color: C.label, textTransform: "uppercase" }}>
        {children}
    </div>
)

const Rule = ({ top = 0, bottom = 0, strong = false }) => (
    <div style={{ height: 1, background: strong ? C.line : C.hair, marginTop: top, marginBottom: bottom }} />
)

/** The reference's signature: a statement, then hairline-separated bullet rows with a dash. */
function Rows({ items, max = 760 }: { items: string[]; max?: number }) {
    return (
        <div style={{ maxWidth: max }}>
            {items.map((t, i) => (
                <div
                    key={i}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "22px 1fr",
                        gap: 12,
                        padding: "16px 0",
                        borderTop: `1px solid ${C.hair}`,
                        alignItems: "start",
                    }}
                >
                    <span aria-hidden="true" style={{ font: `400 15px/1.6 ${MONO}`, color: C.grey }}>
                        –
                    </span>
                    <span style={{ font: `400 clamp(15px,1.15vw,17px)/1.6 ${SANS}`, color: C.body }}>{t}</span>
                </div>
            ))}
            <Rule />
        </div>
    )
}

function Title({ pre, script, post, size = "clamp(28px,3.8vw,50px)" }: any) {
    return (
        <h2
            style={{
                margin: 0,
                font: `500 ${size}/1.06 ${SANS}`,
                letterSpacing: "-0.03em",
                color: C.head,
                textTransform: "uppercase",
                maxWidth: 940,
            }}
        >
            {pre}
            {script && (
                <span style={{ font: `400 1.25em/0.8 ${SCRIPT}`, textTransform: "none", padding: "0 .08em" }}>
                    {script}
                </span>
            )}
            {post}
        </h2>
    )
}

const Body = ({ children, max = 720, dim = true }: any) => (
    <p style={{ margin: 0, maxWidth: max, font: `400 clamp(15px,1.2vw,18px)/1.65 ${SANS}`, color: dim ? C.label : C.body }}>
        {children}
    </p>
)

function Shot({ src, alt, cap, ratio = "9 / 16", max }: any) {
    return (
        <figure style={{ margin: 0, maxWidth: max || "none" }}>
            <div
                style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: `1px solid ${C.line}`,
                    background: C.shot,
                    ...(ratio ? { aspectRatio: ratio } : {}),
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    style={
                        ratio
                            ? { display: "block", width: "100%", height: "100%", objectFit: "contain" }
                            : { display: "block", width: "100%", height: "auto" }
                    }
                />
            </div>
            {cap && (
                <figcaption style={{ font: `400 12px/1.6 ${MONO}`, color: C.grey, marginTop: 10, letterSpacing: "0.02em" }}>
                    {cap}
                </figcaption>
            )}
        </figure>
    )
}

function Section({ children, pad = "clamp(64px,8vw,108px)", bottom = 0 }: any) {
    return (
        <section style={{ padding: `${pad} clamp(20px,5vw,80px) ${bottom || 0}px` }}>
            <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
                {children}
            </div>
        </section>
    )
}

// ── content ──────────────────────────────────────────────────────────────────

const META: [string, string, boolean?][] = [
    ["Role", "UI/UX Designer"],
    ["Platform", "Mobile, iOS + Android"],
    ["Status", "Shipped to handoff", true],
    ["Year", "2023 to 2024"],
]

const PROBLEM = [
    "A taxi app, a food app, a grocery app, a travel agent. Four installs, four accounts, four saved-address lists, and on a mid-range phone, four apps' worth of storage.",
    "A single outing means switching between apps and re-entering the same address in each. The planning costs more than any one booking.",
    "A pilgrimage package is visa paperwork, transfers, accommodation and border taxes. It is normally coordinated with an agent who holds the knowledge, which is exactly what an app has to replace.",
    "Older users said it plainly: every extra app holding a card and an address is another place their details can leak.",
]

const BANDS: [string, string, string][] = [
    ["01", "18 to 34", "Emily, 22, a college student juggling classes, a part-time shift and a social life. Wants cheap rides and fast food without switching apps. Named budget as the deciding factor."],
    ["02", "35 to 54", "David, 35, an IT project manager who travels for work and arranges transport, dining and shopping around client meetings. Wants efficiency, reminders and scheduling."],
    ["03", "55 plus", "Susan, 68, retired. Limited mobility makes errands hard and multiple service apps harder. Needs large readable text, simple navigation and immediate support."],
]

const METHODS: [string, string][] = [
    ["In-depth interviews", "50+ participants across the three age bands, on expectations of a multi-service app and pain points with what they already use."],
    ["Focus groups", "Run separately per age band so a 22-year-old's fluency did not drown out a 68-year-old's confusion."],
    ["Usability testing", "Task-based on the prototype: book a taxi, order food, schedule a grocery delivery. Where the navigation problems surfaced."],
    ["Ethnographic observation", "Watching people use the app inside their own day rather than inside a session."],
]

const FINDINGS = [
    "Every age band tripped on the transition between service types. Booking a taxi was fine. Going from a taxi to a grocery order inside the same app was not.",
    "Nobody asked for more services. They asked for a more streamlined layout that made the ones already there easier to find.",
    "Concern about card and personal data was significant, and concentrated in the 55 plus group, the same group the consolidation argument helps most.",
    "Real-time tracking was the one feature no demographic ranked low.",
]

/** The inventory block: everything one shell had to hold. */
const INVENTORY: [string, string[]][] = [
    ["Taxi", ["From and to", "Available cars, seats, ETA", "Ride now or book later", "Live tracking", "Payment"]],
    ["Meetings", ["From, meeting location, to", "Limousine class", "Car detail and specs", "Live tracking", "Payment"]],
    ["Umrah", ["Flight, bus or limousine", "Package tier", "What is included", "Visa requirements", "Payment"]],
    ["Food", ["Category chips", "Restaurant and dish", "Cart and suggestions", "Delivery notes and tip", "Payment and tracking"]],
    ["Groceries", ["Two levels of category", "Produce grid and stock", "Monthly list and repeat", "Delivery slot", "Payment and tracking"]],
    ["Profile", ["Order history", "Complaints", "Referral", "Settings and support", "Logout"]],
]

const SPINE: [string, string][] = [
    ["Pick a place", "Where from, where to, or in the Meetings flow, where the meeting is."],
    ["Choose an option", "Cars, packages, restaurants, produce. Always a list with a price and a rating."],
    ["Confirm and pay", "One wallet, one saved-card list, one summary, across all six services."],
    ["Track", "The same live status card, whether it is a driver or a grocery order."],
]

const VARIANTS: [string, string, string][] = [
    ["TAXI", "Two fields", "From and to. The trip is anchored to a destination."],
    ["MEETINGS", "Three fields", "From, meeting location, to. The trip is anchored to an appointment."],
    ["UMRAH", "No address at all", "Travel mode, dates and passengers. The trip is anchored to a date."],
]

const SURFACES: [string, string, string][] = [
    ["home", "Home", "Six services as one tile grid, above the offers rail."],
    ["cars", "Available cars", "Seats, transmission, distance and ETA, with Book later and Ride now."],
    ["address-meet", "Meetings address", "The three-field variant: from, meeting location, to."],
    ["track", "Live ride", "Driver, rating, pick-up, drop, fare and payment in one card."],
    ["umrah", "Umrah package", "Travel mode as tabs so the package reprices without leaving the page."],
    ["packages", "Flight search", "Date, duration and passengers, then tiers listed line by line."],
    ["food-home", "Food", "Category chips, then restaurants, discounts and new places."],
    ["grocery-home", "Groceries", "Two levels of category and a persistent track-order bar."],
]

const TRADEOFFS: [string, string, string][] = [
    [
        "One shared checkout for six services",
        "A checkout tuned per service",
        "Testing showed the confusion lived in the seams between services, not inside them. A single wallet, card list, summary and success state means the second service a person uses is already familiar.",
    ],
    [
        "A third address field only where it earns one",
        "The same from and to form everywhere",
        "The Meetings flow inserts a meeting location because the trip is anchored to an appointment. One extra field in one flow is worth more than a generic form that fits nothing well.",
    ],
    [
        "Groceries as a saved list, not a subscription plan",
        "A monthly plan the user signs up to",
        "Tick the items you always buy, set repeat, pick a slot. A habit made re-runnable rather than a tier to be sold, which is why it can be cancelled without a negotiation.",
    ],
]

const RESULTS: [string, string, string][] = [
    ["6", "Services in one shell", "Taxi, meetings, Umrah, food, groceries and profile, shipped to hi-fi handoff as one product."],
    ["50+", "People interviewed", "Across three age bands, through four research methods."],
    ["1", "Checkout, end to end", "One wallet, one live-status card and one cancellation flow serve every service."],
]

const GAPS = [
    "Placeholder content was never cleared. Restaurant and product descriptions are lorem ipsum, the Umrah FAQ answers are lorem ipsum, and the food checkout shows a Berlin address in an app priced entirely in AED.",
    "The payment sheet lists UPI with Google Pay and Apple Pay beneath it, next to Tabby. Tabby is right for the UAE. UPI is an Indian rail and does not belong in this checkout. I would cut it.",
    "There is no Arabic and no RTL layout. For a product built for the UAE that is not a nice-to-have, and the design system was not built to mirror.",
    "There is no dark mode, and the deck labels the grocery section Food delivery.",
    "No post-launch numbers. The engagement ran November 2023 to January 2024 and ended at hi-fi handoff, so what I can show is the research, the decisions and the screens, not adoption.",
]

// ── page ─────────────────────────────────────────────────────────────────────

export default function DoJoinCase(props: any) {
    const { backLabel = "Back to work", backHref = "/" } = props
    return (
        <div style={{ background: C.page, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap');
                  .dj-g{display:grid}
                  @media(max-width:1000px){.dj-2,.dj-3,.dj-4,.dj-split,.dj-splitR,.dj-meta{grid-template-columns:repeat(2,1fr)!important}}
                  @media(max-width:640px){.dj-2,.dj-3,.dj-4,.dj-split,.dj-splitR,.dj-meta{grid-template-columns:1fr!important}}`}
            </style>

            {/* 01 · hero */}
            <Section pad="clamp(40px,5vw,72px)">
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                    <a
                        href={backHref}
                        style={{ font: `400 13px/1.4 ${MONO}`, color: C.label, textDecoration: "none", letterSpacing: "0.06em" }}
                    >
                        ← {backLabel}
                    </a>
                    <Eyebrow>Huntment · DoJoin Ride · Multi-service</Eyebrow>
                    <h1
                        style={{
                            margin: 0,
                            font: `500 clamp(32px,5.2vw,70px)/1.04 ${SANS}`,
                            letterSpacing: "-0.035em",
                            color: C.head,
                            textTransform: "uppercase",
                            maxWidth: 1000,
                        }}
                    >
                        Six services in one app. The hard part was the{" "}
                        <span style={{ font: `400 1.15em/0.8 ${SCRIPT}`, textTransform: "none" }}>seams</span>
                    </h1>
                    <Body max={620}>
                        I designed a multi-service app for the UAE: taxis, limousine bookings for meetings, Umrah
                        packages, food delivery and groceries under one account and one checkout.
                    </Body>

                    <Rule top={14} strong />
                    <div className="dj-g dj-meta" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 24, paddingBottom: 6 }}>
                        {META.map(([k, v, live]) => (
                            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <span style={{ font: `400 12px/1.4 ${MONO}`, color: C.grey, letterSpacing: "0.08em" }}>{k}</span>
                                <span style={{ font: `500 15px/1.4 ${SANS}`, color: C.body, display: "flex", alignItems: "center", gap: 8 }}>
                                    {live && (
                                        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: 7, background: C.live, display: "inline-block" }} />
                                    )}
                                    {v}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Rule strong />

                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 10 }}>
                        <Shot src={img("home")} alt="DoJoin Ride home" cap="Home: six services as one tile grid." />
                        <Shot src={img("cars")} alt="Available cars for ride" cap="Every option carries seats, distance and ETA." />
                        <Shot src={img("umrah")} alt="Umrah package" cap="Travel mode as tabs, so the package reprices in place." />
                    </div>
                </Reveal>
            </Section>

            {/* 02 · the problem */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[the problem]</Eyebrow>
                    <Title pre="Four apps to plan one " script="day" />
                    <Rows items={PROBLEM} />
                    <div className="dj-g dj-split" style={{ gridTemplateColumns: "1fr 1.28fr", gap: 44, alignItems: "center", marginTop: 12 }}>
                        <Shot src={img("onboarding")} alt="Onboarding" cap="The pitch, made at install: travel, dine, meet, all in one." max={330} />
                        <Body max={520}>
                            The brief was consolidation. The objective I wrote against it was narrower:{" "}
                            <strong style={{ color: C.body }}>
                                make six unrelated service offerings feel like one product, without making any single
                                one of them worse than the standalone app it replaces.
                            </strong>{" "}
                            A super-app only wins if the second service you use is easier than the first.
                        </Body>
                    </div>
                </Reveal>
            </Section>

            {/* 03 · the pull-quote */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
                    <Body max={620} dim>
                        Across every age band, usability testing kept catching people in the same place
                    </Body>
                    <blockquote
                        style={{
                            margin: 0,
                            maxWidth: 1000,
                            font: `500 clamp(26px,3.6vw,46px)/1.15 ${SANS}`,
                            letterSpacing: "-0.03em",
                            color: C.head,
                        }}
                    >
                        “Booking a taxi was fine. Going from a taxi to a grocery order inside the same app was not.”
                    </blockquote>
                    <div style={{ font: `400 12px/1.6 ${MONO}`, color: C.grey, letterSpacing: "0.02em" }}>
                        The finding that set the whole architecture
                    </div>
                </Reveal>
            </Section>

            {/* 04 · who it is for */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[who it is for]</Eyebrow>
                    <Title pre="Three age bands with three different " script="fears" />
                    <Body max={840}>
                        The three want opposite things: personalisation, efficiency, simplicity. You cannot design
                        three homes. What they share is the complaint about switching, so that is where the design
                        effort went.
                    </Body>
                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 36, marginTop: 6 }}>
                        {BANDS.map(([n, band, what]) => (
                            <div key={n} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${C.line}`, paddingTop: 18 }}>
                                <span style={{ font: `400 12px/1.4 ${MONO}`, color: C.grey }}>{n}</span>
                                <span style={{ font: `500 clamp(22px,2.4vw,30px)/1.1 ${SANS}`, letterSpacing: "-0.02em", color: C.head }}>
                                    {band}
                                </span>
                                <span style={{ font: `400 15px/1.6 ${SANS}`, color: C.label }}>{what}</span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 05 · research */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[research]</Eyebrow>
                    <Title pre="Four methods, one recurring " script="answer" />
                    <div className="dj-g dj-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
                        {METHODS.map(([t, d], i) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
                                <span style={{ font: `400 12px/1.4 ${MONO}`, color: C.grey }}>{String(i + 1).padStart(2, "0")}</span>
                                <span style={{ font: `500 17px/1.25 ${SANS}`, color: C.head }}>{t}</span>
                                <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{d}</span>
                            </div>
                        ))}
                    </div>
                    <Eyebrow>[what came back]</Eyebrow>
                    <Rows items={FINDINGS} max={900} />
                </Reveal>
            </Section>

            {/* 06 · what the shell had to hold */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[architecture]</Eyebrow>
                    <Title pre="What one shell had to " script="hold" />
                    <Body max={860}>
                        Everyone enters the same way: onboarding, sign in, location access, home. Home is the only
                        place where the six services are equals. Below it the tree splits six ways, and the branches
                        are deliberately uneven.
                    </Body>
                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 6 }}>
                        {INVENTORY.map(([name, items]) => (
                            <div
                                key={name}
                                style={{
                                    background: C.plate,
                                    border: `1px solid ${C.hair}`,
                                    borderRadius: 12,
                                    padding: 24,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                }}
                            >
                                <div style={{ font: `500 17px/1.3 ${SANS}`, color: C.head }}>{name}</div>
                                <Rule />
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {items.map((it) => (
                                        <div key={it} style={{ display: "grid", gridTemplateColumns: "14px 1fr", gap: 8 }}>
                                            <span aria-hidden="true" style={{ font: `400 13px/1.6 ${MONO}`, color: C.grey }}>–</span>
                                            <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{it}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Rule top={20} strong />
                    <Eyebrow>[the shared spine]</Eyebrow>
                    <Body max={780}>
                        What holds it together is not the tree. It is the four steps every branch ends up walking
                        through in the same order, with the same components.
                    </Body>
                    <div className="dj-g dj-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
                        {SPINE.map(([n, d], i) => (
                            <div key={n} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `2px solid ${C.head}`, paddingTop: 16 }}>
                                <span style={{ font: `400 12px/1.4 ${MONO}`, color: C.grey }}>{String(i + 1).padStart(2, "0")}</span>
                                <span style={{ font: `500 18px/1.25 ${SANS}`, color: C.head }}>{n}</span>
                                <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{d}</span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 07 · variants */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[the decision that mattered]</Eyebrow>
                    <Title pre="Vary the form. Never vary the " script="checkout" />
                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {VARIANTS.map(([tag, t, d]) => (
                            <div key={tag} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <span style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.16em", color: C.grey }}>{tag}</span>
                                <span style={{ font: `500 21px/1.25 ${SANS}`, color: C.head }}>{t}</span>
                                <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{d}</span>
                                <Rule top={6} />
                            </div>
                        ))}
                    </div>

                    <div className="dj-g dj-splitR" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 44, alignItems: "center", marginTop: 16 }}>
                        <Body max={560}>
                            The forms differ because the trips differ. Then everything converges. One payment sheet
                            with the same wallet balance, the same saved cards, the same buy-now-pay-later row, the
                            same cash option. One order summary with VAT stated. One success screen. One live-status
                            card: the ride and the grocery order use the same component and the same four-step
                            timeline, received, being prepared, picked up, arriving.
                        </Body>
                        <Shot src={img("address-meet")} alt="Meetings address form" cap="The three-field variant, used only where it earns its place." max={330} />
                    </div>

                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 8 }}>
                        <Shot src={img("payments")} alt="The shared payment sheet" cap="One payment sheet, all six services." />
                        <Shot src={img("checkout")} alt="Food checkout" cap="Delivery preferences, notes, schedule, vouchers and tip." />
                        <Shot src={img("track")} alt="Live ride card" cap="The same live-status card a grocery order uses." />
                    </div>
                </Reveal>
            </Section>

            {/* 08 · the unhappy path */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[when it does not go to plan]</Eyebrow>
                    <Title pre="Cancellation is a form, not a " script="dead end" />
                    <div className="dj-g dj-split" style={{ gridTemplateColumns: "1fr 1.3fr", gap: 44, alignItems: "center" }}>
                        <Shot src={img("cancel")} alt="Cancellation reasons" cap="Eight reasons plus Other. Countable, not free text." max={330} />
                        <Body max={540}>
                            Rather than a free-text box, one reason list covering the eight things people actually
                            said in testing: wait time too long, driver unreachable, price not reasonable, wrong item,
                            found a better offer, wanted a different restaurant. Reasons you can count are worth more
                            to operations than sentences nobody reads.
                        </Body>
                    </div>
                </Reveal>
            </Section>

            {/* 09 · the hardest flow */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[the hardest flow]</Eyebrow>
                    <Title pre="Umrah, without the " script="agent" />
                    <div className="dj-g dj-splitR" style={{ gridTemplateColumns: "1.25fr 1fr", gap: 44, alignItems: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <Body max={560}>
                                Every other service is a transaction. Umrah is a pilgrimage with paperwork, and the
                                thing people were paying an agent for was knowing what the paperwork was.
                            </Body>
                            <Body max={560}>
                                So the package page is not a product page. Travel mode sits at the top as tabs,
                                because flight, bus and limousine change the price and nothing else. What is included
                                is a chip set, not prose: visa, pick-up and drop-off, accommodation, border taxes,
                                tour guide, Umrah at Makkah, Ziyarat at Madina, transport.
                            </Body>
                            <Body max={560}>
                                Then the part an agent would have told you on the phone gets its own block, before
                                payment: passport valid six months, visa valid three, Emirates ID front and back,
                                white-background photo, two to three working days to process, restricted
                                nationalities, and an honest advisory that long coach journeys are not comfortable for
                                pregnant travellers. Disclosure before payment is the whole credibility argument for
                                booking a pilgrimage in an app.
                            </Body>
                        </div>
                        <Shot src={img("umrah-info")} alt="Umrah important information" cap="Visa documents and restrictions, stated before payment." max={360} />
                    </div>
                </Reveal>
            </Section>

            {/* 10 · the idea worth keeping */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[the idea i would keep]</Eyebrow>
                    <Title pre="A subscription that is really a saved " script="list" />
                    <div className="dj-g dj-split" style={{ gridTemplateColumns: "1fr 1.25fr", gap: 44, alignItems: "center" }}>
                        <div className="dj-g dj-2" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <Shot src={img("monthly-list")} alt="Create monthly list" cap="Tick what you always buy." />
                            <Shot src={img("schedule")} alt="Schedule delivery" cap="Set the slot, set repeat." />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <Body max={520}>
                                Grocery subscriptions are usually sold as a tier. This one is built as a behaviour:
                                tick the things you always buy off a photo grid, switch on repeat every month, choose
                                a date and a preferred delivery time, pay. The banner promises a saving, not a
                                membership.
                            </Body>
                            <Body max={520}>
                                It matters because of who asked for it. The 55 plus group described the same short
                                list of staples every month and the same difficulty getting out to buy them. A saved
                                list they can edit is a far smaller commitment than a plan they have to cancel, and it
                                degrades gracefully. Skip a month and nothing is lost.
                            </Body>
                        </div>
                    </div>
                </Reveal>
            </Section>

            {/* 11 · the product */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[the product]</Eyebrow>
                    <Title pre="Eight surfaces, one " script="shell" />
                    <div className="dj-g dj-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
                        {SURFACES.map(([f, t, cap]) => (
                            <div key={f} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <Shot src={img(f)} alt={t} />
                                <div style={{ font: `500 15px/1.3 ${SANS}`, color: C.head }}>{t}</div>
                                <div style={{ font: `400 13px/1.6 ${SANS}`, color: C.label }}>{cap}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 12 · decisions */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[three decisions i would defend]</Eyebrow>
                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                        {TRADEOFFS.map(([d, r, w]) => (
                            <div key={d} style={{ border: `1px solid ${C.hair}`, borderRadius: 12, padding: 26, display: "flex", flexDirection: "column", gap: 10, background: C.plate }}>
                                <span style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.16em", color: C.grey, textTransform: "uppercase" }}>decision</span>
                                <span style={{ font: `500 18px/1.3 ${SANS}`, color: C.head }}>{d}</span>
                                <Rule top={8} />
                                <span style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.16em", color: C.grey, textTransform: "uppercase" }}>rejected</span>
                                <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{r}</span>
                                <span style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.16em", color: C.grey, textTransform: "uppercase", marginTop: 8 }}>why</span>
                                <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{w}</span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 13 · results */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[the outcome]</Eyebrow>
                    <div className="dj-g dj-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 36 }}>
                        {RESULTS.map(([n, l, d]) => (
                            <div key={l} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `2px solid ${C.head}`, paddingTop: 20 }}>
                                <span style={{ font: `500 clamp(48px,6vw,86px)/0.95 ${SANS}`, letterSpacing: "-0.04em", color: C.head }}>{n}</span>
                                <span style={{ font: `500 16px/1.3 ${SANS}`, color: C.body }}>{l}</span>
                                <span style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{d}</span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 14 · reflections */}
            <Section bottom={140}>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Eyebrow>[what i would fix]</Eyebrow>
                    <Rows items={GAPS} max={980} />

                    <Eyebrow>[what i learned]</Eyebrow>
                    <Body max={940} dim={false}>
                        A super-app is not six apps in a launcher. Every service you add makes the shell harder,
                        because the shell now has to be legible to someone whose only reason for opening it today is
                        the service they came for. The discipline that made this work was refusing to let any single
                        flow invent its own ending, and that habit is the one I use most in the enterprise panels I
                        design now, where the temptation to special-case a screen is constant.
                    </Body>

                    <Rule top={18} strong />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
                        <a href={backHref} style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase", textDecoration: "none" }}>
                            ← {backLabel}
                        </a>
                        <span style={{ font: `400 12px/1.4 ${MONO}`, letterSpacing: "0.1em", color: C.grey, textTransform: "uppercase" }}>
                            Huntment · UAE · 2023 to 2024
                        </span>
                    </div>
                </Reveal>
            </Section>
        </div>
    )
}

addPropertyControls(DoJoinCase, {
    backLabel: { type: ControlType.String, title: "Back label", defaultValue: "Back to work" },
    backHref: { type: ControlType.String, title: "Back href", defaultValue: "/" },
})
