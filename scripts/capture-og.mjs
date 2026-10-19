// Renders the page top in headless Chrome after the hero demo has finished playing,
// and saves it as public/og.png (1200x630), the og:image for link previews.
// Usage: npm run build && node scripts/capture-og.mjs   (starts its own `vite preview` on port 4174)
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const PORT = 4174
const URL = `http://localhost:${PORT}/`
const OG = 'public/og.png'

// detached gives vite its own process group, so stop() kills npx and vite together and frees the port.
const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true })
const stop = () => {
  try {
    process.kill(-preview.pid, 'SIGTERM')
  } catch {}
}
process.on('exit', stop)

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(URL)
      if (r.ok) return
    } catch {}
    await sleep(250)
  }
  throw new Error('preview server did not start')
}

try {
  await waitForServer()
  const proxy = process.env.https_proxy || process.env.HTTPS_PROXY
  const browser = await chromium.launch({ channel: 'chrome', headless: true, proxy: proxy ? { server: proxy, bypass: 'localhost,127.0.0.1' } : undefined })
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.addInitScript(() => localStorage.setItem('lang', 'zh'))
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 4000))]))
  // The demo finishes its last step at about 5.4s; capture inside the hold window.
  await sleep(6500)
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  await browser.close()
  await sharp(png).png({ compressionLevel: 9 }).toFile(OG)
  const meta = await sharp(OG).metadata()
  console.log(`wrote ${OG} ${meta.width}x${meta.height}`)
} finally {
  stop()
}
