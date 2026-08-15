/**
 * Case-study registry. Maps slug → CaseStudy and exports ordered list.
 * Add entries here when new case studies are created.
 * Display order is the order of `caseStudyList`, and each case's `next` follows it as a cycle.
 */
import type { CaseStudy } from '../types'
import { assignment } from './assignment-module'
import { ndc } from './ndc'
import { clh } from './linehaul-nexus'
import { transporter } from './transporter-contracts'
import { placement } from './placement-multi-origin'

export const caseStudies: Record<string, CaseStudy> = {
  [assignment.slug]: assignment,
  [ndc.slug]: ndc,
  [clh.slug]: clh,
  [transporter.slug]: transporter,
  [placement.slug]: placement,
}

/** Ordered list for prev/next navigation (add in display order). */
export const caseStudyList: CaseStudy[] = [assignment, ndc, clh, transporter, placement]
