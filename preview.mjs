import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = `http://localhost:3456/index.html`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });

// Top of page (hero + about)
await page.screenshot({ path: path.join(__dirname, 'preview-top.jpg'), type: 'jpeg', quality: 85 });

// Scroll to filter bar + cards
await page.evaluate(() => window.scrollTo(0, 900));
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: path.join(__dirname, 'preview-filter.jpg'), type: 'jpeg', quality: 85 });

// Click LP filter and screenshot
await page.evaluate(() => window.scrollTo(0, 900));
await page.click('button[data-filter="LP"]');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: path.join(__dirname, 'preview-lp-filter.jpg'), type: 'jpeg', quality: 85 });

await browser.close();
console.log('Done');
