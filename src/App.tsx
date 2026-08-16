import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { SmoothScroll } from './lib/SmoothScroll'
import { SkipLink } from './components/chrome/SkipLink'
import { Navbar } from './components/chrome/Navbar'
import { Footer } from './components/chrome/Footer'
import { RouteTransition } from './components/chrome/RouteTransition'
import Home from './pages/Home'
import { site } from './content/site'

const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
// Dev-only surface — lazy so it never ships in a visitor's main chunk.
const KitchenSink = lazy(() => import('./pages/KitchenSink'))

// ── 404 ───────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <main
      id="main"
      className="min-h-screen bg-surface-0 flex flex-col items-center justify-center gap-8 p-8"
    >
      <p className="font-mono text-soft text-xs tracking-[0.3em] uppercase">{site.notFound.code}</p>
      <h1 className="font-serif-display font-semibold text-4xl md:text-6xl text-strong text-center tracking-tight">
        {site.notFound.headline}
      </h1>
      <a
        href={site.notFound.ctaHref}
        className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans font-semibold text-[15px] bg-strong text-surface-0 hover:bg-strong/85 transition-colors duration-200"
      >
        {site.notFound.ctaLabel}
      </a>
    </main>
  )
}

// ── App shell ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SmoothScroll>
      <SkipLink />
      <Navbar />

      <RouteTransition />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dev/kitchen-sink"
          element={
            <Suspense fallback={null}>
              <KitchenSink />
            </Suspense>
          }
        />
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
