import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname, join } from 'path';

const PORT = 8765;
const BASE = `http://localhost:${PORT}`;
const delay = ms => new Promise(r => setTimeout(r, ms));

const server = createServer((req, res) => {
  let filePath = join('.', req.url === '/' ? 'index.html' : req.url);
  try {
    const data = readFileSync(filePath);
    const ext = extname(filePath);
    const mime = {
      '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
      '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(PORT);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

// Test specific games that might have issues
const testIds = ['dice', 'hilo', 'coinflip', 'dice-poker', 'slot', 'blackjack', 'tetris', 'minesweeper', 'game2048'];

console.log('Detailed debugging test\n');

for (const id of testIds) {
  console.log(`=== ${id} ===`);
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => { errors.push(err.message); });

  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
  await delay(300);

  await page.evaluate((gid) => Engine.loadGame(gid), id);
  await delay(3000);

  // Check what's in the DOM
  const info = await page.evaluate((gid) => {
    const pageEl = document.getElementById(`page-${gid}`);
    if (!pageEl) return { exists: false };
    return {
      exists: true,
      active: pageEl.classList.contains('active'),
      outerHTML_length: pageEl.outerHTML.length,
      innerHTML_length: pageEl.innerHTML.length,
      visible_children: Array.from(pageEl.children).filter(c => {
        const style = getComputedStyle(c);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }).length,
      classes: pageEl.className,
      game_table_exists: !!pageEl.querySelector('.game-table'),
      chips_exists: !!pageEl.querySelector('.chips'),
      controls_exists: !!pageEl.querySelector('.game-controls'),
      game_table_html: (pageEl.querySelector('.game-table')?.innerHTML || '').substring(0, 100)
    };
  }, id);

  if (!info.exists) {
    console.log(`  ❌ Page #page-${id} not found in DOM`);
    console.log(`  Errors: ${errors.join(', ')}`);
  } else {
    console.log(`  ✅ Page exists (active: ${info.active})`);
    console.log(`  HTML length: ${info.outerHTML_length} (inner: ${info.innerHTML_length})`);
    console.log(`  Visible children: ${info.visible_children}`);
    console.log(`  Has game-table: ${info.game_table_exists}`);
    console.log(`  Has chips: ${info.chips_exists}`);
    console.log(`  Has controls: ${info.controls_exists}`);
    console.log(`  Game-table preview: ${info.game_table_html}`);
    if (errors.length > 0) console.log(`  Errors: ${errors.join('; ')}`);
  }
  console.log('');
  await page.close();
}

await browser.close();
server.close();
