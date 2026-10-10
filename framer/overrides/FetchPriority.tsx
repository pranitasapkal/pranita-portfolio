import type { ComponentType } from "react"

export function withFetchPriority(Component): ComponentType {
    return (props) => {
        return (
            <Component
                {...props}
                background={{
                    ...props.background,
                    fetchPriority: "high",
                }}
            />
        )
    }
}

// Hero TV: same high fetch priority, plus a scale-in that starts about 1s after the name appears. It is a CSS
// animation in the server-rendered HTML, so it runs from first paint and does not wait for JavaScript. Framer's own
// Appear delay was dropped or stretched unpredictably at hydration. Reduced motion: no scale.
const TV_KEYFRAMES =
    "@keyframes pfTvIn{from{transform:scale(0)}to{transform:scale(1)}}" +
    "@media (prefers-reduced-motion: reduce){@keyframes pfTvIn{from{transform:none}to{transform:none}}}"

export function withFetchPriorityReveal(Component): ComponentType {
    return (props) => {
        return (
            <>
                <style>{TV_KEYFRAMES}</style>
                <Component
                    {...props}
                    background={{
                        ...props.background,
                        fetchPriority: "high",
                    }}
                    style={{
                        ...props.style,
                        transformOrigin: "50% 50%",
                        animation: "pfTvIn 0.9s cubic-bezier(0.65, 0, 0.35, 1) 1.3s both",
                    }}
                />
            </>
        )
    }
}
