// Leonida Trophy Atlas: an offline checklist, guide reader, roadmap and missables
// view for the 55 GTA VI trophies. Progress lives in localStorage; the guide data
// is loaded once from data/trophies.json (a file of this app, never the network).
const STORAGE_KEY = 'leonida-trophy-atlas-v1';
const DEMO_EARNED = [2, 3, 8, 16, 20, 21, 33, 35, 42, 44, 51, 52, 53];
const KIND_LABELS = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };
const ROADMAP_STAGES = [
  { n: 1, title: 'Stage 1 — Play the story, Chapters 1–5 (60–80 hours)', text: 'Finish the campaign first. There is no mission replay, so keep a manual save at the start and end of each chapter (15 manual slots + 1 autosave). The one thing you must not skip: the Chapter 1 meditation for Positive Mental Attitude — after Down to Earth, find Lucia in the kitchen at Jason\u2019s house in the morning, follow her to the balcony and Accept. Cheats disable trophies and saving, so keep them out of this run.', ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28] },
  { n: 2, title: 'Stage 2 — Strangers, finales and side strands (10–20 hours)', text: 'Clear the character questlines and the stranger strands. Andy (Lucia-only), Tyrone and Bret (Jason-only) need the right character. Quest givers can go quiet mid-story but every trophy-related contact returns later, so nothing here is missable. Eight qualifying stranger strands earn Strangers & Freaks — Andy, Billy and Tyrone do not count toward it.', ids: [22, 23, 24, 25, 26, 27, 29, 16, 20, 21, 44, 46] },
  { n: 3, title: 'Stage 3 — Activities, robberies and collectibles (about 100 hours)', text: 'The big grind. Work the activities (250 stunts, 42 gold shooting-range medals, 14 drone-race wins, 20 race wins, 50 challenges), the robberies (5 bank vaults, armored trucks, one illegal operation per gang, jewelry stores) and the collectibles (3 card sets, 100 WAiNK scans, 100 vehicles, all 52 areas). Unlock the Scooter Bros app (Chapter 2, Moses) and the garages (Chapter 2, Daily Driver) early so they pay off all game.', ids: [15, 17, 18, 19, 30, 31, 32, 34, 36, 37, 38, 39, 40, 41, 43, 45, 47, 48, 49, 50, 54, 55] },
  { n: 4, title: 'Stage 4 — 100% completion and the platinum', text: 'After the story, open Progress > Stats > 100% Completion and finish the checklist: 39 gang operations, 22 bank jobs, 7 payday loan jobs, 8 bank vaults, 300 stunts, 70 of 80 challenges, 200 of 277 vehicles scanned, 100 of 255 animals studied, 15 of 18 meditation spots, 15 card sets, 100 WAiNK locations, 33 underwater discoveries, 100 flamingos. The standalone trophies ask for less than the checklist (250 stunts, 50 challenges, 5 vaults), so keep going after each one pops. A Long Road (gold) is the last big gate; the platinum pops with it.', ids: [14, 1] },
];

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEl = $('detail');
const roadmapEl = $('roadmapView');
const missablesEl = $('missablesView');

let trophies = [];
let earned = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
let kind = params.get('filter') && KIND_LABELS[params.get('filter')] ? params.get('filter') : 'all';
let grade = 'all';
let earnedFilter = 'all';
let query = '';
let spoiler = params.get('spoiler') === 'on';
let selectedId = Number(params.get('select')) || null;
const rawHash = location.hash.replace(/^#\/?/, '');
let view = rawHash === 'roadmap' ? 'roadmap' : rawHash === 'missables' ? 'missables' : 'tracker';

if (params.get('demo') === '1') {
  for (const id of DEMO_EARNED) earned.add(id);
  saveProgress();
}
if (!selectedId) selectedId = 28;

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

function isSpoilerMasked(t) {
  return spoiler && t.kind === 'story' && !earned.has(t.id);
}

function displayName(t) {
  return isSpoilerMasked(t) ? 'Hidden story trophy — earn it to reveal' : t.name;
}

function displayDescription(t) {
  return isSpoilerMasked(t) ? 'Story trophy. Its name and description stay hidden until you earn it.' : t.description;
}

function trophyById(id) {
  return trophies.find((t) => t.id === id);
}

function filteredTrophies() {
  const q = query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind !== 'all' && t.kind !== kind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (earnedFilter === 'earned' && !earned.has(t.id)) return false;
    if (earnedFilter === 'unearned' && earned.has(t.id)) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderProgress() {
  $('earnedCount').textContent = earned.size;
  $('progressFill').style.width = `${Math.round((earned.size / trophies.length) * 100)}%`;
  const counts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const total = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    return `${got}/${total} ${g}`;
  });
  $('gradeCounts').textContent = counts.join(' · ');
}

function renderList() {
  const shown = filteredTrophies();
  listEl.replaceChildren();
  $('shownCount').textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  $('activeFilterNote').textContent = kind === 'all' ? '' : `· kind: ${KIND_LABELS[kind]}`;
  $('emptyState').hidden = shown.length > 0;
  if (shown.length === 0) {
    $('emptyState').textContent = kind === 'online'
      ? 'No online trophies: all 55 GTA VI trophies are earned offline, in single player. PowerPyx lists 0 online trophies and 55 offline.'
      : 'No trophies match these filters. Try clearing the search or choosing another kind.';
  }
  for (const t of shown) {
    const li = document.createElement('li');
    if (t.id === selectedId) li.classList.add('selected');
    if (earned.has(t.id)) li.classList.add('earned');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveProgress();
      renderAll();
    });
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(t);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(t);
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    for (const label of tagLabels(t)) {
      const pill = document.createElement('span');
      pill.className = 'pill' + (label === 'Missable' ? ' missable' : label === 'Hidden' ? ' hidden-flag' : '');
      pill.textContent = label;
      tags.append(pill);
    }
    body.append(name, desc, tags);
    const gradeWrap = document.createElement('div');
    const dot = document.createElement('span');
    dot.className = `grade-dot grade-${t.grade}`;
    const gradeLabel = document.createElement('div');
    gradeLabel.className = 'grade-label';
    gradeLabel.textContent = t.grade;
    gradeWrap.append(dot, gradeLabel);
    li.append(box, body, gradeWrap);
    li.addEventListener('click', (e) => {
      if (e.target === box) return;
      selectedId = t.id;
      showView('tracker');
      renderAll();
    });
    listEl.append(li);
  }
}

function tagLabels(t) {
  const labels = [KIND_LABELS[t.kind]];
  if (t.missable) labels.push('Missable');
  if (t.hidden) labels.push('Hidden');
  if (t.target) labels.push(`Target: ${t.target}`);
  return labels;
}

function renderDetail() {
  const t = trophyById(selectedId) ?? trophies[0];
  if (!t) return;
  detailEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = `${t.grade[0].toUpperCase() + t.grade.slice(1)} trophy · ${displayDescription(t)}`;
  detailEl.append(h, official);
  if (t.missable) {
    const warn = document.createElement('p');
    warn.className = 'warning';
    warn.textContent = '⚠ Possibly missable — the only one in the game. Read the steps before you finish Chapter 1.';
    detailEl.append(warn);
  }
  if (isSpoilerMasked(t)) {
    const note = document.createElement('p');
    note.className = 'note';
    note.textContent = 'Spoiler-safe is on: this story trophy is masked until you earn it. Tick it off in the checklist to reveal its guide, or turn spoiler-safe off.';
    detailEl.append(note);
    return;
  }
  const guideH = document.createElement('h3');
  guideH.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = t.guide;
  detailEl.append(guideH, guide);
  if (t.steps?.length) {
    const stepsH = document.createElement('h3');
    stepsH.textContent = 'Steps';
    const ol = document.createElement('ol');
    for (const step of t.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.append(li);
    }
    detailEl.append(stepsH, ol);
  }
  const srcH = document.createElement('h3');
  srcH.textContent = 'Sources';
  const ul = document.createElement('ul');
  ul.className = 'sources';
  for (const s of t.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
    ul.append(li);
  }
  detailEl.append(srcH, ul);
  const meta = document.createElement('p');
  meta.className = 'note';
  meta.textContent = `Roadmap stage ${t.roadmap_stage} · Kind: ${KIND_LABELS[t.kind]}${t.hidden ? ' · Hidden on PlayStation until earned' : ''} · ${earned.has(t.id) ? 'Earned ✓' : 'Not yet earned'}`;
  detailEl.append(meta);
}

function renderRoadmap() {
  roadmapEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = 'Roadmap to the platinum';
  const intro = document.createElement('p');
  intro.textContent = '55 trophies · 1 platinum, 2 gold, 6 silver, 46 bronze · about 200 hours · difficulty 4/10 (PowerPyx) · 0 online trophies · 1 possibly missable. One playthrough is enough, with a manual save at the start and end of each chapter — there is no mission replay.';
  roadmapEl.append(h, intro);
  for (const stage of ROADMAP_STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const sh = document.createElement('h3');
    sh.textContent = stage.title;
    const sp = document.createElement('p');
    sp.textContent = stage.text;
    const ul = document.createElement('ul');
    for (const id of stage.ids) {
      const t = trophyById(id);
      if (!t) continue;
      const li = document.createElement('li');
      li.textContent = `${earned.has(id) ? '✓ ' : ''}${t.name} (${t.grade})`;
      ul.append(li);
    }
    div.append(sh, sp, ul);
    roadmapEl.append(div);
  }
}

function renderMissables() {
  missablesEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = 'Missable trophies';
  const lead = document.createElement('p');
  lead.innerHTML = '<strong>1 possibly missable trophy in the whole list.</strong> Everything else can be earned in free-roam after the story.';
  missablesEl.append(h, lead);
  const t = trophyById(28);
  const warn = document.createElement('p');
  warn.className = 'warning';
  warn.textContent = 'Positive Mental Attitude (Bronze) — meditate at every spot across Leonida. The Chapter 1 meditation at Jason\u2019s house is only available in Chapter 1: after Down to Earth, find Lucia in the kitchen in the morning, follow her to the balcony and choose Accept. It is not yet confirmed whether the trophy needs that spot — do it anyway, because it cannot be repeated. Sources: PowerPyx, games.gg, GTA Spotter, Mobalytics.';
  missablesEl.append(warn);
  const watchH = document.createElement('h3');
  watchH.textContent = 'Looks missable, but is not';
  const ul = document.createElement('ul');
  for (const line of [
    'Optional missions with black icons and pink letters disappear after a while — they do not matter for trophies.',
    'Quest givers such as Kenton can go quiet mid-story. All trophy-related contacts return later, so finish their strands in free-roam.',
    'Some fences disappear permanently. New fences unlock as you go, and no trophy needs a lost fence.',
    'Cheats disable trophies and saving — keep them out of a trophy run entirely.',
    'No mission replay: keep a manual save at the start and end of each of the five chapters.',
  ]) {
    const li = document.createElement('li');
    li.textContent = line;
    ul.append(li);
  }
  missablesEl.append(watchH, ul);
  const src = document.createElement('p');
  src.className = 'note';
  src.textContent = 'Sources: PowerPyx — GTA 6 Trophy Guide & Roadmap; Mobalytics — GTA 6 Full Trophy List & Walkthrough; games.gg — GTA 6 Trophy List.';
  missablesEl.append(src);
}

function showView(v) {
  view = v;
  document.querySelectorAll('.views button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
  detailEl.hidden = v !== 'tracker';
  roadmapEl.hidden = v !== 'roadmap';
  missablesEl.hidden = v !== 'missables';
  location.hash = v === 'tracker' ? '' : v;
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
  renderMissables();
}

document.querySelectorAll('.views button').forEach((b) => b.addEventListener('click', () => { showView(b.dataset.view); }));
document.querySelectorAll('#kindFilters button').forEach((b) => b.addEventListener('click', () => {
  kind = b.dataset.kind;
  document.querySelectorAll('#kindFilters button').forEach((x) => x.classList.toggle('active', x === b));
  renderList();
}));
$('gradeFilter').addEventListener('change', (e) => { grade = e.target.value; renderList(); });
$('earnedFilter').addEventListener('change', (e) => { earnedFilter = e.target.value; renderList(); });
$('search').addEventListener('input', (e) => { query = e.target.value; renderList(); });
$('spoiler').addEventListener('change', (e) => { spoiler = e.target.checked; renderAll(); });
$('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2)], { type: 'application/json' }));
  a.download = 'leonida-trophy-atlas-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    earned = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
    saveProgress();
    renderAll();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  earned = new Set();
  saveProgress();
  renderAll();
});

// Deep links: ?filter=missable etc. and #roadmap / #missables work on load.
if (kind !== 'all') document.querySelectorAll('#kindFilters button').forEach((x) => x.classList.toggle('active', x.dataset.kind === kind));
$('spoiler').checked = spoiler;

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
if (!trophyById(selectedId)) selectedId = trophies[0]?.id ?? null;
showView(view);
renderAll();
