#!/usr/bin/env node
/**
 * resume/build-svg.mjs
 * Renders content/resume.json into TWO Figma-importable A4 page SVGs in the
 * "muazz1m" red/white two-column template (960x1358 each, Poppins, #DE1D3E).
 *   Page 1: header (name/role/summary/contact/photo) + Professional Experience
 *           (Meesho) + right sidebar (Skills & Competencies / Tools / Languages).
 *   Page 2: remaining roles + Education + Independent Projects.
 * Everything is real <text>/<rect>/<path> with named ids => editable in Figma
 * (no outlined paths, no <image>). Photo is a labeled placeholder on page 1.
 * Run: node resume/build-svg.mjs
 *   -> public/resume/pranita-sapkal-resume-page1.svg  (+ -page2.svg)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'content/resume.json'), 'utf8'));
const outDir = resolve(root, 'public/resume');
mkdirSync(outDir, { recursive: true });

const RED = '#DE1D3E', DARK = '#333333', BODY = '#616161', MUTED = 'rgba(51,51,51,0.5)', PANEL = 'rgba(222,29,62,0.02)';
const FONT = 'Poppins, sans-serif';
const PAGE_W = 960, PAGE_H = 1358;
const LX = 39, LW = 533, RXX = 608, REDGE = 921, RW = REDGE - RXX;
const keep = b => b.priority <= 2 && !b.text.startsWith('TODO');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wrap = (str, max) => { const w = str.split(/\s+/), L = []; let c = ''; for (const x of w) { if (!c) c = x; else if ((c + ' ' + x).length <= max) c += ' ' + x; else { L.push(c); c = x; } } if (c) L.push(c); return L; };
const maxChars = (px, size) => Math.max(6, Math.floor(px / (size * 0.53)));

const lineEl = (x, y, str, { size = 14, weight = 400, fill = DARK, anchor = 'start', id } = {}) =>
  `<text ${id ? `id="${id}" ` : ''}x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}>${esc(str)}</text>`;

const paraEl = (x, y, str, { size = 14, weight = 400, fill = DARK, width = LW, lh = 21, bullet = false, id } = {}) => {
  const indent = bullet ? 15 : 0;
  const ls = wrap(str, maxChars(width - indent, size));
  const ts = ls.map((t, i) => (i === 0 && bullet)
    ? `<tspan x="${x}" dy="0">•  ${esc(t)}</tspan>`
    : `<tspan x="${x + indent}" dy="${i === 0 ? 0 : lh}">${esc(t)}</tspan>`).join('');
  return { svg: `<text ${id ? `id="${id}" ` : ''}x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${ts}</text>`, lines: ls.length };
};

const headerEl = (x, y, label) => ({
  svg: `<g id="header-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}"><text x="${x}" y="${y + 22}" font-family="${FONT}" font-size="20" font-weight="600" fill="${DARK}">${esc(label)}</text><rect x="${x}" y="${y + 34}" width="200" height="3" fill="${RED}"/></g>`,
  endY: y + 34 + 3 + 18,
});

// role block: handles Meesho `projects` (grouped) or flat `bullets` -> {svg:[], endY}
const roleBlock = (x, y, job) => {
  const s = [
    lineEl(x, y + 16, job.title, { size: 16, weight: 500, fill: DARK }),
    lineEl(x + LW, y + 13, `${job.start} – ${job.end}`, { size: 12, weight: 500, fill: MUTED, anchor: 'end' }),
    lineEl(x, y + 37, job.org, { size: 14, weight: 400, fill: RED }),
  ];
  let cy = y + 58;
  if (Array.isArray(job.projects)) {
    for (const p of job.projects) {
      const bs = p.bullets.filter(keep); if (!bs.length) continue;
      const note = p.note ? `  (${p.note})` : '';
      s.push(`<text x="${x}" y="${cy + 15}" font-family="${FONT}" font-size="14" font-weight="500" fill="${DARK}">${esc(p.name)}${note ? `<tspan fill="${RED}" font-weight="400">${esc(note)}</tspan>` : ''}</text>`);
      cy += 24;
      for (const b of bs) { const pr = paraEl(x, cy + 15, b.text, { bullet: true, width: LW }); s.push(pr.svg); cy += pr.lines * 21 + 4; }
      cy += 8;
    }
    cy += 8;
  } else {
    for (const b of (job.bullets || []).filter(keep)) { const pr = paraEl(x, cy + 15, b.text, { bullet: true, width: LW }); s.push(pr.svg); cy += pr.lines * 21 + 4; }
    cy += 18;
  }
  return { svg: s, endY: cy };
};

const iconEl = (y, d) => `<path transform="translate(730,${y})" d="${d}" fill="none" stroke="${RED}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
const IC = {
  mail: 'M1 3 h14 v10 h-14 z M1 3 l7 6 l7 -6',
  phone: 'M4 2 C3 2 2 3 2 4 C2 9 7 14 12 14 C13 14 14 13 14 12 L14 10 L10.5 9 L9.5 11 C7.5 10 6 8.5 5 6.5 L7 5.5 L6 2 Z',
  pin: 'M8 1 C5 1 3 3 3 6 C3 10 8 15 8 15 C8 15 13 10 13 6 C13 3 11 1 8 1 Z M8 4.5 A1.6 1.6 0 1 0 8.01 4.5',
  link: 'M6 9 A3 3 0 0 1 6 5 L8 3 A3 3 0 0 1 12 7 L11 8 M10 7 A3 3 0 0 1 10 11 L8 13 A3 3 0 0 1 4 9 L5 8',
};

const svgOpen = () => `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_W}" height="${PAGE_H}" viewBox="0 0 ${PAGE_W} ${PAGE_H}" fill="none">`;
const furniture = () => [
  `<style>@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap');</style>`,
  `<rect id="bg" x="0" y="0" width="${PAGE_W}" height="${PAGE_H}" fill="#FFFFFF"/>`,
  `<rect id="sidebar-panel" x="533" y="0" width="427" height="${PAGE_H}" fill="${PANEL}"/>`,
];

// ───────────────────────── PAGE 1 ─────────────────────────
const p1 = [svgOpen(), ...furniture()];
p1.push(`<g id="identity">`);
p1.push(`<rect id="accent-bar" x="39" y="71" width="120" height="3" fill="${RED}"/>`);
p1.push(lineEl(LX, 118, data.meta.name, { size: 30, weight: 600, fill: DARK, id: 'name' }));
p1.push(lineEl(LX, 143, data.meta.role, { size: 15, weight: 500, fill: RED, id: 'role' }));
const sum = paraEl(LX, 167, data.summary, { size: 14, width: 384, fill: BODY, id: 'summary' });
p1.push(sum.svg);
p1.push(`</g>`);
const summaryBottom = 167 + (sum.lines - 1) * 21;

p1.push(`<g id="photo-placeholder"><rect x="757" y="0" width="164" height="220" rx="6" fill="#C4C4C4"/><rect x="757" y="0" width="164" height="220" rx="6" fill="none" stroke="#9A9A9A" stroke-width="1.5" stroke-dasharray="6 5"/>${lineEl(839, 116, 'PHOTO', { size: 13, weight: 600, fill: '#7A7A7A', anchor: 'middle' })}</g>`);

const contacts = [
  { t: data.meta.email, ic: 'mail' }, { t: data.meta.phone, ic: 'phone' }, { t: data.meta.location, ic: 'pin' },
  { t: data.meta.links.linkedin, ic: 'link' }, { t: data.meta.links.behance, ic: 'link' },
  { t: data.meta.links.dribbble, ic: 'link' }, { t: data.meta.links.medium, ic: 'link' },
].filter(c => c.t);
p1.push(`<g id="contact">`);
contacts.forEach((c, i) => { const y = 97 + i * 31; p1.push(lineEl(720, y + 12, c.t, { size: 12, weight: 500, fill: BODY, anchor: 'end' })); p1.push(iconEl(y, IC[c.ic])); });
p1.push(`</g>`);
const contactBottom = 97 + contacts.length * 31;
const SECTION_TOP = Math.max(271, summaryBottom + 28, contactBottom + 20);

p1.push(`<g id="left-page1">`);
let ly = SECTION_TOP;
{ const h = headerEl(LX, ly, 'Professional Experience'); p1.push(h.svg); ly = h.endY; }
{ const rb = roleBlock(LX, ly, data.experience[0]); p1.push(...rb.svg); ly = rb.endY; }
p1.push(`</g>`);

p1.push(`<g id="right-page1">`);
let ry = SECTION_TOP;
const rightList = (title, items) => {
  const h = headerEl(RXX, ry, title); p1.push(h.svg); ry = h.endY;
  for (const it of items) { const pr = paraEl(RXX, ry + 15, it, { width: RW }); p1.push(pr.svg); ry += pr.lines * 21 + 10; }
  ry += 12;
};
rightList('Skills & Competencies', data.skills.Design);
rightList('Tools', data.skills.Tools);
{ const h = headerEl(RXX, ry, 'Languages'); p1.push(h.svg); ry = h.endY; }
const langs = data.languages.map(l => { const m = l.match(/^(.*?)\s*\((.*)\)$/); return m ? { name: m[1].trim(), prof: m[2].trim() } : { name: l, prof: 'Fluent' }; });
langs.forEach(lg => { p1.push(lineEl(RXX, ry + 16, lg.name, { size: 14, fill: '#000000' })); p1.push(lineEl(RXX, ry + 33, lg.prof.charAt(0).toUpperCase() + lg.prof.slice(1), { size: 12, fill: RED })); ry += 41; });
p1.push(`</g></svg>`);
writeFileSync(resolve(outDir, 'pranita-sapkal-resume-page1.svg'), p1.join('\n'));

// ───────────────────────── PAGE 2 ─────────────────────────
const p2 = [svgOpen(), ...furniture()];
p2.push(`<g id="left-page2">`);
let l2 = 64;
for (const job of data.experience.slice(1)) { const rb = roleBlock(LX, l2, job); p2.push(...rb.svg); l2 = rb.endY; }
{ const h = headerEl(LX, l2 + 4, 'Education'); p2.push(h.svg); l2 = h.endY; }
for (const e of data.education) {
  p2.push(lineEl(LX, l2 + 18, e.degree, { size: 16, weight: 500, fill: '#000000' }));
  p2.push(lineEl(LX + LW, l2 + 15, e.years, { size: 12, fill: MUTED, anchor: 'end' }));
  p2.push(lineEl(LX, l2 + 39, e.school, { size: 14, fill: RED }));
  l2 += 44;
  if (e.note) { p2.push(lineEl(LX, l2 + 14, e.note, { size: 12, fill: MUTED })); l2 += 20; }
  l2 += 16;
}
if ((data.independent_projects || []).length) {
  const h = headerEl(LX, l2 + 4, 'Independent Projects'); p2.push(h.svg); l2 = h.endY;
  for (const p of data.independent_projects) {
    p2.push(`<text x="${LX}" y="${l2 + 15}" font-family="${FONT}" font-size="14" font-weight="500" fill="${DARK}">${esc(p.name)}${p.url ? `<tspan fill="${RED}" font-weight="400">  ${esc(p.url)}</tspan>` : ''}</text>`);
    l2 += 22;
    const pr = paraEl(LX, l2 + 15, p.text, { bullet: true, width: LW }); p2.push(pr.svg); l2 += pr.lines * 21 + 14;
  }
}
p2.push(`</g></svg>`);
writeFileSync(resolve(outDir, 'pranita-sapkal-resume-page2.svg'), p2.join('\n'));

// remove the old single-file SVG so only the 2 page files remain
try { rmSync(resolve(outDir, 'pranita-sapkal-resume.svg')); } catch { /* already gone */ }

console.log('Wrote page1 + page2 SVGs to public/resume/');
console.log(`  page 1: left ends ${Math.ceil(ly)}/${PAGE_H}, right ends ${Math.ceil(ry)}/${PAGE_H}`);
console.log(`  page 2: content ends ${Math.ceil(l2)}/${PAGE_H}`);
if (ly > PAGE_H || ry > PAGE_H) console.log('  ⚠ PAGE 1 OVERFLOW');
if (l2 > PAGE_H) console.log('  ⚠ PAGE 2 OVERFLOW');
