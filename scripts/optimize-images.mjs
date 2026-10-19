// Converts screenshots to capped-width WebP for public/screens.
// Usage: node scripts/optimize-images.mjs <input...> --out public/screens --prefix savevia
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const flag = name => {
  const i = args.indexOf(name)
  return i === -1 ? null : args[i + 1]
}
const out = flag('--out') ?? 'public/screens'
const prefix = flag('--prefix') ?? 'shot'
const inputs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out' && args[i - 1] !== '--prefix')
if (!inputs.length) {
  console.error('no inputs')
  process.exit(1)
}
mkdirSync(out, { recursive: true })
let n = 0
for (const input of inputs) {
  n += 1
  const target = join(out, `${prefix}-${n}.webp`)
  const info = await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target)
  console.log(`${target} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`)
}
