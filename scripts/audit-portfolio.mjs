import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const siteIndex = path.join(root, 'index.html');
const html = fs.readFileSync(siteIndex, 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

function existsRelative(fromFile, relativePath) {
  const cleanPath = relativePath.split('#')[0].split('?')[0];
  if (!cleanPath) return true;
  return fs.existsSync(path.resolve(path.dirname(fromFile), cleanPath));
}

function extractSections() {
  const match = html.match(/const sections = ([\s\S]*?\n\]);/);
  if (!match) {
    fail('index.html: could not find portfolio sections data');
    return [];
  }

  const sandbox = {};
  vm.runInNewContext(`sections = ${match[1]}`, sandbox);
  return sandbox.sections || [];
}

function bodyTextLength(filePath) {
  const page = fs.readFileSync(filePath, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return page.length;
}

function localRefs(filePath) {
  const page = fs.readFileSync(filePath, 'utf8');
  const refs = [];
  for (const match of page.matchAll(/<(img|source|script|link|a)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)) {
    refs.push({ tag: match[1].toLowerCase(), ref: match[2] });
  }
  return refs;
}

const sections = extractSections();
const cards = sections.flatMap(section =>
  section.categories.flatMap(category =>
    category.cards.map(card => ({ section, category, card }))
  )
);

if (cards.length < 36) {
  fail(`index.html: expected at least 36 portfolio cards, found ${cards.length}`);
}

if (cards.some(({ card }) => card.demo.includes('tool-site-audit'))) {
  fail('index.html: tool-site-audit must not be registered in the public portfolio');
}

for (const { card } of cards) {
  const demoPath = path.resolve(root, card.demo);
  const thumbPath = path.resolve(root, card.thumb);
  if (!fs.existsSync(demoPath)) fail(`${card.title}: missing demo ${card.demo}`);
  if (!fs.existsSync(thumbPath)) fail(`${card.title}: missing thumbnail ${card.thumb}`);
  if (!card.code.startsWith('https://github.com/9mak/Portfolio/tree/main/')) {
    fail(`${card.title}: code URL must point to GitHub repository tree`);
  }
}

const htmlFiles = fs.readdirSync(root, { recursive: true })
  .filter(file => file.endsWith('index.html'))
  .map(file => path.join(root, file));

const publicCodeFiles = fs.readdirSync(root, { recursive: true })
  .filter(file => /\.(html|js)$/i.test(file))
  .filter(file => !file.startsWith('scripts/'))
  .map(file => path.join(root, file));

const thinAllowlist = new Set([
  'index.html'
]);

for (const filePath of htmlFiles) {
  const rel = path.relative(root, filePath);
  const page = fs.readFileSync(filePath, 'utf8');

  if (!/<meta\s+name=["']description["']/i.test(page)) {
    fail(`${rel}: missing meta description`);
  }

  if (!/Portfolio QA overflow guard/.test(page)) {
    fail(`${rel}: missing overflow guard`);
  }

  if (!/web-production\/part-ui-components\/index\.html$/.test(rel) && /\bhref=["']#["']/.test(page)) {
    fail(`${rel}: contains inert href="#" links`);
  }

  if (rel !== 'index.html' && /\bhref=["']#top["']/.test(page)) {
    fail(`${rel}: contains top-only href="#top" links`);
  }

  if (/<meta[^>]+content=["'][^"']*["']\s+[^=>\s]+(?:\s|>)/i.test(page)) {
    fail(`${rel}: may contain malformed meta content quoting`);
  }

  if (/images\.unsplash\.com/.test(page)) {
    fail(`${rel}: uses hotlinked Unsplash image URLs`);
  }

  const imageSources = [...page.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(match => match[1]);
  const thumbnailSources = imageSources.filter(src => src.includes('assets/images/thumbnails'));
  if (rel !== 'index.html' && thumbnailSources.length > 0) {
    fail(`${rel}: uses portfolio thumbnail as detail-page imagery (${thumbnailSources.join(', ')})`);
  }

  const repeatedThumbnailSources = new Set(thumbnailSources.filter((src, index) => thumbnailSources.indexOf(src) !== index));
  if (repeatedThumbnailSources.size > 0) {
    fail(`${rel}: repeats portfolio thumbnail as page imagery (${[...repeatedThumbnailSources].join(', ')})`);
  }

  const minChars = rel.includes('/part-') ? 180 : 220;
  if (!thinAllowlist.has(rel) && bodyTextLength(filePath) < minChars) {
    fail(`${rel}: visible text is too thin (${bodyTextLength(filePath)} chars, expected >= ${minChars})`);
  }

  for (const { tag, ref } of localRefs(filePath)) {
    if (/^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(ref)) continue;
    if (ref.includes('${')) continue;
    if (tag === 'link' && !/\.(css|ico|png|jpg|jpeg|webp|svg)$/i.test(ref)) continue;
    if (!existsRelative(filePath, ref)) {
      fail(`${rel}: missing local ${tag} reference ${ref}`);
    }
  }
}

for (const filePath of publicCodeFiles) {
  const rel = path.relative(root, filePath);
  const page = fs.readFileSync(filePath, 'utf8');
  const forbidden = [
    [/https:\/\/api\.openai\.com/i, 'direct OpenAI API call'],
    [/https:\/\/api\.anthropic\.com/i, 'direct Anthropic API call'],
    [/https:\/\/newsapi\.org/i, 'direct News API call'],
    [/Authorization['"]?\s*:/i, 'Authorization header in public code'],
    [/x-api-key/i, 'x-api-key header in public code'],
    [/<input[^>]+id=["']api-key["']/i, 'public API key input'],
    [/localStorage\.(?:setItem|getItem)\(["'][^"']*(?:api-key|openai_api_key)/i, 'API key LocalStorage usage'],
    [/tool-site-audit/i, 'private site audit tool reference']
  ];

  for (const [pattern, reason] of forbidden) {
    if (pattern.test(page)) fail(`${rel}: ${reason}`);
  }
}

if (failures.length) {
  console.error(`Portfolio audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Portfolio audit passed: ${cards.length} cards and ${htmlFiles.length} HTML pages checked.`);
