import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * Contract Management — case 02 in the site sequence (Placement · Contract · DoJoin · Rooted).
 * Same theme contract as TripsPanelCase: Geist / Geist Mono / Inspiration, light page,
 * Black headings, Dark #242424 body, Grey #424242 labels, Light Grey for numerals only.
 * Motion is one IntersectionObserver fade-up per block, off under prefers-reduced-motion.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 6000
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/contract-panel"
const img = (n: string) => `${CDN}/${n}.png`

const C = {
    page: "#FFFFFF",
    grey: "#9E9E9E", // Light Grey — decorative numerals only, 2.8:1 on white
    label: "#424242", // Grey — labels, captions, secondary copy
    body: "#242424", // Dark — body copy
    head: "#000000", // Black — headings
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
                transition:
                    "opacity .7s cubic-bezier(.65,0,.35,1), transform .7s cubic-bezier(.65,0,.35,1)",
                ...style,
            }}
        >
            {children}
        </div>
    )
}

const Label = ({ children }: any) => (
    <div
        style={{
            font: `500 12px/1.4 ${MONO}`,
            letterSpacing: "0.14em",
            color: C.label,
            textTransform: "uppercase",
        }}
    >
        {children}
    </div>
)

const Rule = ({ top = 0, bottom = 0 }) => (
    <div style={{ height: 1, background: C.line, marginTop: top, marginBottom: bottom }} />
)

/** A screen inside a quiet macOS browser window. */
function Shot({ src, alt, url = "contracts.valmo", flat = false }: any) {
    return (
        <figure
            style={{
                margin: 0,
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${C.line}`,
                background: C.plate,
            }}
        >
            {!flat && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "0 14px",
                        height: 38,
                        borderBottom: `1px solid ${C.line}`,
                    }}
                >
                    <div style={{ display: "flex", gap: 7 }}>
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: 9,
                                    background: "rgba(0,0,0,0.15)",
                                }}
                            />
                        ))}
                    </div>
                    <div
                        style={{
                            flex: 1,
                            maxWidth: 320,
                            height: 22,
                            borderRadius: 11,
                            background: C.plate,
                            font: `400 11px/22px ${MONO}`,
                            color: C.label,
                            textAlign: "center",
                            letterSpacing: "0.04em",
                        }}
                    >
                        {url}
                    </div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                style={{ display: "block", width: "100%", height: "auto" }}
            />
        </figure>
    )
}

const Caption = ({ children }: any) => (
    <figcaption
        style={{
            font: `400 13px/1.6 ${MONO}`,
            color: C.label,
            marginTop: 12,
            letterSpacing: "0.02em",
        }}
    >
        {children}
    </figcaption>
)

function Title({ pre, script, post }: any) {
    return (
        <h2
            style={{
                margin: 0,
                font: `500 clamp(30px,4.4vw,54px)/1.05 ${SANS}`,
                letterSpacing: "-0.03em",
                color: C.head,
                textTransform: "uppercase",
            }}
        >
            {pre}
            {script && (
                <span
                    style={{
                        font: `400 1.25em/0.8 ${SCRIPT}`,
                        textTransform: "none",
                        padding: "0 .08em",
                    }}
                >
                    {script}
                </span>
            )}
            {post}
        </h2>
    )
}

const Body = ({ children, max = 640, dim = false }: any) => (
    <p
        style={{
            margin: 0,
            maxWidth: max,
            font: `400 clamp(16px,1.25vw,19px)/1.65 ${SANS}`,
            color: dim ? C.label : C.body,
        }}
    >
        {children}
    </p>
)

function Section({ id, children, pad = "clamp(72px,9vw,140px)" }: any) {
    return (
        <section id={id} style={{ padding: `${pad} clamp(20px,5vw,80px)` }}>
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 40,
                }}
            >
                {children}
            </div>
        </section>
    )
}

// ── content ──────────────────────────────────────────────────────────────────

const SETUP: [string, string][] = [
    [
        "Valmo hires trucks by the month.",
        "Meesho's logistics arm buys a route for a period, not for a single run.",
    ],
    [
        "The transporter owns the trucks.",
        "He signs 15 to 70 of these a month, mostly arriving in one batch, from a desk.",
    ],
    [
        "A contract is a promise, then it is trips.",
        "One contract becomes twenty-odd runs, and he is paid per completed run.",
    ],
]

const GLOSSARY: [string, string][] = [
    ["Contract", "one route, one vehicle size, one period, one rate per trip."],
    ["Placement time", "the hour the loaded truck must be at the origin hub, every day of the contract."],
    ["Node", "a hub on the route. A six-node contract stops five times before it unloads."],
    ["NLH / RLH", "national linehaul, long and multi-vehicle; regional linehaul, short and single vehicle."],
    ["Dispute", "his formal way of saying this rate, this vehicle or this route is not what we agreed."],
]

const BEFORE: [string, string][] = [
    [
        "Acceptance happened off-system.",
        "Contracts arrived over chat or email. No record of who agreed to what, no deadline in view, no way to mark what still needed a reply.",
    ],
    [
        "Vehicle and driver were assigned verbally.",
        "By the time the truck ran, nobody could say which vehicle was actually placed against which contract.",
    ],
    [
        "Disagreements surfaced at billing, not at signing.",
        "A wrong rate, a wrong vehicle size, an added stop — all of it arrived weeks later, as a phone call.",
    ],
    [
        "Nothing showed what was live, ending, or slipping.",
        "He found out he was under-performing when Valmo told him, and by then it was a penalty conversation.",
    ],
]

const PROCESS: [string, string][] = [
    ["Named the four stages", "Pending, Upcoming, Active, Closed — and gave each exactly one thing to do."],
    ["Wrote the row before the screen", "What he has to be able to read without opening anything."],
    ["Designed the two exits first", "Rejecting and ending early, because those are the ones that cost money."],
    ["Built the dispute as a form", "Seven named reasons, each carrying the field that proves it."],
    ["Reviewed it against the persona", "Colour plus label, icon plus text, an All view that never disappears."],
]

const STAGES: [string, string][] = [
    ["Pending", "Accept or reject"],
    ["Upcoming", "View details"],
    ["Active", "Raise dispute, or end early"],
    ["Closed", "Read only"],
]

const SCREENS: {
    n: string
    title: string
    shot: string
    url: string
    caption: string
    why: string[]
    extras?: { shot: string; cap: string }[]
}[] = [
    {
        n: "01",
        title: "Pending — urgency by deadline, not arrival",
        shot: "pending",
        url: "contracts.valmo / pending",
        caption:
            "Contracts arrive in one monthly batch, so “new” tells him nothing. “Accept by 3hrs” tells him everything. Every row carries its own deadline.",
        why: [
            "The deadline is text first: Accept by 3hrs in red, Accept by Tomorrow in amber, Accept by 24 Apr in grey. Colour is the second signal, never the only one.",
            "A reminder is a row, not a badge — Reminded 2h ago sits under the contract ID, and the bell groups them into one list of contracts still waiting.",
            "The terms are printed above the checkbox: five plain sentences, including no rejection within seven days of the start date, with the full document still linked.",
            "The route expands into twelve numbered stops with copyable coordinates, because he can check a map but not a node code.",
        ],
        extras: [
            {
                shot: "accept-modal",
                cap: "Accepting: five plain terms above the checkbox, and the route opened into numbered stops with coordinates he can copy into Maps.",
            },
            { shot: "reminders", cap: "The bell collects the ones still waiting: three reminders to accept contracts, with one way in." },
        ],
    },
    {
        n: "02",
        title: "Reject — where a refusal becomes a price",
        shot: "counter-offer",
        url: "contracts.valmo / pending · reject",
        caption:
            "Rejecting used to end the conversation. Here it opens with what refusing costs him, and if the reason is the rate, it asks what rate he would take.",
        why: [
            "The money comes before the reason field — potential earning loss, total and per trip, sits above the dropdown that commits the decision.",
            "Four reasons, in his words: rate not acceptable, I don't have this vehicle size available, I can't serve entire contract period, other.",
            "Only “rate not acceptable” opens a second field. Enter your rate, and if it is accepted the contract is resent to sign. The other three stay one tap.",
            "The refusal is undoable: a toast carries Undo Action, and undoing an acceptance says in words that the contract is back in Pending.",
        ],
        extras: [
            { shot: "reject-reasons", cap: "Four reasons, written the way he would say them." },
            { shot: "undo-toast", cap: "And the decision is undoable from the toast that reports it." },
        ],
    },
    {
        n: "03",
        title: "Active — the contract argues back",
        shot: "revised-rate",
        url: "contracts.valmo / active · under dispute",
        caption:
            "His counter-offer comes back as a third number. The panel shows all three, names who moved, and states in one line what happens if he does nothing.",
        why: [
            "Three rates on one card — the old rate, the rate he asked for, and the rate Valmo will pay, with Valmo's one-line reason printed beside it.",
            "Doing nothing is a documented option: if you don't accept, your current rate stays and trips keep running. The default is spelled out, not implied.",
            "The row shows the negotiation before you open it — old rate struck through, new rate under it, and an amber line saying a decision is waiting.",
            "Accepting mints a new contract from a stated date, so the old row keeps the history and the new row carries the money.",
        ],
        extras: [
            {
                shot: "active",
                cap: "The row before you open it: the old rate struck through, the new one under it, and an amber line saying a decision is waiting.",
            },
        ],
    },
    {
        n: "04",
        title: "The dispute builder — a claim is two numbers",
        shot: "dispute-builder",
        url: "contracts.valmo / disputes",
        caption:
            "A dispute used to be a description. Here it is a comparison: what the system believes on the left, locked, and what actually happened on the right.",
        why: [
            "Seven reasons with Hindi printed under every one, permanently. A language toggle would ask him to predict in advance where he is going to struggle.",
            "Pick the issues and the form builds itself — each reason opens its own pair of fields: current rate against expected, scheduled arrival against actual, planned route against the one driven.",
            "The left side is never editable, so a claim is always a difference and never a retyping of what the system already knows.",
            "One checkbox turns “this trip was underpaid” into “change the contract rate from here on”, with the limit stated: past trips still need their own dispute.",
            "A wrong contract ID fails in place — no contract found, check the ID and try again — under the field, before anything is submitted.",
        ],
        extras: [
            { shot: "dispute-lookup", cap: "The ID is checked before the form opens, and the right-hand pane says what it is waiting for." },
            { shot: "l2-dispute", cap: "Once raised, the dispute sits on the contract with a status, a document and a resolution window." },
        ],
    },
]

const DECISIONS: [string, string, string][] = [
    [
        "A rate rejection captures a counter-price",
        "A plain reason list, the same for every reason",
        "“Rate not acceptable” ends the conversation; a number restarts it. The field appears only for that one reason, so the other three stay a single tap.",
    ],
    [
        "The terms are printed above the checkbox",
        "A checkbox beside a link to the full document",
        "A reader who ticks a box next to a link has agreed to nothing he has read. Five plain sentences on the same screen is something he can be held to — and the full document is still one click away.",
    ],
    [
        "A replaced contract links to its replacement",
        "One mutable row that quietly updates its own rate",
        "Renegotiation makes two contracts. Continued as, in Closed, and Reissued from, in Active, keep both rows and the fact that they are one deal. A row that rewrites itself erases the history the dispute existed to create.",
    ],
]

const PATTERNS: [string, string, string][] = [
    [
        "Colour never carries it alone",
        "Every deadline is written before it is coloured.",
        "pattern-deadline",
    ],
    [
        "A refusal is a counter-offer",
        "Say the rate is wrong and the form asks for your rate.",
        "pattern-counter",
    ],
    [
        "The money comes before the field that commits it",
        "Rejecting and ending early both open with the loss.",
        "pattern-priced",
    ],
    [
        "A claim is two numbers, side by side",
        "The system's value, locked. What happened, editable.",
        "pattern-evidence",
    ],
    [
        "Hindi is printed, not toggled",
        "Seven reasons in both languages, and a हिंदी में जानकारी button on every risky modal.",
        "pattern-hindi",
    ],
    [
        "An action you can undo needs no warning",
        "The toast carries the undo.",
        "pattern-undo",
    ],
]

const OUTCOMES = [
    "A contract is a row he can open, not a message he has to find.",
    "A deadline is on the row, in words and in colour, before it becomes a penalty.",
    "Saying no has a price he can see and a number he can name.",
    "Every contract shows the trips it turned into, and the ones that went missing.",
]

const NUMBERS: [string, string][] = [
    ["4", "lifecycle stages"],
    ["73", "screens"],
    ["12", "named flows"],
    ["7", "bilingual reasons"],
]

const FIXES = [
    "The counts don't reconcile — the alert strip, the tab and the chip can each report a different number for the same set of contracts.",
    "Rejecting a contract and ending one early share a single reason list, though they are different decisions taken months apart at different costs.",
    "Performance is the thing he gets penalised on, and it still is not on this panel. The copy for it exists in the file, switched off.",
]

const NEXT = [
    "Turnaround time and on-time placement on the contract, written as a warning with a remedy rather than a badge.",
    "A terminate-before-start path, distinct from rejecting a contract he never accepted.",
    "Loading and error states to match the empty ones, which are already designed.",
]

// ── page ─────────────────────────────────────────────────────────────────────

export default function ContractPanelCase(props: any) {
    const { backLabel = "← Work" } = props
    return (
        <div
            style={{
                background: C.page,
                color: C.body,
                width: "100%",
                fontFamily: SANS,
                WebkitFontSmoothing: "antialiased",
            }}
        >
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap');
                  .cp-grid{display:grid;gap:28px}
                  @media(max-width:900px){.cp-2,.cp-3,.cp-4,.cp-5,.cp-split{grid-template-columns:1fr!important}}`}
            </style>

            {/* 01 · hero */}
            <Section pad="clamp(96px,11vw,180px)">
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Label>[case 02] &nbsp;valmo (meesho) · transporter-facing · desktop panel</Label>
                    <h1
                        style={{
                            margin: 0,
                            font: `500 clamp(36px,6vw,80px)/1.02 ${SANS}`,
                            letterSpacing: "-0.035em",
                            color: C.head,
                            textTransform: "uppercase",
                        }}
                    >
                        Contracts ran on WhatsApp, paper{" "}
                        <span style={{ font: `400 1.15em/0.8 ${SCRIPT}`, textTransform: "none" }}>
                            and
                        </span>{" "}
                        memory
                    </h1>
                    <Body max={760}>
                        A transporter takes 15 to 70 contracts a month, mostly in one batch, and there was no
                        single place to accept one, track it, or argue with it. I designed the desk where all
                        four happen — and where saying no comes with a number.
                    </Body>
                    <div style={{ marginTop: 12 }}>
                        <Shot
                            src={img("pending")}
                            alt="Pending contracts, each row carrying its own deadline"
                            url="contracts.valmo / pending"
                        />
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 02 · setup */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[the setup]</Label>
                    <div className="cp-grid cp-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {SETUP.map(([t, d]) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ font: `500 21px/1.25 ${SANS}`, color: C.head }}>{t}</div>
                                <Body dim>{d}</Body>
                            </div>
                        ))}
                    </div>
                    <Rule top={8} />
                    <div
                        className="cp-grid"
                        style={{
                            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
                            gap: 24,
                        }}
                    >
                        {GLOSSARY.map(([k, v]) => (
                            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <div
                                    style={{
                                        font: `500 12px/1.4 ${MONO}`,
                                        letterSpacing: "0.12em",
                                        color: C.head,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {k}
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 03 · before */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 44 }}>
                    <Label>[before]</Label>
                    <Title pre="Four ways a contract went " script="missing" />
                    <div
                        className="cp-grid cp-split"
                        style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start", gap: 48 }}
                    >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {BEFORE.map(([t, d], i) => (
                                <div
                                    key={t}
                                    style={{
                                        display: "flex",
                                        gap: 18,
                                        padding: "20px 0",
                                        borderTop: `1px solid ${C.line}`,
                                    }}
                                >
                                    <span style={{ font: `400 12px/1.7 ${MONO}`, color: C.grey }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <span style={{ font: `500 17px/1.35 ${SANS}`, color: C.head }}>
                                            {t}
                                        </span>
                                        <span style={{ font: `400 15px/1.6 ${SANS}`, color: C.label }}>
                                            {d}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <Shot
                                src={img("empty-pending")}
                                alt="The Pending tab with nothing waiting: All caught up"
                                url="contracts.valmo / pending · empty"
                            />
                            <Caption>
                                The state the old process could never show him: nothing is waiting. A
                                zero-activity day is designed, not left blank.
                            </Caption>
                        </div>
                    </div>
                    <blockquote
                        style={{
                            margin: 0,
                            maxWidth: 860,
                            font: `500 clamp(21px,2.4vw,32px)/1.32 ${SANS}`,
                            letterSpacing: "-0.02em",
                            color: C.head,
                        }}
                    >
                        Net cost: missed deadlines, payout disputes, and a relationship maintained by phone
                        call.
                    </blockquote>
                </Reveal>
            </Section>

            <Rule />

            {/* 04 · objective + role + process */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[objective]</Label>
                    <Title pre="One desk for the whole contract " script="lifecycle" />
                    <Body max={780} dim>
                        A desktop panel a low-literacy transporter can run his month from: no chat thread, no
                        spreadsheet, no call to ops. Four stages in order, one primary action per row, and
                        every risky screen printed in Hindi as well as English.
                    </Body>
                    <Rule top={12} />
                    <Label>[role]</Label>
                    <Body max={800}>
                        Product designer, end to end: information architecture, all four lifecycle stages, the
                        accept, reject, dispute and termination flows, the empty and error states, and the
                        design review. Built with a product manager and the ops-tech engineering team.
                    </Body>
                    <div className="cp-grid cp-5" style={{ gridTemplateColumns: "repeat(5,1fr)", gap: 24 }}>
                        {PROCESS.map(([t, d], i) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <span
                                    style={{ width: 8, height: 8, borderRadius: 8, background: C.head }}
                                />
                                <div style={{ font: `400 12px/1.4 ${MONO}`, color: C.label }}>
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div style={{ font: `500 17px/1.25 ${SANS}`, color: C.head }}>{t}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{d}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 05 · lifecycle */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[four stages · one action each]</Label>
                    <Title pre="Read the action column and you know which " script="stage" post=" you're in" />
                    <div className="cp-grid cp-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
                        {STAGES.map(([s, verb]) => (
                            <div
                                key={s}
                                style={{
                                    borderTop: `1px solid ${C.line}`,
                                    paddingTop: 16,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <div style={{ font: `500 15px/1.3 ${SANS}`, color: C.head }}>{s}</div>
                                <div
                                    style={{
                                        font: `500 12px/1.4 ${MONO}`,
                                        letterSpacing: "0.1em",
                                        color: C.label,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {verb}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Body max={800} dim>
                        A contract is only ever in one stage, and each stage offers exactly one filled button.
                        Closed offers none — it is the archive he checks before signing the next contract on
                        the same route.
                    </Body>
                    <div>
                        <Shot
                            src={img("closed")}
                            alt="The Closed archive, every row named by who ended it"
                            url="contracts.valmo / closed"
                        />
                        <Caption>
                            Closed states are named by who did it — Completed, Rejected, No Response, Cancelled
                            by Valmo, Ended early by You, Ended early by Valmo — and a renegotiated contract
                            links to the one that replaced it.
                        </Caption>
                    </div>
                    <div>
                        <Shot
                            src={img("ending-early")}
                            alt="Ending Early: contracts stay active for 24 hours before moving to Closed"
                            url="contracts.valmo / active · ending early"
                        />
                        <Caption>
                            Ending early is a view of its own, and it states the wind-down: after termination
                            these contracts stay active for 24 hours so the trips already booked can run.
                        </Caption>
                    </div>
                </Reveal>
            </Section>

            {/* 06 · key screens */}
            {SCREENS.map((s) => (
                <Section key={s.n}>
                    <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                        <Label>[key screen · {s.n}]</Label>
                        <Title pre={s.title} />
                        <Body max={800} dim>
                            {s.caption}
                        </Body>
                        <div
                            className="cp-grid cp-split"
                            style={{ gridTemplateColumns: "1.35fr 1fr", alignItems: "start", gap: 44 }}
                        >
                            <Shot src={img(s.shot)} alt={s.title} url={s.url} />
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {s.why.map((w, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            gap: 16,
                                            padding: "18px 0",
                                            borderTop: `1px solid ${C.line}`,
                                        }}
                                    >
                                        <span
                                            style={{
                                                flex: "0 0 26px",
                                                height: 26,
                                                borderRadius: 26,
                                                border: `1px solid ${C.line}`,
                                                font: `500 12px/24px ${MONO}`,
                                                color: C.body,
                                                textAlign: "center",
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <span style={{ font: `400 15px/1.6 ${SANS}`, color: C.body }}>
                                            {w}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {s.extras && (
                            <div
                                className="cp-grid cp-2"
                                style={{ gridTemplateColumns: `repeat(${s.extras.length},1fr)`, gap: 32, marginTop: 4 }}
                            >
                                {s.extras.map((e) => (
                                    <div key={e.shot}>
                                        <Shot src={img(e.shot)} alt={e.cap} url={s.url} />
                                        <Caption>{e.cap}</Caption>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Reveal>
                </Section>
            ))}

            <Rule />

            {/* 07 · decisions */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[three calls i'd defend]</Label>
                    <div className="cp-grid cp-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {DECISIONS.map(([d, r, w]) => (
                            <div
                                key={d}
                                style={{
                                    border: `1px solid ${C.line}`,
                                    borderRadius: 14,
                                    padding: 28,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    background: C.plate,
                                }}
                            >
                                <div
                                    style={{
                                        font: `500 11px/1.4 ${MONO}`,
                                        letterSpacing: "0.14em",
                                        color: C.label,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    decision
                                </div>
                                <div style={{ font: `500 19px/1.3 ${SANS}`, color: C.head }}>{d}</div>
                                <div
                                    style={{
                                        font: `500 11px/1.4 ${MONO}`,
                                        letterSpacing: "0.14em",
                                        color: C.label,
                                        textTransform: "uppercase",
                                        marginTop: 14,
                                    }}
                                >
                                    rejected
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{r}</div>
                                <div
                                    style={{
                                        font: `500 11px/1.4 ${MONO}`,
                                        letterSpacing: "0.14em",
                                        color: C.body,
                                        textTransform: "uppercase",
                                        marginTop: 14,
                                    }}
                                >
                                    why
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{w}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 08 · patterns */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[built for low literacy, high stakes]</Label>
                    <div className="cp-grid cp-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
                        {PATTERNS.map(([t, d, shot]) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <div
                                    style={{
                                        borderRadius: 12,
                                        overflow: "hidden",
                                        border: `1px solid ${C.line}`,
                                        background: C.plate,
                                        aspectRatio: "16 / 10",
                                    }}
                                >
                                    <img
                                        src={img(shot)}
                                        alt={t}
                                        loading="lazy"
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}
                                    />
                                </div>
                                <div style={{ font: `500 17px/1.3 ${SANS}`, color: C.head }}>{t}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{d}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 09 · the join */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[the join]</Label>
                    <Title pre="A contract is not the work — the " script="trips" post=" are" />
                    <div
                        className="cp-grid cp-split"
                        style={{ gridTemplateColumns: "1.35fr 1fr", alignItems: "start", gap: 44 }}
                    >
                        <Shot
                            src={img("l2-contract")}
                            alt="A single contract, showing the trips it turned into"
                            url="contracts.valmo / contract detail"
                        />
                        <Body dim>
                            Open a contract and it shows the trips it turned into: eighteen of twenty-one done,
                            two upcoming, one missed on a placement failure. Each trip ID opens in the trips
                            panel — the surface from the placement panel.
                        </Body>
                    </div>
                </Reveal>
            </Section>

            {/* 10 · outcome */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[what changed for him]</Label>
                    <div
                        className="cp-grid cp-split"
                        style={{ gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "start" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {OUTCOMES.map((o) => (
                                <div
                                    key={o}
                                    style={{
                                        padding: "20px 0",
                                        borderTop: `1px solid ${C.line}`,
                                        font: `400 clamp(16px,1.3vw,20px)/1.55 ${SANS}`,
                                        color: C.body,
                                    }}
                                >
                                    {o}
                                </div>
                            ))}
                        </div>
                        <div className="cp-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}>
                            {NUMBERS.map(([n, l]) => (
                                <div key={l}>
                                    <div
                                        style={{
                                            font: `500 clamp(30px,3.6vw,44px)/1 ${SANS}`,
                                            letterSpacing: "-0.03em",
                                            color: C.head,
                                        }}
                                    >
                                        {n}
                                    </div>
                                    <div
                                        style={{
                                            font: `400 12px/1.5 ${MONO}`,
                                            letterSpacing: "0.1em",
                                            color: C.label,
                                            textTransform: "uppercase",
                                            marginTop: 8,
                                        }}
                                    >
                                        {l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Rule top={16} />

                    <div
                        className="cp-grid cp-split"
                        style={{ gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <Label>[what i'd fix before i'd call it done]</Label>
                            {FIXES.map((f) => (
                                <div
                                    key={f}
                                    style={{ font: `400 15px/1.65 ${SANS}`, color: C.body }}
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <Label>[next]</Label>
                            {NEXT.map((f) => (
                                <div
                                    key={f}
                                    style={{ font: `400 15px/1.65 ${SANS}`, color: C.label }}
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Rule top={16} />

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 28,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <a
                            href="/"
                            style={{
                                font: `500 12px/1.4 ${MONO}`,
                                letterSpacing: "0.14em",
                                color: C.label,
                                textTransform: "uppercase",
                                textDecoration: "none",
                            }}
                        >
                            {backLabel}
                        </a>
                        <span
                            style={{
                                font: `400 12px/1.4 ${MONO}`,
                                letterSpacing: "0.1em",
                                color: C.label,
                                textTransform: "uppercase",
                            }}
                        >
                            screens carry sample data · no client data shown
                        </span>
                    </div>
                </Reveal>
            </Section>
        </div>
    )
}

addPropertyControls(ContractPanelCase, {
    backLabel: { type: ControlType.String, title: "Back label", defaultValue: "← Work" },
})
