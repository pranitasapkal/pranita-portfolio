/**
 * ██ DRAFT COPY: EVERY STRING IN THIS FILE IS PLACEHOLDER ██
 *
 * v2 homepage strings that have no slot in `site.ts` yet. Written by the design
 * lane so the new layout has believable text to hang on; Pranita rewrites all
 * of it (or promotes it into `site.ts`) in the text lane. Nothing here is her
 * voice, and none of the draft claims below have been fact-checked.
 *
 * Components import from here. Never hardcode a user-facing string in a
 * component, even a placeholder one.
 */

export interface HeadlineSegment {
  text: string
  /** Renders the hand-drawn accent stroke under this segment. */
  underline?: boolean
  /** Renders the marker-highlight sweep behind this segment. */
  highlight?: boolean
}

export interface DeckCard {
  /** Short handwritten-style line at the top of the card. */
  kicker: string
  /** The card's main line. */
  line: string
  /** Visual tone the component maps to a background. */
  tone: 'paper' | 'ink' | 'accent'
}

export const draft = {
  nav: {
    /** Display name in the pill (title case, per ref). Not draft, but v2-only. */
    name: 'Pranita Sapkal',
    workLabel: 'Work',
    workHref: '/#work',
    linkedInLabel: 'LinkedIn',
    resumeLabel: 'Resume',
  },

  hero: {
    /** Handwritten greeting above the headline. */
    hello: 'hello! I\u2019m Pranita',
    rolePill: {
      role: 'PRODUCT DESIGNER',
      at: 'at',
      logoSrc: '/logos/meesho.svg',
      logoAlt: 'Meesho',
      location: 'Bangalore, India',
    },
    headline: [
      { text: 'Making ' },
      { text: 'complex systems', highlight: true },
      { text: ' feel ' },
      { text: 'obvious', underline: true },
      { text: '.' },
    ] as HeadlineSegment[],
    credibility: {
      strong: '4+ years',
      rest: ' designing across logistics, B2B platforms & design tooling',
    },
    ctaPrimary: 'See selected work ↓',
    ctaSecondary: 'Download resume',
    /** Handwritten hint on the interactive deck. */
    dragHint: 'drag me',
    peekLabel: 'Peek',
    shuffleLabel: 'Shuffle',
    deckAriaLabel: 'A small deck of cards. Decorative, shuffle to browse',
    deck: [
      { kicker: 'current status', line: 'Designing things that just make sense, since 2022.', tone: 'paper' },
      { kicker: 'field note', line: 'The best interface is a decision already made.', tone: 'ink' },
      { kicker: 'hot take', line: 'Density is kindness, if the hierarchy holds.', tone: 'accent' },
      { kicker: 'portrait', line: 'Photo arriving soon. The work got here first.', tone: 'paper' },
    ] as DeckCard[],
  },

  statement: {
    ariaLabel: 'Design philosophy',
    lines: [
      'Good systems disappear.',
      'You never see the moving parts: the reconciliations, the edge cases, the rules that catch a mistake before it costs anyone money.',
      'You just feel that it works.',
      'That moment when invisible complexity turns into a clear decision,',
      'that’s exactly what I design.',
    ],
    signature: 'Pranita',
  },

  work: {
    tag: 'SELECTED WORK',
    readStory: 'Read story',
    openLabel: '[OPEN]',
    /** Visible confidentiality note, never a dead link (research pitfall #5). */
    ndaNote:
      'Names and numbers on this site are deliberately fuzzed. The work is under NDA, the thinking isn’t.',
    /** Mono meta line per case: COMPANY · DOMAIN · YEAR (+ optional status badge). */
    meta: {
      'transporter-panel': { company: 'VALMO', domain: 'TRANSPORTER OPS', year: '2025', status: 'SHIPPED' },
      'network-design-central': { company: 'VALMO', domain: 'NETWORK PLANNING', year: '2025', status: 'SHIPPED' },
      'linehaul-nexus': { company: 'VALMO', domain: 'CONTRACT LIFECYCLE', year: '2026', status: 'IN BUILD' },
      'transporter-contract-management': { company: 'VALMO', domain: 'PARTNER PANEL', year: '2025' },
      'placement-multi-origin': { company: 'VALMO', domain: 'ROUTE BUILDER', year: '2025' },
    } as Record<string, { company: string; domain: string; year: string; status?: string }>,
  },

  /** Rooted app showcase (section 4). Copy mirrors rootedplant.org; the app
   *  is her shipped independent project. */
  rooted: {
    tag: 'SIDE QUEST, SHIPPED',
    ariaLabel: 'Rooted app',
    headline: [
      { text: 'Rooted: care for plants like a ' },
      { text: 'botanist', underline: true },
      { text: ', not a guesser.' },
    ] as HeadlineSegment[],
    subline:
      'A plant-care app designed end to end and live on the App Store. From a photo to the watering schedule your plant needs.',
    shotsAriaLabel: 'Rooted App Store screenshots',
    steps: [
      {
        step: 'Step 01',
        title: 'Snap a photo',
        body: 'Point your camera at any houseplant and Rooted returns a species match in seconds, even for plants you have never seen before.',
      },
      {
        step: 'Step 02',
        title: 'Get personalised plant care',
        body: 'Tell Rooted about your pot, your light, and the plant\u2019s spot in your home. Each answer tunes the watering plan for that species.',
      },
      {
        step: 'Step 03',
        title: 'Right reminder at the right moment',
        body: 'Today and Upcoming views group tasks by plant. One tap marks watering done, and undo is always there if you hit the chip by mistake.',
      },
    ],
    ctaLabel: 'Visit rootedplant.org',
    ctaHref: 'https://rootedplant.org/',
  },

  beyond: {
    tag: 'BEYOND THE CASE FILES',
    headline: [
      { text: 'Not everything fits in a ' },
      { text: 'case study', underline: true },
      { text: '.' },
    ] as HeadlineSegment[],
    subline:
      'Side builds, earlier lives, and the kind of work that never gets a write-up.',
    /** Live sites added by the design lane; linkable, unlike the site.ts tiles. */
    extras: [
      {
        title: 'Rooted Website',
        desc: 'Product site for the Rooted plant-care app: dark botanical identity, marketing pages, and the beta waitlist funnel.',
        tags: ['Website', 'Product'],
        href: 'https://rootedplant.org/',
        status: 'LIVE',
        tone: 'rooted',
      },
      {
        title: 'Yantrava Labs Website',
        desc: 'Studio site for Yantrava Labs: brand direction, type system, and page design for the venture holding the products.',
        tags: ['Website', 'Brand'],
        href: 'https://yantrava.com/',
        status: 'LIVE',
        tone: 'yantrava',
      },
    ],
  },

  approach: {
    tag: 'HOW I WORK',
    ariaLabel: 'Approach',
    headlinePlain: 'A systems thinker with a ',
    headlineItalic: 'craft obsession',
    columns: [
      {
        title: 'Systems before screens',
        body: 'Every screen is downstream of an operating model. I design the decision loop first; the UI is how it becomes visible.',
      },
      {
        title: 'Evidence over opinion',
        body: 'Claims come with numbers attached. If a design worked, something measurable moved.',
      },
      {
        title: 'I build my own tools',
        body: 'Eight Figma plugins run daily on production files, automating the audit work I refuse to do by hand.',
      },
      {
        title: 'Plain language',
        body: 'If a delivery partner reading slowly can’t trust the screen literally, the design is wrong, not the reader.',
      },
    ],
  },

  plugins: {
    tag: 'FIGMA PLUGINS I BUILT',
    subline: 'Eight plugins, run daily on production files.',
    /** Which two of site.toolkit.plugins get the big gradient cards. */
    featured: ['CLH STATE GENERATOR', 'CLH HANDOFF SPEC'],
    moreLabel: '+ 6 more in daily rotation',
    metaSuffix: 'Figma plugin',
  },

  /** "Things you won't find on my resume" (Shreyas Vyas ref): big uppercase
   *  prompts; hovering one expands a serif caption + photo strip. Photos are
   *  Pranita's to supply — missing files render as placeholder tiles. */
  beyondPixels: {
    tag: 'BEYOND PIXELS',
    ariaLabel: 'Things that are not on my resume',
    headline: [
      { text: 'Things that aren\u2019t on my ' },
      { text: 'resume', underline: true },
      { text: '.' },
    ] as HeadlineSegment[],
    subline: 'HR wouldn\u2019t know what to do with it.',
    items: [
      {
        prompt: 'MY QUALITY CONTROL TEAM:',
        caption: 'Two supervisors. Zero chill. Every screen ships past them first.',
        // qc-01..09 supplied by Manav 2026-08-16 (source: Figma- Assignment module/cats/,
        // gitignored staging). qc-05 includes Pranita herself — flagged for her OK.
        images: [
          '/beyond/cats.jpg',
          '/beyond/qc-01.jpg',
          '/beyond/qc-02.jpg',
          '/beyond/qc-03.jpg',
          '/beyond/qc-04.jpg',
          '/beyond/qc-05.jpg',
          '/beyond/qc-06.jpg',
          '/beyond/qc-07.jpg',
          '/beyond/qc-08.jpg',
          '/beyond/qc-09.jpg',
        ],
      },
      {
        prompt: 'WHERE MY MONEY ACTUALLY GOES:',
        caption: 'Placeholder: plants, cat treats, and fonts I did not need.',
        images: [],
      },
      {
        prompt: 'MY IDEA OF A BALANCED DIET:',
        caption: 'Placeholder: one healthy thing per takeaway order, minimum.',
        images: [],
      },
    ],
    placeholderNote: 'photo soon :)',
  },

  writing: {
    tag: 'INDEPENDENT WRITING',
  },

  contact: {
    tag: 'SAY HELLO',
    headline: [
      { text: 'Let’s cook something ' },
      { text: 'together', underline: true },
      { text: '.' },
    ] as HeadlineSegment[],
    subline: 'Open to product design roles and selected consulting.',
    emailCta: 'Write to me',
    signoff: 'Designed with care. Built with intent.',
  },
}
