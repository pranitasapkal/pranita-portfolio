/**
 * Case summaries — identity + home-index card copy for every case study.
 *
 * Why this is separate from the case files: the home page renders a card per case, but
 * must not pull five case studies' worth of prose into the initial bundle. This module is
 * the small half; `./index.ts` and the full `./*.tsx` bodies are the large half and load
 * only on a case route.
 *
 * Keep page copy OUT of here — page titles and one-liners live in the case files. The
 * NDA scan checks this: anything written here ships to every visitor of the home page.
 *
 * OWNERSHIP: text lane. Adding a case = add it here, add its file, list it in CASE_ORDER,
 * register it in ./index.ts, and add a node signature in CaseIndex.tsx keyed by slug.
 */
import type { CaseSummary } from '../types'

export const summaries = {
  'transporter-panel': {
    slug: 'transporter-panel',
    code: 'TPN-01',
    cardTitle: 'The Transporter Panel',
    cardOneLiner:
      'Every trip ran on a chat thread and got paid two months later — I designed the panel that replaced both.',
    stats: ['154 screens', '5 lifecycle states', '7 bilingual categories'],
    browserSlug: 'pranita.design/tpn',
  },

  'network-design-central': {
    slug: 'network-design-central',
    code: 'NDC-02',
    cardTitle: 'Network Design Central',
    cardOneLiner: 'The solver designs the routes. I designed the agreement.',
    stats: ['~80 sort centres', '5→2 clicks', '<30 s to orient'],
    browserSlug: 'pranita.design/ndc',
  },

  'linehaul-nexus': {
    slug: 'linehaul-nexus',
    code: 'CLH-03',
    cardTitle: 'Contract Lifecycle Hub',
    cardOneLiner:
      'One panel had to hold two contradictory realities: national contracts fan out to many vehicles, regional contracts stay strictly one-to-one.',
    stats: ['130+ screens', '14 end-to-end flows', '4 contested decisions'],
    browserSlug: 'pranita.design/clh',
  },

  'transporter-contract-management': {
    slug: 'transporter-contract-management',
    code: 'TCM-04',
    cardTitle: 'Transporter Contract Management',
    cardOneLiner:
      'Everything that makes an ops power-tool good actively fails a user who reads slowly and trusts the screen literally.',
    stats: ['34 distinct row states', '27 issues self-caught', '6-term vocabulary'],
    browserSlug: 'pranita.design/tpr',
  },

  'placement-multi-origin': {
    slug: 'placement-multi-origin',
    code: 'PLC-05',
    cardTitle: 'Multi-Origin Route Builder',
    cardOneLiner:
      "Six percent of trips were quietly corrupting the data everyone else depended on — and the fix wasn't allowed to cost the other 94% a single click.",
    stats: ['2-click node add', '>95% data accuracy', '0 extra steps (94%)'],
    browserSlug: 'pranita.design/pla',
  },
} satisfies Record<string, CaseSummary>

/** Display order — drives both the home index and case-page prev/next. Single source. */
export const CASE_ORDER = [
  'transporter-panel',
  'network-design-central',
  'linehaul-nexus',
  'transporter-contract-management',
  'placement-multi-origin',
] as const

export const caseSummaryList: CaseSummary[] = CASE_ORDER.map((slug) => summaries[slug])
