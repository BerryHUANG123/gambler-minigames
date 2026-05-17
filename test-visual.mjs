import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname, join } from 'path';

const PORT = 8765;
const BASE = `http://localhost:${PORT}`;
const delay = ms => new Promise(r => setTimeout(r, ms));

const server = createServer((req, res) => {
  let filePath = join('.', req.url === '/' ? 'index.html' : req.url);
  try { const data = readFileSync(filePath); const ext = extname(filePath); const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' }[ext] || 'application/octet-stream'; res.writeHead(200, { 'Content-Type': mime }); res.end(data); } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(PORT);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser', headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

const testIds = ['dice', 'coinflip', 'dice-poker', 'slot'];
const page = await browser.newPage();

await page.goto(BASE, { waitUntil: 'load', timeout: 30000 });
await delay(500);

for (const id of testIds) {
  console.log(`\n=== ${id} ===`);
  await page.evaluate((gid) => { Engine.loadGame(gid); }, id);
  await delay(3000);

  const info = await page.evaluate((gid) => {
    const p = document.getElementById(`page-${gid}`);
    if (!p) return 'NO PAGE FOUND';
    const cs = getComputedStyle(p);
    const kids = Array.from(p.children).map(c => {
      const s = getComputedStyle(c);
      return { tag: c.tagName, cls: c.className, disp: s.display, vis: s.visibility, rect: c.getBoundingClientRect() };
    });
    return {
      pageDisplay: cs.display, pageVis: cs.visibility,
      pageRect: p.getBoundingClientRect(),
      children: kids,
      innerFirst200: p.innerHTML.substring(0, 200)
    };
  }, id);

  console.log(`  Page display: ${info.pageDisplay}, visibility: ${info.pageVis}`);
  console.log(`  Page rect:`, JSON.stringify(info.pageRect));
  console.log(`  Children (${info.children.length}):`);
  info.children.forEach((c, i) => {
    console.log(`    [${i}] <${c.tag} class="${c.cls}"> display=${c.disp} vis=${c.vis} rect=${JSON.stringify(c.rect)}`);
  });
  console.log(`  HTML preview: ${info.innerFirst200.substring(0, 100)}...`);

  await page.evaluate(() => Engine.backToHall());
  await delay(300);
}

await page.screenshot({ path: '/tmp/game-test.png', fullPage: true });
console.log('\nScreenshot saved to /tmp/game-test.png');
await browser.close();
server.close();
