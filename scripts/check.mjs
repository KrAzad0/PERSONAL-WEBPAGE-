import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const html = await readFile(resolve(output,'index.html'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const unique = new Set(ids);
if (ids.length !== unique.size) throw new Error('Duplicate IDs found in generated HTML.');
const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match=>match[1]);
for (const ref of refs) {
  if (ref.startsWith('#')) {
    if (!unique.has(ref.slice(1))) throw new Error(`Missing anchor: ${ref}`);
  } else if (!/^(https:|mailto:|data:)/.test(ref)) {
    if (ref.startsWith('/') || ref.includes('..')) throw new Error(`Use project-relative paths for GitHub Pages: ${ref}`);
    await access(resolve(output,ref));
  }
}
if (!html.includes('<html lang="en">') || !html.includes('name="viewport"')) throw new Error('Missing language or mobile viewport.');
if ((html.match(/<h1\b/g)||[]).length !== 1) throw new Error('The page needs exactly one h1.');
if (/<(?:img)\b(?![^>]*\balt=)/.test(html)) throw new Error('An image has no alt attribute.');
if (/\{\{|TODO|lorem ipsum|href="#"/i.test(html)) throw new Error('Placeholder content found.');
for (const tag of html.matchAll(/<a\b[^>]+target="_blank"[^>]*>/g)) {
  if (!/rel="[^"]*noopener/.test(tag[0])) throw new Error('External new-tab link is missing noopener.');
}
const count = (html.match(/class="project-card/g)||[]).length;
const projects = JSON.parse(await readFile(resolve(root,'content/projects.json'),'utf8'));
if (count !== projects.length) throw new Error('Not all project content was rendered.');
await readdir(resolve(output,'assets'));
console.log(`Checked ${count} projects, ${ids.length} unique anchors, local assets, metadata, and external-link safety.`);
