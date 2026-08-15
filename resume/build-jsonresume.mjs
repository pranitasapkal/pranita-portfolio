#!/usr/bin/env node
/**
 * resume/build-jsonresume.mjs
 * Converts content/resume.json → JSON Resume schema (jsonresume.org) so it can
 * be imported into Reactive Resume (which reads JSON Resume). Meesho's grouped
 * `projects` become one work entry per product (position carries the product
 * name) so the 3-product story survives import; prior roles map 1:1.
 * Run: node resume/build-jsonresume.mjs
 * Output: public/resume/pranita-sapkal.jsonresume.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'content/resume.json'), 'utf8'));
const outDir = resolve(root, 'public/resume');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'pranita-sapkal.jsonresume.json');

const { meta, summary, experience, skills, education, languages } = data;
const keep = b => b.priority <= 2 && !b.text.startsWith('TODO');
const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
const toISO = s => {
  if (!s || s === 'Present') return '';
  const [mon, yr] = s.split(' ');
  return MONTHS[mon] ? `${yr}-${MONTHS[mon]}` : (yr || mon || '');
};
const productLabel = name => name.includes(': ') ? `${name.replace(': ', ' (')})` : name;
const httpize = u => (u && !/^https?:\/\//.test(u) ? `https://${u}` : u);

// ── basics ──
const [city] = meta.location.split(',');
const profiles = [];
const netName = { linkedin: 'LinkedIn', behance: 'Behance', dribbble: 'Dribbble', medium: 'Medium' };
for (const [k, v] of Object.entries(meta.links)) {
  if (!v || k === 'portfolio') continue;
  profiles.push({ network: netName[k] || k, username: v.split('/').pop(), url: httpize(v) });
}
const basics = {
  name: meta.name,
  label: meta.role,
  email: meta.email,
  phone: meta.phone,
  url: httpize(meta.links.portfolio || ''),
  summary,
  location: { city: (city || '').trim(), region: 'Karnataka', countryCode: 'IN' },
  profiles,
};

// ── work (Meesho projects → one entry per product; prior roles 1:1) ──
const work = [];
for (const job of experience) {
  const startDate = toISO(job.start);
  const endDate = toISO(job.end);
  if (Array.isArray(job.projects)) {
    for (const p of job.projects) {
      const hs = p.bullets.filter(keep).map(b => b.text);
      if (!hs.length) continue;
      const note = p.note ? ` — ${p.note}` : '';
      work.push({
        name: job.org,
        position: `${job.title}, ${productLabel(p.name)}${note}`,
        startDate, endDate,
        highlights: hs,
      });
    }
  } else {
    work.push({
      name: job.org,
      position: job.title,
      startDate, endDate,
      highlights: (job.bullets || []).filter(keep).map(b => b.text),
    });
  }
}

// ── projects (independent) ──
const projects = (data.independent_projects || []).map(p => ({
  name: p.name,
  description: p.text,
  url: httpize(p.url || ''),
  highlights: [p.text],
}));

// ── skills / education / languages ──
const skillsArr = Object.entries(skills).map(([name, keywords]) => ({ name, keywords }));
const educationArr = education.map(e => {
  const [s, en] = e.years.split('–');
  return {
    institution: e.school,
    studyType: e.degree,
    area: '',
    startDate: (s || '').trim(),
    endDate: (en || '').trim(),
    score: e.note || '',
  };
});
const languagesArr = languages.map(l => {
  const m = l.match(/^(.*?)\s*\((.*)\)$/);
  return m ? { language: m[1].trim(), fluency: m[2].trim() } : { language: l, fluency: '' };
});

const jsonResume = {
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics,
  work,
  projects,
  education: educationArr,
  skills: skillsArr,
  languages: languagesArr,
  meta: { canonical: '', version: 'v1.0.0', theme: 'onepage' },
};

writeFileSync(outPath, JSON.stringify(jsonResume, null, 2));
console.log('Wrote', outPath);
console.log(`  work entries: ${work.length}  ·  projects: ${projects.length}  ·  skills groups: ${skillsArr.length}`);
