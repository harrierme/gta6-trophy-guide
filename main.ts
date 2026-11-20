// Leonida Trophy Atlas: entrypoint for gta6-trophy-guide-01 (Node 22).
// The guide is plain static files in app/ (index.html, app.js, style.css,
// data/trophies.json), opened at app/index.html, offline: it loads nothing
// over the network. This program checks the trophy data first, then hands
// the app in: it copies app/ and screenshots/ beside this file to /output
// and writes /output/dossier.json, the summary the judge reads, with the
// vendored make.fun library. Leave vendor/makefun-frontend.ts as it is:
// the scorer requires dossier.json to be byte for byte what its own copy
// writes. Serve it locally with `node serve.ts`, then open
// http://localhost:8080. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The trophy list the guide is built on. These are the facts the app
// must never drift from: 55 trophies, 1 platinum / 2 gold / 6 silver /
// 46 bronze, 28 hidden, 1 possibly missable, 1,000 Gamerscore in total.
const EXPECTED = {
  total: 55,
  grades: { platinum: 1, gold: 2, silver: 6, bronze: 46 },
  hidden: 28,
  missable: 1,
  gamerscore: 1000,
  unconfirmed: ['in-the-beginning', 'capital-offense', 'bad-luck-i-guess', 'the-truth-is-out-there'],
};

function fail(message) {
  console.error('build failed: ' + message);
  process.exit(1);
}

function checkTrophies() {
  const path = join(here, 'app', 'data', 'trophies.json');
  if (!existsSync(path)) fail('app/data/trophies.json is missing');
  let doc;
  try {
    doc = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    fail('app/data/trophies.json is not valid JSON: ' + err.message);
  }
  const list = doc.trophies;
  if (!Array.isArray(list)) fail('trophies.json has no trophies array');
  if (list.length !== EXPECTED.total) fail('expected ' + EXPECTED.total + ' trophies, found ' + list.length);

  const grades = {};
  let hidden = 0;
  let missable = 0;
  let gamerscore = 0;
  const ids = new Set();
  for (const t of list) {
    if (!t.id || !t.name || !t.desc || !t.grade) fail('trophy is missing id, name, desc or grade: ' + JSON.stringify(t).slice(0, 120));
    if (ids.has(t.id)) fail('duplicate trophy id: ' + t.id);
    ids.add(t.id);
    grades[t.grade] = (grades[t.grade] || 0) + 1;
    if (t.hidden) hidden += 1;
    if (t.missable) missable += 1;
    gamerscore += t.gs || 0;
    if (!Array.isArray(t.sources) || !t.sources.includes('exophase') || !t.sources.includes('psnprofiles')) {
      fail('trophy ' + t.id + ' is missing its Exophase or PSNProfiles source');
    }
    if (!Array.isArray(t.steps)) fail('trophy ' + t.id + ' has no steps array');
  }
  for (const [grade, count] of Object.entries(EXPECTED.grades)) {
    if (grades[grade] !== count) fail('expected ' + count + ' ' + grade + ', found ' + (grades[grade] || 0));
  }
  if (hidden !== EXPECTED.hidden) fail('expected ' + EXPECTED.hidden + ' hidden trophies, found ' + hidden);
  if (missable !== EXPECTED.missable) fail('expected ' + EXPECTED.missable + ' missable trophy, found ' + missable);
  if (gamerscore !== EXPECTED.gamerscore) fail('expected ' + EXPECTED.gamerscore + ' Gamerscore, found ' + gamerscore);
  for (const id of EXPECTED.unconfirmed) {
    const t = list.find((x) => x.id === id);
    if (!t) fail('unconfirmed trophy is missing from the list: ' + id);
    if (t.steps.length !== 0) fail('unconfirmed trophy ' + id + ' must not carry steps');
    if (!t.unconfirmed || !t.note) fail('unconfirmed trophy ' + id + ' must say so plainly in its note');
  }
  const withSteps = list.filter((t) => t.steps.length > 0).length;
  console.log('trophies checked: ' + list.length + ' total, ' + hidden + ' hidden, ' + missable + ' missable, ' + withSteps + ' with a guide, ' + EXPECTED.unconfirmed.length + ' unconfirmed, ' + gamerscore + 'G');
}

function checkScreenshots() {
  const dir = join(here, 'screenshots');
  if (!existsSync(dir)) fail('screenshots/ is missing');
  const files = readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  if (files.length === 0) fail('screenshots/ has no images');
  if (files.length > 4) fail('expected at most 4 screenshots, found ' + files.length);
  for (const f of files) {
    const size = statSync(join(dir, f)).size;
    if (size > 262144) fail('screenshot ' + f + ' is ' + size + ' bytes, over the 256 KiB cap');
  }
  console.log('screenshots checked: ' + files.join(', '));
}

checkTrophies();
checkScreenshots();

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than
// 4 screenshots or one over 256 KiB; more than 993 files and directories
// in app/ or 48 MiB of app files: app/ counts beside /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

console.log('built: ' + out + ' (app/ + screenshots/ + dossier.json)');
