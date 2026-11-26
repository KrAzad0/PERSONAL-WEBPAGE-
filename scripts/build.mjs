import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJSON = async name => JSON.parse(await readFile(resolve(root, 'content', name), 'utf8'));
const profile = await readJSON('profile.json');
const projects = await readJSON('projects.json');
const categories = { quantum: 'Quantum physics', mathematics: 'Mathematics', 'open-source': 'Open learning' };
const statuses = { 'In development': 'development', Scoping: 'scoping', Study: 'study', Preprint: 'available', Available: 'available', Completed: 'available' };
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const requireText = (value, label) => { if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a nonempty string.`); };
const checkURL = (value, label) => {
  requireText(value, label);
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:') throw new Error(`${label} must use HTTPS.`);
  if (parsed.username || parsed.password) throw new Error(`${label} must not include credentials.`);
  return value;
};
const requireArray = (value, label) => { if (!Array.isArray(value) || !value.length) throw new Error(`${label} must be a nonempty array.`); };
for (const field of ['name','shortBio','about','email','availability','location','updated']) requireText(profile[field], `profile.${field}`);
if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(profile.email)) throw new Error('Please provide a valid public email address.');
if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.updated) || Number.isNaN(Date.parse(profile.updated))) throw new Error('profile.updated must use YYYY-MM-DD.');
for (const field of ['interests','education','training','skills','links']) requireArray(profile[field], `profile.${field}`);
requireArray(projects, 'projects');
const ids = new Set();
for (const project of projects) {
  for (const key of ['id','title','category','status','summary','progress','nextStep']) requireText(project[key], `project.${key}`);
  if (!/^[a-z][a-z0-9-]+$/.test(project.id) || ids.has(project.id)) throw new Error(`Project IDs must be unique lowercase slugs: ${project.id}`);
  ids.add(project.id);
  if (!Object.hasOwn(categories, project.category)) throw new Error(`Unknown category: ${project.category}`);
  if (!Object.hasOwn(statuses, project.status)) throw new Error(`Unknown status: ${project.status}`);
  if (typeof project.featured !== 'boolean') throw new Error(`featured must be true or false: ${project.id}`);
  requireArray(project.methods, `${project.id}.methods`);
  requireArray(project.links, `${project.id}.links`);
  project.methods.forEach(method => requireText(method, `${project.id}.method`));
  project.links.forEach(link => {requireText(link.label, `${project.id}.link label`); checkURL(link.url, `${project.id}.link URL`);});
}
if (projects.filter(project => project.featured).length > 1) throw new Error('Choose at most one featured project.');
for (const link of profile.links) { requireText(link.label, 'social label'); checkURL(link.url, 'social URL'); }
if (profile.cvUrl !== null && profile.cvUrl !== undefined) {
  requireText(profile.cvUrl, 'cvUrl');
  if (/^https:/.test(profile.cvUrl)) checkURL(profile.cvUrl, 'cvUrl');
  else if (!/^assets\/[a-zA-Z0-9._/-]+\.pdf$/.test(profile.cvUrl) || profile.cvUrl.includes('..')) throw new Error('cvUrl must be HTTPS or an assets/ PDF path.');
}
const cvUrl = profile.cvUrl || `mailto:${profile.email}?subject=CV%20request`;
const externalLink = link => `<a href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.label)}<span class="sr-only"> (opens in a new tab)</span></a>`;
const projectHTML = project => {
  const hasTorusArt = project.featured && project.id === 'toroidal-hydrogen';
  const body = `<div class="project-meta"><span class="project-category">${escape(categories[project.category])}</span><span class="status status-${statuses[project.status]}">${escape(project.status)}</span></div>
    <h3 id="${project.id}-title">${escape(project.title)}</h3>
    <p class="project-summary">${escape(project.summary)}</p>
    <ul class="project-methods" aria-label="Methods and tools">${project.methods.map(method => `<li>${escape(method)}</li>`).join('')}</ul>
    <details class="project-details"><summary>Progress &amp; next steps<span class="sr-only"> for ${escape(project.title)}</span></summary><p><strong>Current progress</strong>${escape(project.progress)}</p><p><strong>Next question</strong>${escape(project.nextStep)}</p></details>
    <div class="project-links">${project.links.map(externalLink).join('')}</div>`;
  return `<article class="project-card${project.featured ? ` featured${hasTorusArt ? '' : ' text-featured'}` : ''}" id="project-${project.id}" data-category="${project.category}" aria-labelledby="${project.id}-title">
    ${hasTorusArt ? `<div class="featured-art"><img src="assets/toroidal-geometry.svg" width="500" height="430" loading="lazy" alt="Schematic wireframe of a toroidal confinement geometry."><span class="featured-art-label">Toroidal confinement · Geometry schematic</span></div><div class="featured-body">${body}</div>` : project.featured ? `<div class="featured-body">${body}</div>` : body}
  </article>`;
};
const personJSON = JSON.stringify({ '@context':'https://schema.org', '@type':'Person', name:profile.name, description:profile.role, url:'https://krazad0.github.io/PERSONAL-WEBPAGE-/', email:`mailto:${profile.email}`, sameAs:profile.links.map(link=>link.url), knowsAbout:profile.interests.map(item=>item.title) }).replace(/</g, '\\u003c');
const values = {
  NAME: escape(profile.name), EMAIL: escape(profile.email), LOCATION: escape(profile.location), SHORT_BIO: escape(profile.shortBio), ABOUT: escape(profile.about), AVAILABILITY: escape(profile.availability), CV_URL: escape(cvUrl), CV_LABEL: profile.cvUrl ? 'View CV' : 'Request CV', CV_LABEL_LONG: profile.cvUrl ? 'View my current CV' : 'Request my current CV', PROJECT_COUNT: projects.length, PERSON_JSON: personJSON,
  UPDATED_DISPLAY: new Intl.DateTimeFormat('en-GB', { month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(profile.updated)),
  INTERESTS: profile.interests.map((interest,index)=>`<article class="interest"><span class="interest-symbol" aria-hidden="true">${['ψ','∇','ƒ'][index] || '∂'}</span><h3>${escape(interest.title)}</h3><p>${escape(interest.description)}</p></article>`).join('\n'),
  PROJECTS: [...projects].sort((a,b)=>Number(b.featured)-Number(a.featured)).map(projectHTML).join('\n'),
  EDUCATION: profile.education.map(item=>`<li><div class="education-line"><span>${escape(item.period)}</span><span class="education-state">${escape(item.status)}</span></div><h4>${escape(item.title)}</h4><p class="institution">${escape(item.institution)}</p><p class="education-detail">${escape(item.detail)}</p></li>`).join('\n'),
  TRAINING: profile.training.map(item=>`<li><h4>${escape(item.title)}</h4><p>${escape(item.institution)} · ${escape(item.year)}</p></li>`).join('\n'),
  SKILLS: profile.skills.map(group=>`<div class="skill-group"><h3>${escape(group.title)}</h3><ul>${group.items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul></div>`).join('\n'),
  SOCIAL_LINKS: profile.links.map(externalLink).join('\n')
};
let html = await readFile(resolve(root,'src/index.html'),'utf8');
html = html.replace(/\{\{([A-Z_]+)\}\}/g, (_,key) => {
  if (!Object.hasOwn(values,key)) throw new Error(`Unknown template token ${key}`);
  return values[key];
});
if (/\{\{/.test(html)) throw new Error('Unresolved template token.');
const output = resolve(root,'dist');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(resolve(root,'assets'),resolve(output,'assets'),{recursive:true});
await writeFile(resolve(output,'index.html'),html);
await cp(resolve(root,'src/styles.css'),resolve(output,'styles.css'));
await cp(resolve(root,'src/app.js'),resolve(output,'app.js'));
await writeFile(resolve(output,'.nojekyll'),'');
await writeFile(resolve(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://krazad0.github.io/PERSONAL-WEBPAGE-/sitemap.xml\n');
await writeFile(resolve(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://krazad0.github.io/PERSONAL-WEBPAGE-/</loc><lastmod>${profile.updated}</lastmod></url></urlset>\n`);
console.log(`Built ${projects.length} project entries and the academic profile into dist/.`);
