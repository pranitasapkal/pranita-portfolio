/**
 * Site copy — every user-facing string outside the case studies.
 *
 * OWNERSHIP: the text lane owns this file. Components in `src/components/**` import
 * from it and must never hardcode a user-facing string. Case-study copy lives in
 * `src/content/cases/*.tsx`; home-card copy lives on each case's `home` field.
 *
 * Rule of thumb for what belongs here: if changing it changes what a reader *reads*,
 * it lives here. If changing it changes how the page *looks*, it lives in the component.
 * SVG marks, class names, and layout numbers stay in the components.
 */

// ── Shared shapes ─────────────────────────────────────────────────────────────

export interface NavLink {
  label: string
  href: string
}

export interface ServiceItem {
  num: string
  label: string
  desc: string
}

/** Category chip on a toolkit card. The component maps these to colours. */
export type PluginCategory = 'AUDIT' | 'ENFORCE' | 'CHECK' | 'GENERATE' | 'SPEC' | 'SYNC'

export interface Plugin {
  name: string
  category: PluginCategory
  oneLiner: string
}

export interface SecondaryCard {
  title: string
  desc: string
  tags: string[]
  /** Renders the "earlier work" tag — pre-Meesho projects. */
  earlier?: boolean
}

export interface ProcessStep {
  num: string
  /** `\n` marks the intended line break in the node label. */
  label: string
}

export interface StatCallout {
  value: string
  label: string
  /** Marks the number as deliberately approximated (renders the asterisk). */
  fuzzed?: boolean
}

// ── Copy ──────────────────────────────────────────────────────────────────────

export const site = {
  /** Document title + meta description for the home route.
   *  `index.html` carries a static copy as the pre-JS fallback — keep the two in step. */
  seo: {
    home: {
      title: 'Pranita Sapkal — Product Designer · Systems that move things',
      description:
        'Pranita Sapkal — Product designer for the systems that move things. Logistics UX: contract lifecycles, network planning, and ops platforms.',
    },
  },

  nav: {
    homeAriaLabel: 'Pranita Sapkal — home',
    wordmark: 'PS',
    links: [
      { label: 'Work', href: '/#work' },
      { label: 'Toolkit', href: '/#toolkit' },
      { label: 'Process', href: '/#process' },
      { label: 'Contact', href: '/#contact' },
    ] as NavLink[],
    resumeLabel: 'Resume ↓',
    resumeHref: '/resume/pranita-sapkal-resume.pdf',
    openMenuLabel: 'Open navigation menu',
    closeMenuLabel: 'Close navigation menu',
    menuAriaLabel: 'Navigation',
    primaryNavLabel: 'Primary',
    mobileNavLabel: 'Mobile primary',
  },

  hero: {
    sectionAriaLabel: 'Introduction',
    /** Oversized watermark behind the hero. */
    ghost: 'THE NETWORK',
    /** Rendered as separate words for the pull-up entrance. */
    nameWords: ['PRANITA', 'SAPKAL'],
    nameAriaLabel: 'PRANITA SAPKAL',
    subline: 'Product designer for the systems that keep the real world moving.',
    stats: [
      { value: '10,000+', label: 'delivery nodes planned', fuzzed: true },
      { value: '5→2', label: 'clicks to task start' },
      { value: '8', label: 'tools built' },
      { value: '5', label: 'flagship systems' },
    ] as StatCallout[],
    portraitAlt: 'Portrait photograph, coming soon',
    portraitPlaceholderLabel: 'Portrait',
    scrollCue: 'Scroll',
  },

  about: {
    servicesHeading: 'What I do',
    paragraphs: [
      'I design dense ops workbenches for logistics planners who need complete situational awareness in seconds, and low-literacy transporter interfaces for delivery partners who trust the screen literally.',
      'My work is about operating models: decision loops, alignment rituals, permission structures, not just screen design. Every case study here documents a system, not a surface.',
      'I also build the tools I use: eight Figma plugins, run daily on production files, that automate the audit work I would otherwise do by hand.',
    ],
    services: [
      {
        num: '01',
        label: 'Ops workbenches',
        desc: 'Dense situational-awareness panels for planners who need to see across a whole network at once.',
      },
      {
        num: '02',
        label: 'Contract lifecycle systems',
        desc: 'End-to-end flow design from assignment through alignment, freeze, and handoff to vendor contracts.',
      },
      {
        num: '03',
        label: 'Low-literacy mobile & panel UX',
        desc: 'Transporter-facing interfaces designed for literal readers, one-handed use, and poor network conditions.',
      },
      {
        num: '04',
        label: 'Design-ops tooling',
        desc: 'Figma plugins and audit scripts that automate compliance, state coverage, and handoff spec work.',
      },
    ] as ServiceItem[],
  },

  /** The "selected systems" index. Card content itself comes from each case's `home` field. */
  work: {
    sectionNumber: '01',
    sectionLabel: 'SELECTED SYSTEMS',
    /** Shown on a card whose case page is not published yet. */
    inAssemblyLabel: 'CASE STUDY IN ASSEMBLY',
    assetPendingLabel: 'Asset pending',
    viewCaseAriaLabel: (title: string) => `View case study: ${title}`,
    inAssemblyAriaLabel: (title: string) => `${title} — case study in assembly`,
  },

  toolkit: {
    sectionNumber: '02',
    sectionLabel: 'TOOLKIT',
    headline: 'I build the tools I wish existed.',
    subline: 'Eight Figma plugins, built with AI, run daily on production files.',
    stamp: {
      top: 'SPEC SHEET',
      number: 'NO. 08',
      bottom: 'FIGMA PLUGINS',
    },
    footnote: {
      text: 'All plugins run on Figma Desktop. Source in',
      code: '_setup/figma-plugins/',
    },
    plugins: [
      {
        name: 'CLH IA AUDITOR',
        category: 'AUDIT',
        oneLiner:
          'Validates frames against IA Spec v4: checks column order, identity blocks, and tab naming.',
      },
      {
        name: 'CLH DS ENFORCER',
        category: 'ENFORCE',
        oneLiner: 'Catches detached components and hardcoded colors against Design System v1.1.1.',
      },
      {
        name: 'CLH STATE CHECKER',
        category: 'CHECK',
        oneLiner:
          'Verifies that every screen group ships its full state matrix: default, loading, empty, error, modal.',
      },
      {
        name: 'CLH TOKEN POLICE',
        category: 'ENFORCE',
        oneLiner:
          'Flags unbound fills, off-scale font sizes, and spacing values that miss the token grid.',
      },
      {
        name: 'CLH A11Y CHECKER',
        category: 'AUDIT',
        oneLiner:
          'WCAG 2.1 AA: contrast ratios, touch-target sizing (44×44 min), and text minimum sizes.',
      },
      {
        name: 'CLH HANDOFF SPEC',
        category: 'SPEC',
        oneLiner:
          'Generates annotated spec cards next to frames: dimensions, colour palette, typography summary, spacing values.',
      },
      {
        name: 'CLH STATE GENERATOR',
        category: 'GENERATE',
        oneLiner:
          'Clones a default frame for each missing state and positions the variants in a labelled row.',
      },
      {
        name: 'CLH PROTOTYPE SYNC',
        category: 'SYNC',
        oneLiner:
          'Copies auto-layout, fills, strokes, and radii from a source frame to all selected targets.',
      },
    ] as Plugin[],
  },

  secondaryWork: {
    sectionNumber: '03',
    sectionLabel: 'MORE WORK',
    earlierTag: 'EARLIER WORK',
    items: [
      {
        title: 'Dispute-flow Redesign',
        desc: 'Hundreds of disputes weekly, reordered by real frequency and made proof-gated. Removed the assumption that every dispute type deserves equal visual weight.',
        tags: ['Valmo', 'Mobile', 'Transporter-facing'],
      },
      {
        title: 'Transporter Trips Panel',
        desc: 'Five-tab trip lifecycle (Pending, Upcoming, In-Transit, Completed, Cancelled) with live GPS states and one primary CTA per row throughout.',
        tags: ['Valmo', 'Desktop panel', 'Lifecycle UX'],
      },
      {
        title: 'Tibil Website',
        desc: 'End-to-end product website design for a B2B fintech startup: information architecture, visual system, and responsive layout.',
        tags: ['Website', 'B2B'],
        earlier: true,
      },
      {
        title: 'Evaluationz Website',
        desc: 'Brand and product website for an HR-tech platform. Designed the full component library and led visual direction.',
        tags: ['Website', 'HR-tech'],
        earlier: true,
      },
      {
        title: 'Huntment Ride',
        desc: 'Multi-service ride-hailing app concept covering ride booking, package delivery, and rental modes within a single flow architecture.',
        tags: ['Mobile app', 'Multi-service'],
        earlier: true,
      },
    ] as SecondaryCard[],
  },

  process: {
    eyebrow: '04 / PROCESS',
    intro: 'Every case study on this site follows the same eight steps.',
    listAriaLabel: 'Design process steps',
    steps: [
      { num: '01', label: 'Problem\nUnderstanding' },
      { num: '02', label: 'Objective' },
      { num: '03', label: 'User\nPersona' },
      { num: '04', label: 'Information\nArchitecture' },
      { num: '05', label: 'User\nFlow' },
      { num: '06', label: 'Lo-fi\nWireframes' },
      { num: '07', label: 'Prototype' },
      { num: '08', label: 'Business\nAspects' },
    ] as ProcessStep[],
  },

  writing: {
    eyebrow: '04 / WRITING',
    essay: {
      tag: 'ESSAY',
      title: 'The Secret Sauce of Great UX Design: Empathy',
      blurb:
        'Published on Medium, on why empathy is the foundation every tool, flow, and decision should be built on.',
      source: 'medium.com/@Pranitasapkal',
      href: 'https://medium.com/@Pranitasapkal/the-secret-sauce-of-great-ux-design-empathy-5b68e01ee1c0',
      ariaLabel:
        'Read essay: The Secret Sauce of Great UX Design: Empathy (opens on Medium)',
    },
  },

  contact: {
    eyebrow: '05 / CONTACT',
    headline: 'Start a conversation.',
    subline: 'Open to product design roles and selected consulting engagements.',
    email: 'sapkalp1997@gmail.com',
  },

  footer: {
    email: 'sapkalp1997@gmail.com',
    emailAriaLabel: 'Email: sapkalp1997@gmail.com',
    socialsAriaLabel: 'Social links',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/pranita-sapkal-86364010a' },
      { label: 'Behance', href: 'https://behance.net/pranitasapkal' },
      { label: 'Dribbble', href: 'https://dribbble.com/Pranitas03' },
      { label: 'Medium', href: 'https://medium.com/@Pranitasapkal' },
    ] as NavLink[],
    footnote:
      '* All metrics are directionally accurate and intentionally fuzzed. No real shipment data appears on this site.',
    stamp: 'Last Dispatch: 2026-07',
  },

  notFound: {
    code: '404',
    headline: 'PACKAGE NOT FOUND',
    ctaLabel: 'Return to base',
    ctaHref: '/',
  },
}
