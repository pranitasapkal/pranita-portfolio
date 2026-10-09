import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * Trips panel: case study page for the Framer site (copy v3, tasks/case-study-trips-copy-v3.md).
 * Theme contract taken from the project's own styles: Geist / Geist Mono / Inspiration.
 * Light page (White) like the home page; Black headings, Dark #242424 body, Grey #424242 labels.
 * Motion is one subtle fade-up per block, no scramble, no flicker.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 6000
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/transporter-panel"
const img = (n: string) => `${CDN}/${n}.png`

const C = {
    black: "#FFFFFF",       // page: the site's White, same as the home page sections
    dark: "#FFFFFF",        // cards
    grey: "#9E9E9E",        // Light Grey: index numbers, decorative only (2.8:1, never copy)
    lightGrey: "#424242",   // Grey: labels, captions, secondary copy
    offWhite: "#242424",    // Dark: body copy
    white: "#000000",       // Black: headings
    line: "rgba(0,0,0,0.12)",
    plate: "rgba(0,0,0,0.04)",
}
const SANS = '"Geist", "Inter", system-ui, sans-serif'
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, monospace'
const SCRIPT = '"Inspiration", "Geist", cursive'

// ── primitives ───────────────────────────────────────────────────────────────

function Reveal({ children, style }: any) {
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
            style={{
                opacity: on ? 1 : 0,
                transform: on ? "none" : "translateY(14px)",
                transition: "opacity .7s cubic-bezier(.65,0,.35,1), transform .7s cubic-bezier(.65,0,.35,1)",
                ...style,
            }}
        >
            {children}
        </div>
    )
}

const Label = ({ children }: any) => (
    <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.lightGrey, textTransform: "uppercase" }}>
        {children}
    </div>
)

const Rule = ({ top = 0, bottom = 0 }) => (
    <div style={{ height: 1, background: C.line, marginTop: top, marginBottom: bottom }} />
)

type Pin = { n: number; x: number; y: number }
type Crop = { x: number; y: number; w: number; h: number; ratio: number } // % of the image; ratio = natural width / height

/** Numbered marker on a screenshot. Decorative: the numbered note list beside it carries the text. */
const PinDot = ({ n, x, y }: Pin) => (
    <span
        aria-hidden="true"
        style={{
            position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
            width: 22, height: 22, borderRadius: 22, background: C.white, color: "#FFFFFF",
            border: "2px solid #FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            font: `500 11px/18px ${MONO}`, textAlign: "center",
        }}
    >
        {n}
    </span>
)

/** The image, optionally cropped to a region and carrying pins. */
function Frame({ src, alt, pins = [], crop }: { src: string; alt: string; pins?: Pin[]; crop?: Crop }) {
    if (crop) {
        const aspect = (crop.w * crop.ratio) / crop.h
        return (
            <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect), overflow: "hidden" }}>
                <img
                    src={src} alt={alt} loading="lazy"
                    style={{
                        position: "absolute", display: "block", maxWidth: "none",
                        width: `${10000 / crop.w}%`, left: `${(-100 * crop.x) / crop.w}%`, top: `${(-100 * crop.y) / crop.h}%`,
                    }}
                />
            </div>
        )
    }
    return (
        <div style={{ position: "relative" }}>
            <img src={src} alt={alt} loading="lazy" style={{ display: "block", width: "100%", height: "auto" }} />
            {pins.map((p) => <PinDot key={p.n} {...p} />)}
        </div>
    )
}

/** A screen inside a quiet macOS browser window. */
function Shot({ src, alt, url = "trips.valmo.internal", flat = false, pins, crop }: any) {
    return (
        <figure style={{ margin: 0, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, background: C.plate }}>
            {!flat && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 14px", height: 38, borderBottom: `1px solid ${C.line}` }}>
                    <div style={{ display: "flex", gap: 7 }}>
                        {[0, 1, 2].map((i) => (
                            <span key={i} style={{ width: 9, height: 9, borderRadius: 9, background: "rgba(0,0,0,0.15)" }} />
                        ))}
                    </div>
                    <div
                        style={{
                            flex: 1, maxWidth: 320, height: 22, borderRadius: 11, background: C.plate,
                            font: `400 11px/22px ${MONO}`, color: C.lightGrey, textAlign: "center", letterSpacing: "0.04em",
                        }}
                    >
                        {url}
                    </div>
                </div>
            )}
            <Frame src={src} alt={alt} pins={pins} crop={crop} />
        </figure>
    )
}

const Caption = ({ children }: any) => (
    <figcaption style={{ font: `400 13px/1.6 ${MONO}`, color: C.lightGrey, marginTop: 12, letterSpacing: "0.02em" }}>{children}</figcaption>
)

/** Section title: uppercase Geist with one word set in the script face, the site's convention. */
function Title({ pre, script, post, as = "h2" }: any) {
    const Tag = as
    return (
        <Tag style={{ margin: 0, font: `500 clamp(30px,4.4vw,54px)/1.05 ${SANS}`, letterSpacing: "-0.03em", color: C.white, textTransform: "uppercase" }}>
            {pre}
            {script && (
                <span style={{ font: `400 1.25em/0.8 ${SCRIPT}`, textTransform: "none", padding: "0 .08em" }}>{script}</span>
            )}
            {post}
        </Tag>
    )
}

const Body = ({ children, max = 640, dim = false }: any) => (
    <p style={{ margin: 0, maxWidth: max, font: `400 clamp(16px,1.25vw,19px)/1.65 ${SANS}`, color: dim ? C.lightGrey : C.offWhite }}>{children}</p>
)

function Section({ id, children, pad = "clamp(72px,9vw,140px)" }: any) {
    return (
        <section id={id} style={{ padding: `${pad} clamp(20px,5vw,80px)` }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>{children}</div>
        </section>
    )
}

/** Hairline-topped numbered rows: the list that goes with a set of pins. */
const Notes = ({ items }: { items: string[] }) => (
    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column" }}>
        {items.map((t, i) => (
            <li key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderTop: `1px solid ${C.line}` }}>
                <span
                    style={{
                        flex: "0 0 26px", height: 26, borderRadius: 26, background: C.white, color: "#FFFFFF",
                        font: `500 12px/26px ${MONO}`, textAlign: "center",
                    }}
                >
                    {i + 1}
                </span>
                <span style={{ font: `400 15px/1.6 ${SANS}`, color: C.offWhite }}>{t}</span>
            </li>
        ))}
    </ol>
)

// ── content ──────────────────────────────────────────────────────────────────

const META: [string, string][] = [
    ["Role", "Sole product designer, end to end"],
    ["Team", "1 product manager, ops-tech engineering"],
    ["Timeline", "Jun to Jul 2025"],
    ["Platform", "Desktop web panel, English + Hindi"],
    ["Status", "Live"],
]

const STATES: [string, string][] = [
    ["Pending Assignment", "Accept"],
    ["Upcoming", "Update"],
    ["In-Transit", "Raise dispute"],
    ["Completed", "Confirm"],
    ["Cancelled", "no action"],
]

const SHIPPED: { shot: string; url: string; alt: string; caption: string }[] = [
    { shot: "pending-default", url: "trips.valmo / pending", alt: "Pending Assignment tab", caption: "Trips offered to him, waiting for a truck and a driver." },
    { shot: "completed-default", url: "trips.valmo / completed", alt: "Completed trips tab", caption: "Where he agrees to what he is owed, and the payout starts." },
    { shot: "disputes-list", url: "trips.valmo / disputes", alt: "Disputes list with statuses", caption: "Every disagreement with a status he can watch, instead of a phone call." },
]

const QUESTIONS = [
    "Which of last night's trips still needs a truck?",
    "What is the ETA of this trip?",
    "Why is the vehicle number wrong again?",
    "Did Valmo even log this trip?",
    "When and how much will I be paid?",
    "Who do I call about this payment?",
    "Where do I raise a dispute about this trip?",
]

const PROBLEMS: [string, string][] = [
    ["No record", "A chat thread stops being a record at about twenty trips. He ran up to eighty a day."],
    ["No visibility", "He could not see where a truck was, or whether the trip was logged at all."],
    ["No route to money", "Earnings, confirmation and complaints all went through one phone number he happened to know."],
]

type Moment = {
    title: [string, string, string]
    tension: string
    rejected: string
    call: string
    shot: string
    url: string
    alt: string
    flat?: boolean
    pins: Pin[]
    notes: string[]
}

const MOMENTS: Moment[] = [
    {
        title: ["A grey button teaches the rule ", "better", " than an error"],
        tension: "A trip auto-rejects at placement time unless a vehicle and a driver are assigned.",
        rejected: "An Accept button that is always on and throws a validation error.",
        call: "Accept stays grey until both pickers are filled. For a literal reader, an error after the fact reads as the system breaking.",
        shot: "pending-default", url: "trips.valmo / pending", alt: "Pending Assignment: Accept disabled beside empty vehicle and driver pickers",
        pins: [{ n: 1, x: 70, y: 47.2 }, { n: 2, x: 91.8, y: 50 }, { n: 3, x: 32, y: 54.8 }, { n: 4, x: 86, y: 39.6 }],
        notes: [
            "Vehicle and Driver pickers, still empty.",
            "Accept, grey until both are set.",
            "Assign by 03:00 AM in red, with the time written out so colour never works alone.",
            "The Hindi help pill on the instruction banner.",
        ],
    },
    {
        title: ["Rejecting looked ", "free", ", so I put a price on it"],
        tension: "Reject was one click and showed no cost, so trips were dropped casually.",
        rejected: "A plain “Are you sure?”",
        call: "The three real costs, cancellation fees, ratings and lost earnings, sit above the reason field that commits the rejection.",
        shot: "reject-consequences", url: "trips.valmo / pending", alt: "Reject Trip dialog listing three costs above the reason list",
        pins: [{ n: 1, x: 58, y: 41.6 }, { n: 2, x: 54, y: 47.2 }, { n: 3, x: 46, y: 60.7 }],
        notes: ["This action cannot be undone.", "The three costs, before any input.", "Reasons named in his words."],
    },
    {
        title: ["Hindi printed where the ", "money", " is"],
        tension: "He reads English slowly and decides in Hindi, and the dispute form is where a misread costs money.",
        rejected: "A full Hindi locale switch for the panel.",
        call: "Both languages are printed permanently under all seven dispute categories. A toggle asks him to predict where he will struggle. Printing both costs only vertical space.",
        shot: "dispute-categories", url: "trips.valmo / disputes / new", alt: "Seven dispute categories, each in English with Hindi underneath",
        pins: [{ n: 1, x: 29, y: 45.7 }, { n: 2, x: 60, y: 89 }],
        notes: ["Wrong trip amount, with its Hindi line.", "Route changed, the longest Hindi line, still printed in full."],
    },
    {
        title: ["I broke my own six-column ", "rule", " on the tab that pays"],
        tension: "Six columns is the right ceiling for a table he scans, but Completed is where he checks evidence.",
        rejected: "Six columns, with the evidence one page deeper.",
        call: "Seven columns, because a time dispute can't be checked from one timestamp. Every empty cell is named too, because each unnamed blank had been a phone call.",
        shot: "completed-default", url: "trips.valmo / completed", alt: "Completed tab: four views, seven columns, Confirm and Raise Dispute per trip",
        pins: [{ n: 1, x: 67, y: 36 }, { n: 2, x: 75.8, y: 60.7 }, { n: 3, x: 89.5, y: 72.5 }, { n: 4, x: 74.7, y: 91 }],
        notes: [
            "Four views, with the rupees still waiting.",
            "Dispute Window Open till 1 Apr, written into the row.",
            "An Adhoc trip keeps both Confirm and Raise Dispute.",
            "A named empty cell: As per existing Billing Process.",
        ],
    },
    {
        title: ["The one click that ", "can't", " be undone"],
        tension: "Confirming freezes a trip for payout and dismisses any live dispute on it.",
        rejected: "Letting Confirm dismiss the dispute without a word.",
        call: "That click hits a full stop that says in plain words what he loses: the dispute, the right to raise it again, and payment on the current details.",
        shot: "confirm-active-dispute", url: "trips.valmo / completed", alt: "Confirm Trip and Dismiss Dispute dialog",
        pins: [{ n: 1, x: 34.9, y: 53 }, { n: 2, x: 65.6, y: 63.5 }],
        notes: ["What he loses, in plain words.", "Two exits: Close, or Confirm & Dismiss."],
    },
]

const WRONG: { title: string; body: string; shot: string; alt: string; crop: Crop }[] = [
    {
        title: "No GPS, said out loud",
        body: "No GPS Present is said in amber, not faked with a stale position.",
        shot: "in-transit-v2", alt: "In-Transit rows: On Time in blue, No GPS Present in amber, Live Updates column",
        crop: { x: 17.8, y: 37.6, w: 51.7, h: 23, ratio: 1.3085 },
    },
    {
        title: "A missing trip, found on paper",
        body: "The form shows two photographed challans with the Trip ID boxed, so he copies from the paper the driver already holds.",
        shot: "missing-trip-challan", alt: "Missing Trip form with two challan photos, Trip ID boxed",
        crop: { x: 18.75, y: 9.5, w: 35.6, h: 38, ratio: 1.266 },
    },
    {
        title: "Shorthand, spelled out",
        body: "STA, ATA, STD and ATD are named on the panel that uses them.",
        shot: "route-timeline", alt: "Route timeline with a note defining STA, ATA, STD and ATD",
        crop: { x: 0, y: 0, w: 50, h: 100, ratio: 2.075 },
    },
]

const WRONG_ROWS = [
    "A Trip ID that already exists is answered with the trip, not a ticket.",
    "A rejected dispute says Can be reopened till 14 Dec, instead of closing for good.",
]

const OUTCOMES = [
    "Every trip has a record he can open, not a message he has to find.",
    "A truck's position is on his screen, not at the end of a phone call.",
    "A wrong number has a form, a window and a status.",
    "Confirming on this panel is what starts his payout.",
]

// DUMMY IMPACT: replace before publish (placeholder numbers, not measured)
const IMPACT: [string, string][] = [
    ["3×", "fewer payment calls per transporter"],
    ["< 1 day", "from trip completion to confirmation"],
    ["90%", "of trips confirmed without a call"],
    ["0", "trips lost between chat and record"],
]

const NUMBERS: [string, string][] = [
    ["5", "lifecycle states"],
    ["150+", "screens"],
    ["7", "bilingual categories"],
    ["13", "dispute statuses"],
]

const REFLECTIONS: [string, string][] = [
    ["A rule for scanning is not a rule for proof.", "Six columns was right everywhere except the one tab where he checks what he is owed."],
    ["For this user, an empty cell is never neutral.", "Every blank I left unnamed came back as a phone call, so every absence got a name."],
    ["Shipping one feature at a time makes the seams honest.", "Where a contract didn't exist yet, the panel said No RFQ Linked instead of hiding the gap. That seam became the next product."],
]

// ── page ─────────────────────────────────────────────────────────────────────

const Numeral = ({ n, l }: { n: string; l: string }) => (
    <div>
        <div style={{ font: `500 clamp(30px,3.6vw,44px)/1 ${SANS}`, letterSpacing: "-0.03em", color: C.white }}>{n}</div>
        <div style={{ font: `400 12px/1.5 ${MONO}`, letterSpacing: "0.1em", color: C.lightGrey, textTransform: "uppercase", marginTop: 8 }}>{l}</div>
    </div>
)

export default function TripsPanelCase(props: any) {
    const { backLabel = "← Work", nextHref = "/contract-panel" } = props
    return (
        <div style={{ background: C.black, color: C.offWhite, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap');
                  .tp-grid{display:grid;gap:28px}
                  @media(max-width:900px){.tp-2,.tp-3,.tp-5,.tp-split{grid-template-columns:1fr!important}}`}
            </style>

            {/* 01 · cover */}
            <Section pad="clamp(96px,11vw,180px)">
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Label>[case 01] &nbsp;valmo (meesho) · 2025 · transporter-facing · live</Label>
                    <h1 style={{ margin: 0, font: `500 clamp(38px,6.4vw,86px)/1.02 ${SANS}`, letterSpacing: "-0.035em", color: C.white, textTransform: "uppercase" }}>
                        Getting truck owners paid <span style={{ font: `400 1.15em/0.8 ${SCRIPT}`, textTransform: "none" }}>without</span> a phone call
                    </h1>
                    <Body max={720}>
                        Truck owners ran up to eighty trips a day over chat threads and waited months to be paid.
                        I designed the panel that gives every trip one state, one next action and a route to the money.
                    </Body>

                    {/* 02 · metadata strip */}
                    <div className="tp-grid tp-5" style={{ gridTemplateColumns: "repeat(5,1fr)", gap: 20, marginTop: 8 }}>
                        {META.map(([k, v]) => (
                            <div key={k} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.lightGrey, textTransform: "uppercase" }}>{k}</div>
                                <div style={{ font: `400 15px/1.45 ${SANS}`, color: C.offWhite }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    <figure style={{ margin: "12px 0 0" }}>
                        <Shot src={img("in-transit-v2")} alt="In-Transit tab: live updates, vehicle and driver details, and each trip's dispute status" url="trips.valmo / in-transit" />
                        <Caption>Every truck on the road, where it is, and where its dispute stands.</Caption>
                    </figure>
                </Reveal>
            </Section>

            <Rule />

            {/* 03 · context */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[the setup]</Label>
                    <div className="tp-grid tp-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {[
                            ["Valmo books trucks.", "Meesho's logistics arm moves parcels between hubs on long-distance runs."],
                            ["The transporter owns them.", "He is never on one. He runs twenty to eighty trips a day, from a desk."],
                            ["He is paid per completed trip.", "So every trip needs a record both sides agree on."],
                        ].map(([t, d]) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ font: `500 21px/1.25 ${SANS}`, color: C.white }}>{t}</div>
                                <Body dim>{d}</Body>
                            </div>
                        ))}
                    </div>
                    <Rule top={8} />
                    <div className="tp-grid tp-3" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
                        {[
                            ["Trip", "one truck, one route, one payout."],
                            ["Placement time", "the hour the loaded truck must be at the hub."],
                            ["Challan", "the paper slip the driver carries, holding the Trip ID."],
                            ["Dispute", "his formal way of saying this amount is wrong."],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.12em", color: C.white, textTransform: "uppercase" }}>{k}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.lightGrey }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 04 · what shipped */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[what shipped]</Label>
                    <Title pre="Five tabs. Read the right-hand " script="column" post=" and you know what each one is for." />
                    <div className="tp-grid tp-5" style={{ gridTemplateColumns: "repeat(5,1fr)", gap: 20 }}>
                        {STATES.map(([s, verb]) => (
                            <div key={s} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ font: `500 15px/1.3 ${SANS}`, color: C.white }}>{s}</div>
                                <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.1em", color: C.lightGrey, textTransform: "uppercase" }}>{verb}</div>
                            </div>
                        ))}
                    </div>
                    <div className="tp-grid tp-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                        {SHIPPED.map((s) => (
                            <figure key={s.shot} style={{ margin: 0 }}>
                                <Shot src={img(s.shot)} alt={s.alt} url={s.url} />
                                <Caption>{s.caption}</Caption>
                            </figure>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 05 · the problem */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 44 }}>
                    <Label>[before]</Label>
                    <Title pre="One trip, held in " script="five" post=" places" />
                    <div className="tp-grid tp-split" style={{ gridTemplateColumns: "1.35fr 1fr", alignItems: "start", gap: 48 }}>
                        <figure style={{ margin: 0 }}>
                            <Shot src={img("before-chaos")} alt="One trip held in five places: the WhatsApp thread, the placement sheet, his spreadsheet, the email chain and finance matching by hand" flat />
                            <Caption>The chat thread, the placement sheet, his spreadsheet, the email chain, and finance matching records by hand.</Caption>
                        </figure>
                        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column" }}>
                            {QUESTIONS.map((q, i) => (
                                <li key={q} style={{ display: "flex", gap: 18, padding: "16px 0", borderTop: `1px solid ${C.line}` }}>
                                    <span style={{ font: `400 12px/1.6 ${MONO}`, color: C.grey }}>{String(i + 1).padStart(2, "0")}</span>
                                    <span style={{ font: `400 16px/1.5 ${SANS}`, color: C.offWhite }}>{q}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <blockquote style={{ margin: "24px auto", maxWidth: 860, textAlign: "center", font: `500 clamp(26px,3.4vw,44px)/1.25 ${SANS}`, letterSpacing: "-0.02em", color: C.white }}>
                        {"“I don't know when and how much I'll be paid.”"}
                        <span style={{ display: "block", marginTop: 16, font: `400 12px/1.6 ${MONO}`, letterSpacing: "0.1em", color: C.lightGrey, textTransform: "uppercase" }}>
                            a transporter, in research
                        </span>
                    </blockquote>
                    <div className="tp-grid tp-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {PROBLEMS.map(([t, d], i) => (
                            <div key={t} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 28, display: "flex", flexDirection: "column", gap: 14, background: C.plate }}>
                                <div style={{ font: `400 12px/1.4 ${MONO}`, color: C.lightGrey }}>{String(i + 1).padStart(2, "0")}</div>
                                <div style={{ font: `500 24px/1.2 ${SANS}`, letterSpacing: "-0.02em", color: C.white, textTransform: "uppercase" }}>{t}</div>
                                <Body dim>{d}</Body>
                            </div>
                        ))}
                    </div>
                    <Body max={720} dim>Nobody refused to pay him. The records just never agreed on what to pay.</Body>
                </Reveal>
            </Section>

            <Rule />

            {/* 06 · key design moments */}
            {MOMENTS.map((m, i) => (
                <Section key={m.shot + i}>
                    <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                        <Label>[moment {String(i + 1).padStart(2, "0")}]</Label>
                        <Title pre={m.title[0]} script={m.title[1]} post={m.title[2]} />
                        <div className="tp-grid tp-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                            {[
                                ["tension", m.tension],
                                ["rejected", m.rejected],
                                ["the call", m.call],
                            ].map(([k, v]) => (
                                <div key={k} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                                    <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: k === "the call" ? C.white : C.lightGrey, textTransform: "uppercase" }}>{k}</div>
                                    <div style={{ font: `400 15px/1.6 ${SANS}`, color: k === "the call" ? C.offWhite : C.lightGrey }}>{v}</div>
                                </div>
                            ))}
                        </div>
                        <div className="tp-grid tp-split" style={{ gridTemplateColumns: m.shot === "dispute-categories" ? "0.8fr 1fr" : "1.35fr 1fr", alignItems: "start", gap: 44 }}>
                            <Shot src={img(m.shot)} alt={m.alt} url={m.url} pins={m.pins} />
                            <Notes items={m.notes} />
                        </div>
                    </Reveal>
                </Section>
            ))}

            <Rule />

            {/* 07 · when the system is wrong */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[when it's wrong]</Label>
                    <Title pre="What happens when the panel " script="doesn't" post=" know" />
                    <div className="tp-grid tp-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 32, alignItems: "start" }}>
                        {WRONG.map((w) => (
                            <figure key={w.title} style={{ margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                                <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}`, background: C.plate }}>
                                    <Frame src={img(w.shot)} alt={w.alt} crop={w.crop} />
                                </div>
                                <div style={{ font: `500 17px/1.3 ${SANS}`, color: C.white }}>{w.title}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.lightGrey }}>{w.body}</div>
                            </figure>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {WRONG_ROWS.map((r) => (
                            <div key={r} style={{ padding: "18px 0", borderTop: `1px solid ${C.line}`, font: `400 16px/1.55 ${SANS}`, color: C.offWhite }}>{r}</div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 08 · impact */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[what changed for him]</Label>
                    <div className="tp-grid tp-split" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {OUTCOMES.map((o) => (
                                <div key={o} style={{ padding: "20px 0", borderTop: `1px solid ${C.line}`, font: `400 clamp(16px,1.3vw,20px)/1.55 ${SANS}`, color: C.offWhite }}>{o}</div>
                            ))}
                        </div>
                        <div className="tp-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}>
                            {IMPACT.map(([n, l]) => <Numeral key={l} n={n} l={l} />)}
                        </div>
                    </div>
                    <Rule top={8} />
                    <div className="tp-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 28 }}>
                        {NUMBERS.map(([n, l]) => <Numeral key={l} n={n} l={l} />)}
                    </div>
                </Reveal>
            </Section>

            {/* 09 · reflections */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    <Label>[what i'd tell myself]</Label>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {REFLECTIONS.map(([t, d], i) => (
                            <div key={t} className="tp-grid tp-split" style={{ gridTemplateColumns: "60px 1fr 1.2fr", gap: 24, padding: "24px 0", borderTop: `1px solid ${C.line}`, alignItems: "baseline" }}>
                                <span style={{ font: `400 12px/1.6 ${MONO}`, color: C.grey }}>{String(i + 1).padStart(2, "0")}</span>
                                <div style={{ font: `500 20px/1.3 ${SANS}`, color: C.white }}>{t}</div>
                                <div style={{ font: `400 16px/1.6 ${SANS}`, color: C.lightGrey }}>{d}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 10 · what came next */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Label>[what came next]</Label>
                    <Body max={780}>The contract layer this panel kept pointing at became its own product.</Body>
                    <a href={nextHref} style={{ font: `500 clamp(24px,3vw,40px)/1.15 ${SANS}`, letterSpacing: "-0.02em", color: C.white, textTransform: "uppercase", textDecoration: "none" }}>
                        Case 02 · Contract <span style={{ font: `400 1.2em/0.8 ${SCRIPT}`, textTransform: "none" }}>management</span> {"→"}
                    </a>
                    <Rule top={16} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "center" }}>
                        <a href="/" style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.lightGrey, textTransform: "uppercase", textDecoration: "none" }}>
                            {backLabel}
                        </a>
                        <span style={{ font: `400 12px/1.4 ${MONO}`, letterSpacing: "0.1em", color: C.lightGrey, textTransform: "uppercase" }}>
                            screens redrawn with sample data · no client data shown
                        </span>
                    </div>
                </Reveal>
            </Section>
        </div>
    )
}

addPropertyControls(TripsPanelCase, {
    backLabel: { type: ControlType.String, title: "Back label", defaultValue: "← Work" },
    nextHref: { type: ControlType.String, title: "Next case link", defaultValue: "/contract-panel" },
})
