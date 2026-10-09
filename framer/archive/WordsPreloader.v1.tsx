import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * Words preloader — a full-screen sheet with a curved bottom edge. Greetings
 * cycle in the centre, then the sheet slides up and off while its curve
 * flattens, revealing the page. Port of Skiper UI "skiper8".
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerDisableUnlink
 */
export default function WordsPreloader(props) {
    const {
        words,
        sheetColor,
        textColor,
        textOpacity,
        firstDelay,
        stepDelay,
        holdAfter,
        font,
        previewOnCanvas,
    } = props

    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [index, setIndex] = useState(0)
    const [visible, setVisible] = useState(true)
    const [size, setSize] = useState({ width: 0, height: 0 })

    const list = words && words.length ? words : ["Hello"]

    useEffect(() => {
        const measure = () =>
            setSize({ width: window.innerWidth, height: window.innerHeight })
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [])

    // On the canvas we hold the first word so the design stays inspectable.
    useEffect(() => {
        if (isCanvas && !previewOnCanvas) return
        if (index < list.length - 1) {
            const t = setTimeout(
                () => setIndex(index + 1),
                index === 0 ? firstDelay : stepDelay
            )
            return () => clearTimeout(t)
        }
        const t = setTimeout(() => setVisible(false), holdAfter)
        return () => clearTimeout(t)
    }, [index, isCanvas, previewOnCanvas, list.length, firstDelay, stepDelay, holdAfter])

    const { width: w, height: h } = size
    // Bottom edge bulges 300px below the fold, then flattens on exit.
    const curved = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0`
    const flat = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`

    const ease = [0.76, 0, 0.24, 1]

    return (
        <AnimatePresence mode="wait">
            {visible && (
                <motion.div
                    variants={{
                        initial: { top: 0 },
                        exit: {
                            top: "-100vh",
                            transition: { duration: 0.8, ease, delay: 0.2 },
                        },
                    }}
                    initial="initial"
                    exit="exit"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        background: sheetColor,
                        pointerEvents: "none",
                    }}
                >
                    {w > 0 && (
                        <>
                            <motion.p
                                variants={{
                                    initial: { opacity: 0 },
                                    enter: {
                                        opacity: textOpacity,
                                        transition: { duration: 1, delay: 0.2 },
                                    },
                                }}
                                initial="initial"
                                animate="enter"
                                style={{
                                    position: "absolute",
                                    zIndex: 10,
                                    margin: 0,
                                    color: textColor,
                                    ...font,
                                }}
                            >
                                {list[index]}
                            </motion.p>
                            <svg
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    width: "100%",
                                    height: "calc(100% + 300px)",
                                }}
                            >
                                <motion.path
                                    variants={{
                                        initial: {
                                            d: curved,
                                            transition: { duration: 0.7, ease },
                                        },
                                        exit: {
                                            d: flat,
                                            transition: { duration: 0.7, ease, delay: 0.3 },
                                        },
                                    }}
                                    initial="initial"
                                    exit="exit"
                                    fill={sheetColor}
                                />
                            </svg>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

WordsPreloader.defaultProps = {
    words: ["Hello", "नमस्ते", "bonjour", "Ciao", "Olà", "やあ", "Hallå", "ನಮಸ್ಕಾರ"],
    sheetColor: "#FFFFFF",
    textColor: "#000000",
    textOpacity: 0.75,
    firstDelay: 1000,
    stepDelay: 150,
    holdAfter: 400,
    previewOnCanvas: false,
}

addPropertyControls(WordsPreloader, {
    words: {
        type: ControlType.Array,
        title: "Words",
        control: { type: ControlType.String },
        defaultValue: [
            "Hello",
            "नमस्ते",
            "bonjour",
            "Ciao",
            "Olà",
            "やあ",
            "Hallå",
            "ನಮಸ್ಕಾರ",
        ],
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: "1",
        },
    },
    sheetColor: { type: ControlType.Color, title: "Sheet" },
    textColor: { type: ControlType.Color, title: "Text" },
    textOpacity: {
        type: ControlType.Number,
        title: "Opacity",
        min: 0,
        max: 1,
        step: 0.05,
    },
    firstDelay: {
        type: ControlType.Number,
        title: "First",
        min: 0,
        max: 4000,
        step: 50,
        unit: "ms",
    },
    stepDelay: {
        type: ControlType.Number,
        title: "Step",
        min: 40,
        max: 1000,
        step: 10,
        unit: "ms",
    },
    holdAfter: {
        type: ControlType.Number,
        title: "Hold",
        min: 0,
        max: 3000,
        step: 50,
        unit: "ms",
    },
    previewOnCanvas: { type: ControlType.Boolean, title: "Play on canvas" },
})
