/**
 * Case-study registry — full case bodies, loaded only on a case route.
 *
 * The home page must NOT import this: it pulls all five case studies' prose into
 * whatever chunk imports it. Home reads `./summaries` instead. Display order comes
 * from CASE_ORDER in that same module, so the index and the cards can never diverge.
 *
 * Add a case: write its file, add it to `./summaries`, list it in CASE_ORDER, register it here.
 */
import type { CaseStudy } from '../types'
import { CASE_ORDER } from './summaries'
import { transporterPanel } from './transporter-panel'
import { ndc } from './ndc'
import { clh } from './linehaul-nexus'
import { transporter } from './transporter-contracts'
import { placement } from './placement-multi-origin'

export const caseStudies: Record<string, CaseStudy> = {
  [transporterPanel.slug]: transporterPanel,
  [ndc.slug]: ndc,
  [clh.slug]: clh,
  [transporter.slug]: transporter,
  [placement.slug]: placement,
}

/** Ordered list for prev/next navigation — order owned by CASE_ORDER. */
export const caseStudyList: CaseStudy[] = CASE_ORDER.map((slug) => caseStudies[slug])
