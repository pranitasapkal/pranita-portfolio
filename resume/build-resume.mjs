#!/usr/bin/env node
/**
 * resume/build-resume.mjs
 * Builds designed + ATS resume PDFs from content/resume.json.
 * Run:  node resume/build-resume.mjs   (or  npm run build:resume)
 *
 * The Meesho role uses a `projects` array (grouped blocks with sub-headers);
 * every other role uses a flat `bullets` array. Both are rendered.
 *
 * Outputs:
 *   resume/designed.html             — print-adapted HTML (designed version)
 *   resume/ats.html                  — ATS-clean HTML
 *   public/resume/pranita-sapkal-resume.pdf
 *   public/resume/pranita-sapkal-resume-ats.pdf
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');

// ── Data ──────────────────────────────────────────────────────────────────────
const data = JSON.parse(readFileSync(resolve(root, 'content/resume.json'), 'utf8'));

// ── Paths ─────────────────────────────────────────────────────────────────────
const outDir      = resolve(root, 'public/resume');
mkdirSync(outDir, { recursive: true });

const designedHtml = resolve(__dirname, 'designed.html');
const atsHtml      = resolve(__dirname, 'ats.html');
const designedPdf  = resolve(outDir, 'pranita-sapkal-resume.pdf');
const atsPdf       = resolve(outDir, 'pranita-sapkal-resume-ats.pdf');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ── Absolute font file:// URLs ────────────────────────────────────────────────
const F = {
  archivo:  `file://${root}/node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2`,
  archivoW: `file://${root}/node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2`,
  mono400:  `file://${root}/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2`,
  mono500:  `file://${root}/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2`,
  serif:    `file://${root}/node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2`,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Filter bullets: keep priority <= maxPri, drop any starting with "TODO". */
function filterBullets(bullets, maxPri) {
  return (bullets || []).filter(b => b.priority <= maxPri && !b.text.startsWith('TODO'));
}

// ── DESIGNED VERSION ──────────────────────────────────────────────────────────
function buildDesigned() {
  const { meta, summary, experience, skills, education, languages } = data;

  // Photo only if a real file is present — no placeholder box.
  const photoFile = resolve(__dirname, 'photo.jpg');
  const photoHtml = existsSync(photoFile)
    ? `<img class="photo" src="file://${photoFile}" alt="${esc(meta.name)}">`
    : '';

  // Experience — supports grouped `projects` (Meesho) and flat `bullets` (rest).
  const expHtml = experience
    .map(job => {
      const loc = (job.location === 'Remote' && !job.title.includes('Remote')) ? ' <span class="jloc">· Remote</span>' : '';
      const head = `<div class="jh">
    <div class="jmeta"><span class="jorg">${esc(job.org)}</span><span class="jsep"> · </span><span class="jtitle">${esc(job.title)}</span>${loc}</div>
    <span class="jdates">${esc(job.start)} – ${esc(job.end)}</span>
  </div>${job.roleLine ? `\n  <p class="jrole">${esc(job.roleLine)}</p>` : ''}`;

      if (Array.isArray(job.projects)) {
        const projHtml = job.projects.map(p => {
          const bs = filterBullets(p.bullets, 2);
          if (!bs.length) return '';
          const note = p.note ? ` <span class="pnote">${esc(p.note)}</span>` : '';
          return `<div class="proj">
    <div class="ph"><span class="pname">${esc(p.name)}</span>${note}</div>
    <ul>${bs.map(b => `<li>${esc(b.text)}</li>`).join('')}</ul>
  </div>`;
        }).filter(Boolean).join('\n');
        if (!projHtml) return '';
        return `<div class="job">\n  ${head}\n  ${projHtml}\n</div>`;
      }

      const bullets = filterBullets(job.bullets, 2);
      if (!bullets.length) return '';
      return `<div class="job">
  ${head}
  <ul>${bullets.map(b => `<li>${esc(b.text)}</li>`).join('')}</ul>
</div>`;
    })
    .filter(Boolean)
    .join('\n');

  const skillsHtml = Object.entries(skills)
    .map(([g, items]) =>
      `<div class="sr"><span class="slabel">${esc(g)}</span><span class="sitems">${items.map(esc).join(', ')}</span></div>`
    )
    .join('\n');

  const eduHtml = education
    .map(e =>
      `<div class="edu">
  <strong>${esc(e.degree)}</strong>${e.note ? ` <span class="enote">${esc(e.note)}</span>` : ''}<br>
  <span class="eschool">${esc(e.school)}</span> <span class="eyrs">${esc(e.years)}</span>
</div>`
    )
    .join('\n');

  // Contact lines (right column, mono) — skip any empty link.
  const contactLines = [
    meta.email,
    meta.phone,
    meta.links.linkedin,
    meta.links.behance,
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(meta.name)} — Product Designer</title>
<style>
@font-face { font-family: 'Archivo Variable'; font-style: normal; font-weight: 100 900; src: url('${F.archivo}') format('woff2'); }
@font-face { font-family: 'Archivo Expanded'; font-style: normal; font-weight: 400; font-stretch: 75% 125%; src: url('${F.archivoW}') format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 400; src: url('${F.mono400}') format('woff2'); }
@font-face { font-family: 'IBM Plex Mono'; font-style: normal; font-weight: 500; src: url('${F.mono500}') format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-style: italic; font-weight: 400; src: url('${F.serif}') format('woff2'); }

@page { size: A4; margin: 13mm 14mm; }

*, ::before, ::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --ink:    #16181D;
  --muted:  #565B66;
  --accent: #B87514;
  --paper:  #F4F1EA;
  --rule:   rgba(22, 24, 29, 0.15);
}

html, body {
  background: var(--paper);
  color: var(--ink);
  font-family: 'Archivo Variable', Arial, sans-serif;
  font-size: 9.5pt;
  line-height: 1.36;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.hdr {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6mm;
  padding-bottom: 3.5mm;
  border-bottom: 0.4px solid var(--rule);
  margin-bottom: 3mm;
}
.hleft { flex: 1; min-width: 0; }
.name {
  font-family: 'Archivo Expanded', 'Archivo Variable', sans-serif;
  font-weight: 900; font-size: 30pt; font-stretch: expanded;
  letter-spacing: -0.015em; text-transform: uppercase;
  line-height: 0.95; color: var(--ink); margin-bottom: 2.5mm;
}
.role {
  font-family: 'IBM Plex Mono', monospace; font-weight: 400; font-size: 7pt;
  color: var(--muted); text-transform: uppercase; letter-spacing: 0.09em;
}
.hright { display: flex; flex-direction: column; align-items: flex-end; gap: 2mm; flex-shrink: 0; }
.photo { width: 28mm; height: 28mm; object-fit: cover; display: block; }
.contact {
  font-family: 'IBM Plex Mono', monospace; font-size: 7.5pt;
  color: var(--muted); text-align: right; line-height: 1.7;
}

.lead { margin-bottom: 3mm; }
.lead-line {
  display: block; font-family: 'Instrument Serif', Georgia, serif; font-style: italic;
  font-size: 11pt; line-height: 1.3; color: var(--ink); margin-bottom: 1.5mm;
}
.summary { font-size: 8.5pt; color: var(--muted); line-height: 1.45; }

.sec { margin-bottom: 3mm; }
.sh {
  font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 7pt;
  letter-spacing: 0.13em; text-transform: uppercase; color: var(--accent);
  border-bottom: 0.4px solid var(--rule); padding-bottom: 0.8mm; margin-bottom: 2mm;
}

.job { margin-bottom: 3mm; }
.job:last-child { margin-bottom: 0; }
.jh { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.8mm; }
.jmeta { flex: 1; font-size: 9pt; min-width: 0; }
.jorg  { font-weight: 700; }
.jsep  { color: rgba(22, 24, 29, 0.3); }
.jtitle, .jloc { color: var(--muted); }
.jdates {
  font-family: 'IBM Plex Mono', monospace; font-size: 7pt; color: var(--muted);
  white-space: nowrap; flex-shrink: 0; margin-left: 3mm;
}
.jrole { font-size: 8.3pt; color: var(--muted); font-style: italic; margin: 0 0 1.4mm 0; }

/* Grouped project blocks (Meesho) */
.proj { margin-bottom: 2mm; }
.proj:last-child { margin-bottom: 0; }
.ph { margin-bottom: 0.6mm; }
.pname { font-weight: 700; font-size: 8.9pt; color: var(--ink); }
.pnote {
  font-family: 'IBM Plex Mono', monospace; font-size: 6.6pt; color: var(--accent);
  text-transform: uppercase; letter-spacing: 0.06em; margin-left: 1.6mm;
}

ul { list-style: none; padding-left: 2mm; }
li { font-size: 9pt; line-height: 1.34; padding-left: 3mm; position: relative; margin-bottom: 0.5mm; }
li::before { content: '\\2013'; position: absolute; left: 0; color: var(--accent); }

.sr { display: flex; gap: 2.5mm; align-items: baseline; margin-bottom: 1.2mm; }
.slabel {
  font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 7pt;
  color: var(--accent); letter-spacing: 0.07em; text-transform: uppercase;
  white-space: nowrap; min-width: 26mm; flex-shrink: 0;
}
.sitems { font-size: 8.5pt; color: var(--muted); line-height: 1.35; }

.edu-row { display: flex; gap: 4mm; flex-wrap: wrap; margin-bottom: 1.5mm; }
.edu { flex: 1; min-width: 78mm; font-size: 9pt; line-height: 1.4; }
.enote  { color: var(--muted); font-size: 8pt; }
.eschool { color: var(--muted); font-size: 8.5pt; }
.eyrs   { font-family: 'IBM Plex Mono', monospace; font-size: 7.5pt; color: var(--muted); }
.langs  { font-family: 'IBM Plex Mono', monospace; font-size: 7.5pt; color: var(--muted); }

.foot {
  border-top: 0.4px solid var(--rule); margin-top: 3mm; padding-top: 1.5mm;
  display: flex; justify-content: space-between;
  font-family: 'IBM Plex Mono', monospace; font-size: 7pt; color: var(--muted);
}

@media print {
  html, body { width: auto; }
  .proj { page-break-inside: avoid; }
  .sr   { page-break-inside: avoid; }
}
</style>
</head>
<body>

<header class="hdr">
  <div class="hleft">
    <div class="name">${esc(meta.name)}</div>
    <div class="role">${esc(meta.roleLine)}</div>
  </div>
  <div class="hright">
    ${photoHtml}
    <div class="contact">${contactLines.map(l => `<div>${esc(l)}</div>`).join('')}</div>
  </div>
</header>

<div class="lead">
  <span class="lead-line">I design the systems that move things.</span>
  <p class="summary">${esc(summary)}</p>
</div>

<div class="sec">
  <div class="sh">01 / Experience</div>
  ${expHtml}
</div>

<div class="sec">
  <div class="sh">02 / Skills</div>
  ${skillsHtml}
</div>

<div class="sec">
  <div class="sh">03 / Education</div>
  <div class="edu-row">${eduHtml}</div>
  <div class="langs">Languages · ${languages.map(esc).join(' · ')}</div>
</div>

<footer class="foot">
  <span>PRANITA SAPKAL — PRODUCT DESIGNER</span>
  <span>Updated Jul 2026</span>
</footer>

</body>
</html>`;
}

// ── ATS VERSION ───────────────────────────────────────────────────────────────
function buildATS() {
  const { meta, summary, experience, skills, education, languages } = data;

  const expHtml = experience
    .map(job => {
      const locNote = (job.location === 'Remote' && !job.title.includes('Remote')) ? ' (Remote)' : '';
      const head = `<p class="jh"><strong>${esc(job.org)}</strong> &mdash; ${esc(job.title)}${esc(locNote)}</p>
  <p class="dates">${esc(job.start)} &ndash; ${esc(job.end)}</p>`;

      if (Array.isArray(job.projects)) {
        const projHtml = job.projects.map(p => {
          const bs = filterBullets(p.bullets, 2);
          if (!bs.length) return '';
          const label = p.note ? `${p.name} (${p.note})` : p.name;
          return `<p class="proj-name"><strong>${esc(label)}</strong></p>
  <ul>${bs.map(b => `<li>${esc(b.text)}</li>`).join('')}</ul>`;
        }).filter(Boolean).join('\n');
        if (!projHtml) return '';
        return `<div class="job">\n  ${head}\n  ${projHtml}\n</div>`;
      }

      const bullets = filterBullets(job.bullets, 2);
      if (!bullets.length) return '';
      return `<div class="job">
  ${head}
  <ul>${bullets.map(b => `<li>${esc(b.text)}</li>`).join('')}</ul>
</div>`;
    })
    .filter(Boolean)
    .join('\n');

  const skillsText = Object.entries(skills)
    .map(([g, items]) => `${g}: ${items.join(', ')}`)
    .join('\n');

  const eduHtml = education
    .map(e =>
      `<p><strong>${esc(e.degree)}</strong> &mdash; ${esc(e.school)} (${esc(e.years)})${e.note ? `, ${esc(e.note)}` : ''}</p>`
    )
    .join('\n');

  const linksText = Object.entries(meta.links)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join('  |  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(meta.name)} &mdash; Resume</title>
<style>
@page { size: A4; margin: 18mm; }
*, ::before, ::after { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Helvetica, Arial, sans-serif; font-size: 10.5pt; color: #000; background: #fff; line-height: 1.45; }
h1   { font-size: 20pt; font-weight: bold; margin-bottom: 3pt; }
.role { font-size: 11pt; margin-bottom: 4pt; }
.contact { font-size: 9.5pt; margin-bottom: 4pt; }
.links   { font-size: 9pt;   margin-bottom: 12pt; color: #333; }
h2 { font-size: 12pt; font-weight: bold; border-bottom: 1px solid #000; margin: 12pt 0 6pt; padding-bottom: 2pt; }
.job    { margin-bottom: 9pt; }
.jh     { font-size: 10.5pt; font-weight: normal; margin-bottom: 1pt; }
.dates  { font-size: 9.5pt; color: #444; margin-bottom: 3pt; }
.proj-name { font-size: 10pt; margin: 5pt 0 1pt; }
ul      { padding-left: 18pt; margin-top: 2pt; }
li      { font-size: 10pt; line-height: 1.4; margin-bottom: 2pt; }
.skills-text { font-size: 10pt; line-height: 1.55; white-space: pre-line; }
.edu p  { font-size: 10pt; margin-bottom: 5pt; }
.lang   { margin-top: 8pt; font-size: 10pt; }
</style>
</head>
<body>

<h1>${esc(meta.name)}</h1>
<div class="role">${esc(meta.role)}</div>
<div class="contact">${esc(meta.email)} | ${esc(meta.phone)} | ${esc(meta.location)}</div>
<div class="links">${esc(linksText)}</div>

<h2>Summary</h2>
<p style="font-size:10pt;line-height:1.5">${esc(summary)}</p>

<h2>Professional Experience</h2>
${expHtml}

<h2>Skills</h2>
<div class="skills-text">${esc(skillsText)}</div>

<h2>Education</h2>
<div class="edu">
${eduHtml}
</div>
<div class="lang">Languages: ${languages.map(esc).join(', ')}</div>

</body>
</html>`;
}

// ── Write HTML files ──────────────────────────────────────────────────────────
console.log('Generating HTML templates...');
writeFileSync(designedHtml, buildDesigned(), 'utf8');
console.log('  wrote:', designedHtml);
writeFileSync(atsHtml, buildATS(), 'utf8');
console.log('  wrote:', atsHtml);

// ── Print to PDF via headless Chrome ─────────────────────────────────────────
function printToPdf(htmlPath, pdfPath) {
  const fileUrl = `file://${htmlPath}`;
  const args = [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--allow-file-access-from-files',
    '--disable-web-security',
    `--print-to-pdf=${pdfPath}`,
    fileUrl,
  ];
  console.log(`\nPrinting PDF: ${pdfPath}`);
  try {
    execSync(`"${CHROME}" ${args.map(a => a.includes(' ') || a.includes('://') ? `"${a}"` : a).join(' ')}`, {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 90_000,
    });
    console.log('  OK:', pdfPath);
  } catch (err) {
    console.error('  FAILED:', err.message);
    process.exit(1);
  }
}

printToPdf(designedHtml, designedPdf);
printToPdf(atsHtml, atsPdf);

console.log('\nComplete.');
console.log('  Designed:', designedPdf);
console.log('  ATS:     ', atsPdf);
