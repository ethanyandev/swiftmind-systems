// Renders the live hero engine in headless Chrome and saves one frame as public/hero-still.webp.
// Used as the static fallback on phones, reduced-motion and no-WebGL clients. Re-run after engine changes.
// Usage: npm run build && node scripts/capture-hero.mjs   (starts its own `vite preview` on port 4174)
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const PORT = 4174
const URL = `http://localhost:${PORT}/`
const OUT = 'public/hero-still.webp'

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const stop = () => preview.kill()
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
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('.hero-engine canvas.is-ready', { timeout: 15000 })
  await sleep(2500)
  await page.addStyleTag({ content: '.hero-content{visibility:hidden} .site-nav{visibility:hidden} .hero-still{visibility:hidden} body::before{display:none}' })
  const png = await page.locator('.hero').screenshot({ type: 'png' })
  await browser.close()
  await sharp(png).webp({ quality: 80 }).toFile(OUT)
  const meta = await sharp(OUT).metadata()
  console.log(`wrote ${OUT} ${meta.width}x${meta.height}`)
} finally {
  stop()
}
