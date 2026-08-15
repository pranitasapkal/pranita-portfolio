#!/usr/bin/env node
/**
 * resume/build-docx.mjs
 * Builds an ATS-clean .docx from content/resume.json — single column, real
 * Word paragraph structure, native bullet lists, standard fonts. No tables,
 * no text boxes, no columns (all of which break ATS parsers).
 * Run: node resume/build-docx.mjs
 * Output: public/resume/pranita-sapkal-resume-ats.docx
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun, BorderStyle } from 'docx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'content/resume.json'), 'utf8'));
const outDir = resolve(root, 'public/resume');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'pranita-sapkal-resume.docx');

const { meta, summary, experience, skills, education, languages } = data;
const FONT = 'Calibri';
const keep = b => b.priority <= 2 && !b.text.startsWith('TODO');

const children = [];

// ── Header ──
children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: meta.name, bold: true, size: 36, font: FONT })] }));
children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: meta.role, size: 22, font: FONT })] }));
children.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: `${meta.email}  |  ${meta.phone}  |  ${meta.location}`, size: 18, font: FONT })] }));
const linksText = Object.entries(meta.links).filter(([, v]) => v)
  .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`).join('  |  ');
if (linksText) children.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: linksText, size: 16, color: '444444', font: FONT })] }));

// ── Helpers ──
const heading = text => new Paragraph({
  spacing: { before: 200, after: 80 },
  border: { bottom: { color: '000000', style: BorderStyle.SINGLE, size: 6, space: 1 } },
  children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: FONT })],
});
const bullet = text => new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text, size: 20, font: FONT })] });

// ── Summary ──
children.push(heading('Summary'));
children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: summary, size: 20, font: FONT })] }));

// ── Experience ──
children.push(heading('Professional Experience'));
for (const job of experience) {
  const locNote = (job.location === 'Remote' && !job.title.includes('Remote')) ? ' (Remote)' : '';
  children.push(new Paragraph({
    spacing: { before: 140, after: 0 },
    children: [
      new TextRun({ text: job.org, bold: true, size: 21, font: FONT }),
      new TextRun({ text: `, ${job.title}${locNote}`, size: 21, font: FONT }),
    ],
  }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${job.start} – ${job.end}`, italics: true, size: 18, color: '444444', font: FONT })] }));

  if (Array.isArray(job.projects)) {
    for (const p of job.projects) {
      const bs = p.bullets.filter(keep);
      if (!bs.length) continue;
      const label = p.note ? `${p.name} (${p.note})` : p.name;
      children.push(new Paragraph({ spacing: { before: 60, after: 20 }, children: [new TextRun({ text: label, bold: true, size: 20, font: FONT })] }));
      bs.forEach(b => children.push(bullet(b.text)));
    }
  } else {
    (job.bullets || []).filter(keep).forEach(b => children.push(bullet(b.text)));
  }
}

// ── Independent Projects ──
if (Array.isArray(data.independent_projects) && data.independent_projects.length) {
  children.push(heading('Independent Projects'));
  for (const p of data.independent_projects) {
    children.push(new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: p.name, bold: true, size: 20, font: FONT }),
        ...(p.url ? [new TextRun({ text: ` (${p.url})`, size: 20, color: '444444', font: FONT })] : []),
        new TextRun({ text: `: ${p.text}`, size: 20, font: FONT }),
      ],
    }));
  }
}

// ── Skills ──
children.push(heading('Skills'));
for (const [g, items] of Object.entries(skills)) {
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({ text: `${g}: `, bold: true, size: 20, font: FONT }),
      new TextRun({ text: items.join(', '), size: 20, font: FONT }),
    ],
  }));
}

// ── Education ──
children.push(heading('Education'));
for (const e of education) {
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({ text: e.degree, bold: true, size: 20, font: FONT }),
      new TextRun({ text: `, ${e.school} (${e.years})${e.note ? `, ${e.note}` : ''}`, size: 20, font: FONT }),
    ],
  }));
}
children.push(new Paragraph({
  spacing: { before: 80 },
  children: [
    new TextRun({ text: 'Languages: ', bold: true, size: 20, font: FONT }),
    new TextRun({ text: languages.join(', '), size: 20, font: FONT }),
  ],
}));

// ── Assemble ──
const doc = new Document({
  creator: meta.name,
  title: `${meta.name} — Resume`,
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
    children,
  }],
});

const buf = await Packer.toBuffer(doc);
writeFileSync(outPath, buf);
console.log('Wrote', outPath, `(${buf.length} bytes)`);
