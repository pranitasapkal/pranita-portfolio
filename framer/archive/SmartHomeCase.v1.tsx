import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * AURA Smart Home — UI/UX Designer at AuraSmart, 2023.
 * Written out in the same block format as the Valmo cases: the research, personas, journey,
 * teardown, IA and style guide are TEXT, not pasted boards. Only real product screens are images.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 6000
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

const CDN =
    "https://cdn.jsdelivr.net/gh/pranitasapkal/pranita-portfolio@public-main/public/work/smart-home"
const img = (n: string) => `${CDN}/${n}.png`

const C = {
    page: "#FFFFFF",
    grey: "#9E9E9E",
    label: "#424242",
    body: "#242424",
    head: "#000000",
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
    <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase" }}>
        {children}
    </div>
)

const Rule = ({ top = 0, bottom = 0 }) => (
    <div style={{ height: 1, background: C.line, marginTop: top, marginBottom: bottom }} />
)

function Shot({ src, alt, cap }: any) {
    return (
        <figure style={{ margin: 0 }}>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, background: C.plate }}>
                <img src={src} alt={alt} loading="lazy" style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            {cap && (
                <figcaption style={{ font: `400 13px/1.6 ${MONO}`, color: C.label, marginTop: 12, letterSpacing: "0.02em" }}>
                    {cap}
                </figcaption>
            )}
        </figure>
    )
}

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
                <span style={{ font: `400 1.25em/0.8 ${SCRIPT}`, textTransform: "none", padding: "0 .08em" }}>
                    {script}
                </span>
            )}
            {post}
        </h2>
    )
}

const Body = ({ children, max = 640, dim = false }: any) => (
    <p style={{ margin: 0, maxWidth: max, font: `400 clamp(16px,1.25vw,19px)/1.65 ${SANS}`, color: dim ? C.label : C.body }}>
        {children}
    </p>
)

function Section({ children, pad = "clamp(72px,9vw,140px)" }: any) {
    return (
        <section style={{ padding: `${pad} clamp(20px,5vw,80px)` }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
                {children}
            </div>
        </section>
    )
}

/** A numbered list with hairline separators — the case-study callout pattern. */
function Numbered({ items }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((w: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "18px 0", borderTop: `1px solid ${C.line}` }}>
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
                    <span style={{ font: `400 15px/1.6 ${SANS}`, color: C.body }}>{w}</span>
                </div>
            ))}
        </div>
    )
}

/** A bordered card with a mono kicker. */
function Card({ kicker, title, children }: any) {
    return (
        <div
            style={{
                border: `1px solid ${C.line}`,
                borderRadius: 14,
                padding: 26,
                background: C.plate,
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >
            {kicker && (
                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase" }}>
                    {kicker}
                </div>
            )}
            {title && <div style={{ font: `500 18px/1.3 ${SANS}`, color: C.head }}>{title}</div>}
            {children}
        </div>
    )
}

const Bullets = ({ items, color = C.label }: any) => (
    <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((t: string) => (
            <li key={t} style={{ font: `400 14px/1.6 ${SANS}`, color }}>
                {t}
            </li>
        ))}
    </ul>
)

// ── content ──────────────────────────────────────────────────────────────────

const SETUP: [string, string][] = [
    [
        "A smart home is a pile of apps.",
        "Lights in one, the camera in another, the thermostat in a third — each with its own idea of where things live.",
    ],
    [
        "The remote control is the product.",
        "Nobody wants to browse their house. They want the one switch they always reach for, now.",
    ],
    [
        "I owned it end to end.",
        "I designed it end to end at AuraSmart: research, flows, the screens and the design system.",
    ],
]

const AIM = [
    "An intuitive mobile app for home automation, not a second remote control.",
    "One app across smart lights, thermostats, security cameras and door locks.",
    "Control and monitor several devices remotely, at once.",
    "Real-time device state — what the device is doing, not what the app last remembered.",
    "Schedules and routines the person sets themselves.",
    "Analytics on energy use and device activity.",
]

const QUOTES = [
    "I find it challenging to understand and navigate the app's features and settings.",
    "Can't figure how to add multiple devices — the process is exhausting.",
    "Unable to control multiple devices at a time.",
    "I want a level of control over appliances while at home or away from home.",
]

const SURVEY: [string, string][] = [
    ["How often is it used?", "Multiple times a day was the clear winner — this is a daily-driver surface, not an occasional one."],
    ["What do people automate?", "Lighting first, security and surveillance second, thermostat third, entertainment fourth."],
    ["What do they control it with?", "Smartphones, by a distance. Smart speakers second. Dedicated panels and tablets barely register."],
    ["Does the interface matter?", "Very important or important for almost everyone. Almost nobody was neutral."],
]

const PERSONAS = [
    {
        name: "Rohan Raj",
        meta: "36 · married · businessman · likes video games, art, gadgets",
        bio: "Runs a tech company based in the US. Works remotely and barely goes out, so he spends most of his time at his workspace. Owns a lot of electronic gadgets and lives in an urban apartment.",
        pains: [
            "The application background is distracting",
            "Can't keep track of energy usage of electrical appliances",
            "Adding a device is exhausting",
        ],
        goals: [
            "Turn appliances on and off conveniently",
            "Keep track of energy usage across all devices",
            "Efficient control of devices",
        ],
    },
    {
        name: "Kalika Kapoor",
        meta: "30 · married · digital artist · likes travel, art, books",
        bio: "A digital artist working freelance and for a local art company. Uses electronic gadgets to get through her day and spends a lot of time at her computer when she isn't outside.",
        pains: [
            "Forgets to turn off lights and appliances when leaving home",
            "High energy bills from wastage",
            "Fear of burglaries and thefts",
            "Difficulty learning and using new technology",
        ],
        goals: [
            "Control home devices and appliances conveniently",
            "Save energy and reduce utility bills",
            "Enhance home security and keep the family safe",
            "Automate the daily routine",
        ],
    },
]

const JOURNEY: [string, string, string, string][] = [
    ["System installation", "Choosing the right brand", "Less info on connection", "Quickly setup the app"],
    ["Setting up", "Customise the app for yourself", "Complicated UI", "Multiple logins"],
    ["Connect devices", "Synchronise devices", "Failing to add a device", "Settings for each device"],
    ["Usage", "Monitor utility performance", "Difficult to create scenes", "Remote control"],
]

const SWOT: [string, string[]][] = [
    ["Strengths", ["An established user base to build the redesign on", "Brand recognition that already fosters trust"]],
    ["Weaknesses", ["Usability problems and a confusing interface", "Fewer features than the competition"]],
    ["Opportunities", ["A redesign of the interface and navigation", "Personalisation and customisation options"]],
    ["Threats", ["A crowded market of home automation apps", "Users who would rather keep the physical switch"]],
]

const FINDINGS = [
    "It takes five steps to make a change — the user path needs simplifying.",
    "The design has to be intuitive enough to need no instructions; you shouldn't have to hunt for settings.",
    "You can only see one camera at a time. You should see them all, then click for the detail.",
    "There's no built-in vacation mode to randomise the lights so the house looks lived in.",
    "Being able to reach a human — user support — matters.",
    "Don't add features that aren't fully relevant, like a weather forecast.",
]

const KANO: [string, string[]][] = [
    [
        "Must be",
        [
            "Tips on how the functionality works, on first entry",
            "Add people to your family so they share the account",
            "Control the system from any distance",
        ],
    ],
    [
        "Attractive",
        [
            "Create automations and scenes, and trigger them with one tap",
            "Add devices whatever their protocol",
            "Scan a device's QR to add it quickly",
        ],
    ],
    ["Indifferent", ["Scheduling specific actions", "Detailed analytics and reports on energy consumption"]],
]

const IA: [string, string[]][] = [
    ["Splash → Sign in → Location selection", [
        "Log in by phone number, confirm by code, recover the password",
        "Pair the controller over Bluetooth — one controller only",
    ]],
    ["1 · Room", [
        "Select floor, then select room by swiping",
        "Add and manage devices, turn them on and off",
        "Device screen → add new device → pick room and floor",
        "Basic devices (name, type, brand, model, node) → pairing",
        "AV devices (model, IR device, channel selection) → test, record, add",
    ]],
    ["2 · Scene", [
        "Add, edit and remove scenes",
        "Choose devices, rooms, or the entire house for a scene",
        "Pick an icon, set the schedule, make it an automation",
    ]],
    ["3 · Notifications", ["Alarms and device activity in one place"]],
    ["4 · Settings", [
        "Register info",
        "Give other people access to devices",
        "Add floors, rooms and devices",
        "Change or add a location",
        "Add a controller",
    ]],
]

const DECISIONS: [string, string, string][] = [
    [
        "The devices you use most sit at the top",
        "Grouping the home screen by room, the way the house is laid out",
        "The survey put lighting first and smartphones far ahead of every other controller — a daily, one-handed surface. Room-first ordering makes you navigate to reach the light you use forty times a day.",
    ],
    [
        "Voice is on the main surface, as an accessibility feature",
        "A voice shortcut tucked into settings, the way most apps ship it",
        "“Turn on all the lights in the entire room” is not a party trick for someone who cannot reach the panel or read it quickly. If it is the accessible path through the product, it cannot be three taps deep.",
    ],
    [
        "The failure states are named on the screen",
        "A spinner, or an empty grid that tells you nothing",
        "Can't find your devices and can't connect to your devices are different problems with different fixes. Each one says which it is and offers the way out, because a smart home fails in the exact moment you need it.",
    ],
]

const OUTCOMES = [
    "The devices people actually touch are the first thing on the screen.",
    "Voice sits on the main surface, not in a settings menu.",
    "A scene is built beside the devices it controls, not in a separate tool.",
    "Every dead end says which dead end it is.",
]

const NUMBERS: [string, string][] = [
    ["9", "interview questions"],
    ["10", "survey questions"],
    ["2", "personas"],
    ["3", "competitors"],
]

const HONEST = [
    "The boards are the design record, not a shipping log — I can show what was designed, not what a real house did with it.",
    "Everything here is the design record from 2023. Where a decision was validated later in build, that evidence lives with the team, not in this write-up.",
    "The warning swatch in my own style guide is a pale yellow that would fail contrast as text. It works as a fill behind dark type and nowhere else; today I would define it that way instead of leaving it loose.",
    "The competitor teardown is from 2023. Nest, Alexa and Fibaro have all moved since.",
]

// ── page ─────────────────────────────────────────────────────────────────────

export default function SmartHomeCase(props: any) {
    const { backLabel = "← Work" } = props
    return (
        <div style={{ background: C.page, color: C.body, width: "100%", fontFamily: SANS, WebkitFontSmoothing: "antialiased" }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Inspiration&display=swap');
                  .sh-grid{display:grid;gap:28px}
                  @media(max-width:900px){.sh-2,.sh-3,.sh-4,.sh-split{grid-template-columns:1fr!important}}`}
            </style>

            {/* 01 · hero */}
            <Section pad="clamp(96px,11vw,180px)">
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    <Label>[case 07] &nbsp;aurasmart · 2023 · mobile app · end to end</Label>
                    <h1
                        style={{
                            margin: 0,
                            font: `500 clamp(36px,6vw,80px)/1.02 ${SANS}`,
                            letterSpacing: "-0.035em",
                            color: C.head,
                            textTransform: "uppercase",
                        }}
                    >
                        A smart home is only smart if the light{" "}
                        <span style={{ font: `400 1.15em/0.8 ${SCRIPT}`, textTransform: "none" }}>is</span> one tap away
                    </h1>
                    <Body max={780}>
                        AURA is the smart home app I designed end to end at AuraSmart: one app for the lights, the
                        locks, the camera and the climate. I ran the research, built the personas and the competitor
                        teardown, and designed every screen — around a single rule about what belongs at the top.
                    </Body>
                    <div style={{ marginTop: 12 }}>
                        <Shot src={img("cover")} alt="AURA smart home app" />
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 02 · setup + aim */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[the setup]</Label>
                    <div className="sh-grid sh-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                        {SETUP.map(([t, d]) => (
                            <div key={t} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ font: `500 21px/1.25 ${SANS}`, color: C.head }}>{t}</div>
                                <Body dim>{d}</Body>
                            </div>
                        ))}
                    </div>
                    <Rule top={8} />
                    <Label>[the aim i set myself]</Label>
                    <div className="sh-grid sh-split" style={{ gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "start" }}>
                        <Body dim>
                            One interface for lighting, security, climate and entertainment, on a phone. Deliberately
                            unglamorous: the app has to be correct about what the house is doing before it is clever
                            about anything else.
                        </Body>
                        <Numbered items={AIM} />
                    </div>
                </Reveal>
            </Section>

            {/* 03 · research */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[what i asked, and what came back]</Label>
                    <Title pre="Nine questions asked, ten questions " script="counted" />
                    <Body max={820} dim>
                        Interviews first — open-ended, about what people already own and where they gave up. Then a
                        survey, to put numbers under the answers and turn them into personas.
                    </Body>
                    <div className="sh-grid sh-2" style={{ gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                        {QUOTES.map((q) => (
                            <blockquote
                                key={q}
                                style={{
                                    margin: 0,
                                    padding: "22px 26px",
                                    borderLeft: `2px solid ${C.head}`,
                                    background: C.plate,
                                    borderRadius: "0 12px 12px 0",
                                    font: `400 17px/1.55 ${SANS}`,
                                    color: C.body,
                                }}
                            >
                                “{q}”
                            </blockquote>
                        ))}
                    </div>
                    <Rule top={12} />
                    <Label>[what the survey said]</Label>
                    <div className="sh-grid sh-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 26 }}>
                        {SURVEY.map(([q, a]) => (
                            <div key={q} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
                                <div style={{ font: `500 15px/1.35 ${SANS}`, color: C.head }}>{q}</div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{a}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 04 · personas */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[who it is for]</Label>
                    <Title pre="Two people who want the same thing for different " script="reasons" />
                    <div className="sh-grid sh-2" style={{ gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                        {PERSONAS.map((p) => (
                            <Card key={p.name} kicker="persona" title={p.name}>
                                <div style={{ font: `400 12px/1.5 ${MONO}`, color: C.label, letterSpacing: "0.03em" }}>{p.meta}</div>
                                <div style={{ font: `400 15px/1.6 ${SANS}`, color: C.body, marginTop: 6 }}>{p.bio}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase", marginTop: 14 }}>
                                    frustrations
                                </div>
                                <Bullets items={p.pains} />
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.body, textTransform: "uppercase", marginTop: 12 }}>
                                    goals
                                </div>
                                <Bullets items={p.goals} />
                            </Card>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 05 · journey */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[the journey, with the mood under it]</Label>
                    <Title pre="Four stages, and the app only gets " script="worse" post=" as it goes" />
                    <Body max={820} dim>
                        Buying is the happy part. Every stage after it is where people lose patience — which is why
                        the design work concentrates on setting up, connecting and daily use rather than onboarding.
                    </Body>
                    <div className="sh-grid sh-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
                        {JOURNEY.map(([stage, action, pain, joy], i) => (
                            <div key={stage} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `2px solid ${C.head}`, paddingTop: 16 }}>
                                <div style={{ font: `400 12px/1.4 ${MONO}`, color: C.grey }}>{String(i + 1).padStart(2, "0")}</div>
                                <div style={{ font: `500 17px/1.25 ${SANS}`, color: C.head }}>{stage}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.12em", color: C.label, textTransform: "uppercase", marginTop: 6 }}>
                                    they do
                                </div>
                                <div style={{ font: `400 14px/1.55 ${SANS}`, color: C.body }}>{action}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.12em", color: C.label, textTransform: "uppercase", marginTop: 6 }}>
                                    it hurts
                                </div>
                                <div style={{ font: `400 14px/1.55 ${SANS}`, color: C.body }}>{pain}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.12em", color: C.label, textTransform: "uppercase", marginTop: 6 }}>
                                    it delights
                                </div>
                                <div style={{ font: `400 14px/1.55 ${SANS}`, color: C.label }}>{joy}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 06 · competitive */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[what already exists]</Label>
                    <Title pre="Nest, Alexa and Fibaro, pulled " script="apart" />
                    <Body max={860} dim>
                        Three mature products, compared feature by feature, then read back through what their own
                        users complain about. All three organise the home by room, because that is how a floor plan
                        is drawn. The survey said people do not use their homes that way. That gap is the design.
                    </Body>
                    <div className="sh-grid sh-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: 26 }}>
                        {SWOT.map(([h, items]) => (
                            <div key={h} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
                                <div style={{ font: `500 12px/1.4 ${MONO}`, letterSpacing: "0.12em", color: C.head, textTransform: "uppercase" }}>{h}</div>
                                <Bullets items={items} />
                            </div>
                        ))}
                    </div>
                    <Rule top={12} />
                    <Label>[what their users actually say]</Label>
                    <Numbered items={FINDINGS} />
                    <Rule top={12} />
                    <Label>[sorted with a kano model]</Label>
                    <div className="sh-grid sh-3" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
                        {KANO.map(([h, items]) => (
                            <Card key={h} kicker={h}>
                                <Bullets items={items} color={C.body} />
                            </Card>
                        ))}
                    </div>
                </Reveal>
            </Section>

            <Rule />

            {/* 07 · IA */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[structure]</Label>
                    <Title pre="Four sections, and everything else is " script="inside" post=" one of them" />
                    <div className="sh-grid sh-2" style={{ gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                        {IA.map(([h, items]) => (
                            <div key={h} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
                                <div style={{ font: `500 17px/1.3 ${SANS}`, color: C.head }}>{h}</div>
                                <Bullets items={items} />
                            </div>
                        ))}
                    </div>
                    <Rule top={12} />
                    <Label>[the visual system]</Label>
                    <Body max={860} dim>
                        A bright, high-contrast palette on a blue primary, with a neutral dark ramp for surfaces, and
                        a named status set — success, info, warning, error, disabled. Roboto throughout, chosen to
                        stay readable on a phone held at arm's length.
                    </Body>
                </Reveal>
            </Section>

            <Rule />

            {/* 08 · key screens */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[key screen · 01]</Label>
                    <Title pre="The devices you actually " script="touch" />
                    <Body max={800} dim>
                        Most-used devices are pinned to the top of the home screen, so the switch you reach for forty
                        times a day is never behind a room you have to open first.
                    </Body>
                    <Shot src={img("top-devices")} alt="Most frequently used devices stay at the top" />
                </Reveal>
            </Section>

            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[key screen · 02]</Label>
                    <Title pre="Voice, because reaching the panel is the " script="hard" post=" part" />
                    <Body max={800} dim>
                        “Turn on all the lights in the entire room.” Voice sits on the main surface as the accessible
                        route through the product — and the states around it say plainly when a device can't be found
                        or can't be reached.
                    </Body>
                    <Shot src={img("voice")} alt="Adding devices, named error states, and integrated voice control" />
                </Reveal>
            </Section>

            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[key screen · 03]</Label>
                    <Title pre="A scene is built beside the devices it " script="runs" />
                    <Body max={800} dim>
                        Device control and automation scenes live on the same surface: set the colour, the brightness
                        and the temperature, then save that combination as the thing you meant — rather than
                        rebuilding it every evening.
                    </Body>
                    <Shot src={img("device-control")} alt="Device control and automation scene creation" />
                </Reveal>
            </Section>

            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[getting in]</Label>
                    <Shot
                        src={img("screens")}
                        alt="Launch, onboarding and sign-up"
                        cap="Launch, three onboarding cards, then sign-up — the benefit has to land before the permissions do."
                    />
                </Reveal>
            </Section>

            <Rule />

            {/* 09 · decisions */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[three calls i'd defend]</Label>
                    <div className="sh-grid sh-3" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
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
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase" }}>
                                    decision
                                </div>
                                <div style={{ font: `500 19px/1.3 ${SANS}`, color: C.head }}>{d}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.label, textTransform: "uppercase", marginTop: 14 }}>
                                    rejected
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{r}</div>
                                <div style={{ font: `500 11px/1.4 ${MONO}`, letterSpacing: "0.14em", color: C.body, textTransform: "uppercase", marginTop: 14 }}>
                                    why
                                </div>
                                <div style={{ font: `400 14px/1.6 ${SANS}`, color: C.label }}>{w}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </Section>

            {/* 10 · the finished thing */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                    <Label>[the finished thing]</Label>
                    <Shot src={img("mockups")} alt="The finished screens" />
                </Reveal>
            </Section>

            <Rule />

            {/* 11 · outcome */}
            <Section>
                <Reveal style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                    <Label>[what the rule bought]</Label>
                    <div className="sh-grid sh-split" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "start" }}>
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
                        <div className="sh-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}>
                            {NUMBERS.map(([n, l]) => (
                                <div key={l}>
                                    <div style={{ font: `500 clamp(30px,3.6vw,44px)/1 ${SANS}`, letterSpacing: "-0.03em", color: C.head }}>
                                        {n}
                                    </div>
                                    <div style={{ font: `400 12px/1.5 ${MONO}`, letterSpacing: "0.1em", color: C.label, textTransform: "uppercase", marginTop: 8 }}>
                                        {l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Rule top={16} />

                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <Label>[what this case study is not]</Label>
                        {HONEST.map((f) => (
                            <div key={f} style={{ font: `400 15px/1.65 ${SANS}`, color: C.body, maxWidth: 900 }}>
                                {f}
                            </div>
                        ))}
                    </div>

                    <Rule top={16} />

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "center" }}>
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
                        <span style={{ font: `400 12px/1.4 ${MONO}`, letterSpacing: "0.1em", color: C.label, textTransform: "uppercase" }}>
                            aurasmart · 2023
                        </span>
                    </div>
                </Reveal>
            </Section>
        </div>
    )
}

addPropertyControls(SmartHomeCase, {
    backLabel: { type: ControlType.String, title: "Back label", defaultValue: "← Work" },
})
