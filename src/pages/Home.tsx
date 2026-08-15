/**
 * Home — v2 section order (ADR-004 §homepage):
 * Hero (light) → StatementFold (band) → WorkIndex (light) → BeyondGrid
 * (tinted) → Approach (band) → PluginsShowcase (light) → WritingStrip →
 * Footer (contact band, rendered by App).
 */
import { SEOHead } from '../components/chrome/SEOHead'
import { site } from '../content/site'
import { Hero } from '../components/home/Hero'
import { StatementFold } from '../components/home/StatementFold'
import { WorkIndex } from '../components/home/WorkIndex'
import { RootedShowcase } from '../components/home/RootedShowcase'
import { BeyondGrid } from '../components/home/BeyondGrid'
import { Approach } from '../components/home/Approach'
import { PluginsShowcase } from '../components/home/PluginsShowcase'
import { BeyondPixels } from '../components/home/BeyondPixels'
import { WritingStrip } from '../components/home/WritingStrip'

export default function Home() {
  return (
    <main id="main">
      <SEOHead title={site.seo.home.title} description={site.seo.home.description} />
      <Hero />
      <StatementFold />
      <WorkIndex />
      <RootedShowcase />
      <BeyondGrid />
      <Approach />
      <PluginsShowcase />
      <BeyondPixels />
      <WritingStrip />
    </main>
  )
}
