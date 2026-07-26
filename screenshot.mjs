import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = `file://${__dirname}`;
const OUT = path.join(__dirname, 'assets', 'images', 'thumbnails');

fs.mkdirSync(OUT, { recursive: true });

const pages = [
  // Web Production - LP
  { id: 'lp-camera-koei',         path: 'web-production/lp-camera-koei/index.html' },
  { id: 'lp-pottery-exhibition',  path: 'web-production/lp-pottery-exhibition/index.html' },
  { id: 'lp-kominka-cafe',        path: 'web-production/lp-kominka-cafe/index.html' },
  { id: 'lp-bonfire-gear',        path: 'web-production/lp-bonfire-gear/index.html' },
  { id: 'lp-night-radio',         path: 'web-production/lp-night-radio/index.html' },
  { id: 'lp-midnight-cafe',       path: 'web-production/lp-midnight-cafe/index.html' },
  // Web Production - SITE
  { id: 'site-tech-company',      path: 'web-production/site-tech-company/index.html' },
  { id: 'site-letterpress-corp',  path: 'web-production/site-letterpress-corp/index.html' },
  { id: 'site-mountain-guide',    path: 'web-production/site-mountain-guide/index.html' },
  { id: 'site-retro-sento',       path: 'web-production/site-retro-sento/index.html' },
  { id: 'site-old-bookstore',     path: 'web-production/site-old-bookstore/index.html' },
  { id: 'site-closed-school',     path: 'web-production/site-closed-school/index.html' },
  // Web Production - EC
  { id: 'ec-coffee-shop',         path: 'web-production/ec-coffee-shop/index.html' },
  { id: 'ec-leather-shoes',       path: 'web-production/ec-leather-shoes/index.html' },
  { id: 'ec-organic-vege',        path: 'web-production/ec-organic-vege/index.html' },
  { id: 'ec-mineral-specimen',    path: 'web-production/ec-mineral-specimen/index.html' },
  { id: 'ec-fermented-miso',      path: 'web-production/ec-fermented-miso/index.html' },
  { id: 'ec-midnight-bakery',     path: 'web-production/ec-midnight-bakery/index.html' },
  // Web Production - PARTS
  { id: 'part-ui-components',     path: 'web-production/part-ui-components/index.html' },
  { id: 'part-ink-input',         path: 'web-production/part-ink-input/index.html' },
  { id: 'part-hanko-action',      path: 'web-production/part-hanko-action/index.html' },
  { id: 'part-analog-record',     path: 'web-production/part-analog-record/index.html' },
  { id: 'part-shoji-modal',       path: 'web-production/part-shoji-modal/index.html' },
  { id: 'part-cassette-tape',     path: 'web-production/part-cassette-tape/index.html' },
  // System Development - APP
  { id: 'app-pomodoro-timer',     path: 'system-development/app-pomodoro-timer/index.html' },
  { id: 'app-task-manager',       path: 'system-development/app-task-manager/index.html' },
  { id: 'app-expense-tracker',    path: 'system-development/app-expense-tracker/index.html' },
  // System Development - TOOL
  { id: 'tool-image-optimizer',   path: 'system-development/tool-image-optimizer/index.html' },
  { id: 'tool-csv-processor',     path: 'system-development/tool-csv-processor/index.html' },
  { id: 'tool-url-shortener',     path: 'system-development/tool-url-shortener/index.html' },
  // System Development - AI
  { id: 'ai-writing-assistant',   path: 'system-development/ai-writing-assistant/index.html' },
  { id: 'ai-text-analyzer',       path: 'system-development/ai-text-analyzer/index.html' },
  { id: 'ai-photo-comedian',      path: 'system-development/ai-photo-comedian/index.html' },
  // System Development - API
  { id: 'api-weather-dashboard',  path: 'system-development/api-weather-dashboard/index.html' },
  { id: 'api-news-aggregator',    path: 'system-development/api-news-aggregator/index.html' },
  { id: 'api-github-profile',     path: 'system-development/api-github-profile/index.html' },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

for (const item of pages) {
  const url = `${BASE}/${item.path}`;
  const out = path.join(OUT, `${item.id}.jpg`);
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: out, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`✓ ${item.id}`);
  } catch (e) {
    console.warn(`✗ ${item.id}: ${e.message}`);
  }
}

await browser.close();
console.log('Done!');
