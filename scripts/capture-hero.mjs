// Renders the live hero stage in headless Chrome and saves:
//   public/hero-still.webp  one frame of the orb stage (1200x560), the static fallback for phones, reduced-motion and no-WebGL
//   public/og.png           the top of the page at 1200x630 with nav and title, used as og:image
// Usage: npm run build && node scripts/capture-hero.mjs   (starts its own `vite preview` on port 4174)
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const PORT = 4174
const URL = `http://localhost:${PORT}/`
const STILL = 'public/hero-still.webp'
const OG = 'public/og.png'

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

async function open(browser, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  await page.addInitScript(() => localStorage.setItem('lang', 'zh'))
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 4000))]))
  await page.waitForSelector('.hero-stage canvas.is-ready', { timeout: 20000 })
  await sleep(3000)
  return page
}

try {
  await waitForServer()
  const proxy = process.env.https_proxy || process.env.HTTPS_PROXY
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    proxy: proxy ? { server: proxy, bypass: 'localhost,127.0.0.1' } : undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })

  // Stage still: the card alone, at the stage's maximum size, without the overlay tag or the old still.
  const stagePage = await open(browser, { width: 1248, height: 1000 })
  await stagePage.addStyleTag({ content: '.hero-stage{height:560px !important} .hero-tag{visibility:hidden} .hero-still{visibility:hidden} body::before{display:none}' })
  await sleep(300)
  const stagePng = await stagePage.locator('.hero-stage').screenshot({ type: 'png' })
  await sharp(stagePng).resize(1200, 560, { fit: 'cover' }).webp({ quality: 82 }).toFile(STILL)
  await stagePage.close()

  // og image: the page top with nav, title and the stage.
  const ogPage = await open(browser, { width: 1200, height: 630 })
  const ogPng = await ogPage.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  await sharp(ogPng).png({ compressionLevel: 9 }).toFile(OG)
  await ogPage.close()
  await browser.close()

  for (const f of [STILL, OG]) {
    const meta = await sharp(f).metadata()
    console.log(`wrote ${f} ${meta.width}x${meta.height}`)
  }
} finally {
  stop()
}
