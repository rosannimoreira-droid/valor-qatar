import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PRODUCTS_DIR = path.join(ROOT, 'src', 'content', 'products');
const EDITORIAL_FILE = path.join(ROOT, 'src', 'data', 'editorial-media.json');

const BANNED_STRINGS = ['selection #', 'bouqs', 'riviera'];

async function main() {
  const files = (await fs.readdir(PRODUCTS_DIR)).filter((f) => f.endsWith('.json'));
  const errors = [];
  const seenIds = new Set();
  const seenSkus = new Set();
  const seenSlugsEn = new Set();
  const seenSlugsAr = new Set();
  const occasionCounts = {};

  for (const file of files) {
    const raw = await fs.readFile(path.join(PRODUCTS_DIR, file), 'utf8');
    const doc = JSON.parse(raw);

    // Uniqueness checks
    if (seenIds.has(doc.id)) errors.push(`Duplicate id: ${doc.id}`);
    seenIds.add(doc.id);

    if (seenSkus.has(doc.sku)) errors.push(`Duplicate sku: ${doc.sku}`);
    seenSkus.add(doc.sku);

    if (seenSlugsEn.has(doc.slug?.en)) errors.push(`Duplicate slug.en: ${doc.slug?.en}`);
    seenSlugsEn.add(doc.slug?.en);

    if (seenSlugsAr.has(doc.slug?.ar)) errors.push(`Duplicate slug.ar: ${doc.slug?.ar}`);
    seenSlugsAr.add(doc.slug?.ar);

    // Forbidden placeholder / competitor leaks
    const textBlob = JSON.stringify({
      name: doc.name,
      shortDescription: doc.shortDescription,
      description: doc.description,
    }).toLowerCase();

    for (const banned of BANNED_STRINGS) {
      if (textBlob.includes(banned)) {
        errors.push(`Forbidden string "${banned}" in ${file}`);
      }
    }

    // Pricing integrity: never ship unverified non-null price
    if (doc.verificationStatus === 'unverified' && doc.basePriceQar !== null) {
      errors.push(`Unverified product ${doc.sku} has non-null basePriceQar (${doc.basePriceQar})`);
    }

    // Master media file checks
    for (const img of doc.images || []) {
      const masterFull = path.join(ROOT, img.masterPath);
      try {
        await fs.access(masterFull);
      } catch {
        errors.push(`Missing master image: ${img.masterPath} referenced in ${file}`);
      }
    }

    // Occasion tally
    for (const occ of doc.occasions || []) {
      occasionCounts[occ] = (occasionCounts[occ] || 0) + 1;
    }
  }

  // Editorial media existence check
  const editorial = JSON.parse(await fs.readFile(EDITORIAL_FILE, 'utf8'));
  for (const ed of editorial) {
    try {
      await fs.access(path.join(ROOT, ed.masterPath));
    } catch {
      errors.push(`Missing editorial master image: ${ed.masterPath}`);
    }
  }

  console.log(
    `Validated ${files.length} product records and ${editorial.length} editorial images.`
  );
  console.log('Occasion distribution:', occasionCounts);

  if (errors.length > 0) {
    console.error('Catalogue validation failed:');
    for (const err of errors) console.error('  -', err);
    process.exit(1);
  }

  console.log('PASS: All catalogue integrity checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
