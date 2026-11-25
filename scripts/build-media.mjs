import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PRODUCTS_DIR = path.join(ROOT, 'src', 'content', 'products');
const EDITORIAL_FILE = path.join(ROOT, 'src', 'data', 'editorial-media.json');
const OUT_DIR = path.join(ROOT, 'public', 'media');

const TARGET_WIDTHS = [400, 800, 1200];
const FORCE = process.argv.includes('--force');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function processImageTask(task) {
  const srcPath = path.join(ROOT, task.masterPath);
  const meta = await sharp(srcPath).metadata();
  const origWidth = meta.width || 1200;

  let generated = 0;
  let skipped = 0;

  for (const width of TARGET_WIDTHS) {
    // Avoid upscaling smaller originals; emit at original width if smaller than target
    const targetW = Math.min(width, origWidth);
    const avifOut = path.join(OUT_DIR, `${task.mediaKey}-${width}.avif`);
    const webpOut = path.join(OUT_DIR, `${task.mediaKey}-${width}.webp`);
    const jpgOut = path.join(OUT_DIR, `${task.mediaKey}-${width}.jpg`);

    if (!FORCE && (await exists(avifOut)) && (await exists(webpOut)) && (await exists(jpgOut))) {
      skipped++;
      continue;
    }

    const base = sharp(srcPath).rotate().resize({ width: targetW, withoutEnlargement: true });

    await Promise.all([
      base.clone().avif({ quality: 58, effort: 3 }).toFile(avifOut),
      base.clone().webp({ quality: 78 }).toFile(webpOut),
      base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgOut),
    ]);
    generated++;
  }

  return { generated, skipped };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const tasks = [];
  const productFiles = (await fs.readdir(PRODUCTS_DIR)).filter((f) => f.endsWith('.json'));

  for (const fn of productFiles) {
    const raw = await fs.readFile(path.join(PRODUCTS_DIR, fn), 'utf8');
    const doc = JSON.parse(raw);
    for (const img of doc.images) {
      tasks.push({ masterPath: img.masterPath, mediaKey: img.mediaKey });
    }
  }

  const editorialRaw = await fs.readFile(EDITORIAL_FILE, 'utf8');
  const editorial = JSON.parse(editorialRaw);
  for (const ed of editorial) {
    tasks.push({ masterPath: ed.masterPath, mediaKey: ed.mediaKey });
  }

  console.log(`Processing ${tasks.length} media masters into AVIF/WebP/JPEG derivatives...`);
  const concurrency = 6;
  let totalGenerated = 0;
  let totalSkipped = 0;

  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(processImageTask));
    for (const r of results) {
      totalGenerated += r.generated;
      totalSkipped += r.skipped;
    }
    if ((i + concurrency) % 60 === 0 || i + concurrency >= tasks.length) {
      console.log(`  Progress: ${Math.min(i + concurrency, tasks.length)}/${tasks.length}`);
    }
  }

  console.log(`Done. Generated ${totalGenerated} width sets, skipped ${totalSkipped} cached sets.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
