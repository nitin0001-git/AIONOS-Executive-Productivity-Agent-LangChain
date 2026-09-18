/**
 * Pipeline Runner
 * Runs the end-to-end extraction, normalization, and deduplication pipeline,
 * writing the canonical output to backend/data/actions.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractActions } from './extract.js';
import { deduplicateActions } from './deduplicate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, '../data/actions.json');

export async function runPipeline() {
  console.log('=== [Pipeline] Starting Action Extraction & Normalization ===');
  
  // 1. Extract
  const extracted = await extractActions();
  console.log(`[Pipeline] Extracted ${extracted.length} raw action candidates.`);

  // 2. Deduplicate & Consolidate Evidence
  const canonical = deduplicateActions(extracted);
  console.log(`[Pipeline] Consolidated into ${canonical.length} canonical actions.`);

  // 3. Write actions.json
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(canonical, null, 2), 'utf-8');
  console.log(`[Pipeline] Successfully saved canonical actions to ${OUTPUT_PATH}`);

  return canonical;
}

// Execute directly if run via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runPipeline()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[Pipeline] Execution failed:', err);
      process.exit(1);
    });
}
