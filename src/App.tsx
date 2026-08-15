import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { SmoothScroll } from './lib/SmoothScroll'
import { GrainOverlay } from './components/chrome/GrainOverlay'
import { SkipLink } from './components/chrome/SkipLink'
import { Navbar } from './components/chrome/Navbar'
import { Footer } from './components/chrome/Footer'
import { Loader } from './components/chrome/Loader'
import { RouteTransition } from './components/chrome/RouteTransition'
import KitchenSink from './pages/KitchenSink'
import Home from './pages/Home'

const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))

// ── 404 ───────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <main
      id="main"
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-8"
    >
      <p className="font-mono text-text-lo text-xs tracking-[0.3em] uppercase">404</p>
      <h1 className="font-display font-black text-4xl md:text-6xl text-text-hi text-center">
        PACKAGE NOT FOUND
      </h1>
      {/* Dashed SVG arc */}
      <svg
        width="120"
        height="40"
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-text-lo"
      >
        <path
          d="M10 35 Q60 0 110 35"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 3"
          fill="none"
        />
      </svg>
      <a
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono tracking-wider border bg-signal text-ink-0 border-transparent hover:bg-signal/90 transition-colors duration-200"
      >
        Return to base
      </a>
    </main>
  )
}

// ── App shell ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SmoothScroll>
      <SkipLink />
      <GrainOverlay />
      <Loader />
      <Navbar />

      <RouteTransition />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dev/kitchen-sink" element={<KitchenSink />} />
        <Route
          path="/work/:slug"
          element={
            <Suspense fallback={null}>
              <CaseStudyPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </SmoothScroll>
  )
}
