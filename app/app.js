// Leonida Trophy Atlas: offline tracker. Data lives in data/trophies.json
// and is fetched once at load. Ticks live in localStorage only.

const STORE_KEY = 'leonida-trophy-atlas-v2';
const REVEAL_KEY = 'leonida-trophy-atlas-revealed';
const DEMO_EARNED = [
  'just-like-paradise', 'paradise-lost', 'trust', 'baited-my-tackle',
  'stick-fiddler', 'master-of-none', 'top-fun', 'earn-cash-not-kudos',
  'whip-it-good', 'the-goodtime-state', 'treat-yo-self',
  'catch-me-if-you-can', 'challenging-tank',
];

let data = null;
let earned = new Set(loadIds(STORE_KEY));
let revealed = new Set(loadIds(REVEAL_KEY));
let selectedId = null;

const $ = (id) => document.getElementById(id);

function loadIds(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveIds(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch { /* storage full or blocked; ticks still work for this visit */ }
}

// Query params can sit in the search part or after ? inside the hash,
// because deep links mix both shapes.
function readParams() {
  const merged = new URLSearchParams(location.search);
  const hash = location.hash;
  const q = hash.indexOf('?');
  if (q !== -1) new URLSearchParams(hash.slice(q + 1)).forEach((v, k) => merged.set(k, v));
  return merged;
}

function route() {
  const hash = location.hash.split('?')[0];
  return hash === '#/roadmap' ? 'roadmap' : hash === '#/missables' ? 'missables' : 'tracker';
}

function showView(name) {
  for (const v of ['tracker', 'roadmap', 'missables']) {
    $('view-' + v).hidden = v !== name;
    const nav = $('nav-' + v);
    if (v === name) nav.setAttribute('aria-current', 'page');
    else nav.removeAttribute('aria-current');
  }
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  return { story: 'Story', quest: 'Quest', activity: 'Activity', collectible: 'Collectible', combat: 'Combat', robbery: 'Robbery', exploration: 'Exploration', meta: 'Completion' }[kind] || kind;
}

function spoilerOn() { return $('spoiler').checked; }

function masked(t) {
  return t.hidden && spoilerOn() && !revealed.has(t.id);
}

function displayName(t) {
  return masked(t) ? 'Hidden story trophy' : t.name;
}

function displayDesc(t) {
  return masked(t) ? 'Earn it to reveal.' : t.desc;
}

function filters() {
  return {
    q: $('q').value.trim().toLowerCase(),
    kind: $('kind').value,
    grade: $('grade').value,
    earned: $('earned').value,
    missable: $('missable-only').checked,
  };
}

function visibleTrophies() {
  const f = filters();
  return data.trophies.filter((t) => {
    if (f.q && !(t.name.toLowerCase().includes(f.q) || t.desc.toLowerCase().includes(f.q))) return false;
    if (f.kind && t.kind !== f.kind) return false;
    if (f.grade && t.grade !== f.grade) return false;
    if (f.earned === 'yes' && !earned.has(t.id)) return false;
    if (f.earned === 'no' && earned.has(t.id)) return false;
    if (f.missable && !t.missable) return false;
    return true;
  });
}

function renderProgress() {
  const total = data.trophies.length;
  const done = data.trophies.filter((t) => earned.has(t.id)).length;
  const byGrade = {};
  for (const t of data.trophies) {
    if (!earned.has(t.id)) continue;
    byGrade[t.grade] = (byGrade[t.grade] || 0) + 1;
  }
  $('progress-pct').textContent = done + ' of ' + total + ' earned';
  $('progress-grades').textContent =
    (byGrade.platinum || 0) + ' platinum, ' + (byGrade.gold || 0) + ' gold, ' +
    (byGrade.silver || 0) + ' silver, ' + (byGrade.bronze || 0) + ' bronze';
  $('progress-fill').style.width = Math.round((done / total) * 100) + '%';
  $('progress-bar').setAttribute('aria-valuenow', String(done));
}

function renderList() {
  const list = $('trophy-list');
  const items = visibleTrophies();
  $('empty-state').hidden = items.length > 0;
  list.hidden = items.length === 0;
  list.innerHTML = '';
  for (const t of items) {
    const li = document.createElement('li');
    li.className = 'trophy-row' + (earned.has(t.id) ? ' earned' : '') + (t.missable ? ' missable' : '');
    li.id = 'row-' + t.id;

    const tick = document.createElement('div');
    tick.className = 'tick';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + displayName(t) + ' as earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveIds(STORE_KEY, earned);
      renderProgress();
      li.classList.toggle('earned', box.checked);
    });
    tick.appendChild(box);

    const body = document.createElement('div');
    body.className = 'body';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = displayName(t);
    const badge = document.createElement('span');
    badge.className = 'grade grade-' + t.grade;
    badge.textContent = gradeLabel(t.grade);
    name.appendChild(badge);
    body.appendChild(name);

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = displayDesc(t);
    body.appendChild(desc);

    const meta = document.createElement('p');
    meta.className = 'meta';
    const bits = [kindLabel(t.kind)];
    if (t.gs > 0) bits.push(t.gs + 'G');
    if (t.target) bits.push('target ' + t.target.toLocaleString('en-US'));
    meta.textContent = bits.join(' · ');
    if (t.missable) {
      const warn = document.createElement('span');
      warn.className = 'warn';
      warn.textContent = ' · Possibly missable';
      meta.appendChild(warn);
    }
    if (t.unconfirmed) {
      const unc = document.createElement('span');
      unc.className = 'unconfirmed';
      unc.textContent = ' · No confirmed trigger yet';
      meta.appendChild(unc);
    }
    body.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const guideBtn = document.createElement('button');
    guideBtn.className = 'btn';
    guideBtn.type = 'button';
    guideBtn.textContent = selectedId === t.id ? 'Hide guide' : 'Read guide';
    guideBtn.addEventListener('click', () => selectTrophy(selectedId === t.id ? null : t.id));
    actions.appendChild(guideBtn);

    li.append(tick, body, actions);
    list.appendChild(li);
  }
  renderGuide();
}

function sourceLinks(t) {
  return t.sources
    .map((key) => {
      const s = data.sources[key];
      if (!s) return null;
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      return a;
    })
    .filter(Boolean);
}

function renderGuide() {
  const slot = $('guide-slot');
  slot.innerHTML = '';
  if (!selectedId) return;
  const t = data.trophies.find((x) => x.id === selectedId);
  if (!t) return;

  const card = document.createElement('article');
  card.className = 'guide';
  card.setAttribute('aria-label', 'Guide for ' + displayName(t));

  const h = document.createElement('h3');
  h.textContent = displayName(t);
  card.appendChild(h);

  if (masked(t)) {
    const p = document.createElement('p');
    p.className = 'official';
    p.textContent = 'This is a hidden story trophy. Spoiler-safe is on, so its name and guide stay hidden until you choose to see them.';
    card.appendChild(p);
    const show = document.createElement('button');
    show.className = 'btn primary';
    show.type = 'button';
    show.textContent = 'Show this trophy';
    show.addEventListener('click', () => {
      revealed.add(t.id);
      saveIds(REVEAL_KEY, revealed);
      renderList();
    });
    card.appendChild(show);
  } else {
    const official = document.createElement('p');
    official.className = 'official';
    official.textContent = 'Official description: ' + t.desc;
    card.appendChild(official);

    if (t.steps.length) {
      const ol = document.createElement('ol');
      for (const step of t.steps) {
        const li = document.createElement('li');
        li.textContent = step;
        ol.appendChild(li);
      }
      card.appendChild(ol);
    }

    if (t.note) {
      const note = document.createElement('p');
      note.className = 'note';
      const strong = document.createElement('strong');
      strong.textContent = t.unconfirmed ? 'No confirmed trigger. ' : 'Note. ';
      note.appendChild(strong);
      note.appendChild(document.createTextNode(t.note));
      card.appendChild(note);
    }

    const src = document.createElement('p');
    src.className = 'sources';
    src.textContent = 'Sources: ';
    const links = sourceLinks(t);
    links.forEach((a, i) => {
      if (i > 0) src.appendChild(document.createTextNode(', '));
      src.appendChild(a);
    });
    card.appendChild(src);

    const row = document.createElement('div');
    row.className = 'close-row';
    const toggle = document.createElement('button');
    toggle.className = 'btn primary';
    toggle.type = 'button';
    toggle.textContent = earned.has(t.id) ? 'Mark as not earned' : 'Mark as earned';
    toggle.addEventListener('click', () => {
      if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
      saveIds(STORE_KEY, earned);
      renderProgress();
      renderList();
    });
    const close = document.createElement('button');
    close.className = 'btn quiet';
    close.type = 'button';
    close.textContent = 'Close guide';
    close.addEventListener('click', () => selectTrophy(null));
    row.append(toggle, ' ', close);
    card.appendChild(row);
  }
  slot.appendChild(card);
}

function selectTrophy(id) {
  selectedId = id;
  renderList();
  if (id) {
    const row = $('row-' + id);
    if (row) row.scrollIntoView({ block: 'nearest' });
    const card = document.querySelector('.guide');
    if (card) card.scrollIntoView({ block: 'nearest' });
  }
}

function renderRoadmap() {
  const host = $('roadmap-stages');
  host.innerHTML = '';
  for (const stage of data.roadmap) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = stage.title + ' ';
    const hours = document.createElement('span');
    hours.className = 'hours';
    hours.textContent = stage.hours;
    h.appendChild(hours);
    div.appendChild(h);
    const p = document.createElement('p');
    p.textContent = stage.text;
    div.appendChild(p);
    const ul = document.createElement('ul');
    for (const id of stage.trophies) {
      const t = data.trophies.find((x) => x.id === id);
      if (!t) continue;
      const li = document.createElement('li');
      if (earned.has(id)) li.className = 'earned';
      const a = document.createElement('a');
      a.href = '#/tracker?select=' + id;
      a.textContent = (earned.has(id) ? '✓ ' : '') + t.name;
      li.appendChild(a);
      ul.appendChild(li);
    }
    div.appendChild(ul);
    host.appendChild(div);
  }
}

function clearFilters() {
  $('q').value = '';
  $('kind').value = '';
  $('grade').value = '';
  $('earned').value = '';
  $('missable-only').checked = false;
  renderList();
}

function applyParams() {
  const params = readParams();
  if (params.get('demo') === '1' && earned.size === 0) {
    for (const id of DEMO_EARNED) earned.add(id);
    saveIds(STORE_KEY, earned);
  }
  if (params.get('spoiler') === 'on') $('spoiler').checked = true;
  if (params.get('filter') === 'missable') $('missable-only').checked = true;
  const select = params.get('select');
  if (select && data.trophies.some((t) => t.id === select)) selectedId = select;
}

function exportChecklist() {
  const payload = { app: 'leonida-trophy-atlas', version: 2, earned: [...earned].sort() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-atlas-checklist.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importChecklist(file) {
  const msg = $('import-msg');
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error('no earned list');
      const known = new Set(data.trophies.map((t) => t.id));
      const good = ids.filter((id) => typeof id === 'string' && known.has(id));
      const ignored = ids.length - good.length;
      earned = new Set(good);
      saveIds(STORE_KEY, earned);
      renderProgress();
      renderList();
      msg.textContent = 'Imported ' + good.length + ' earned trophies' + (ignored ? ' (' + ignored + ' unknown entries ignored).' : '.');
    } catch {
      msg.textContent = 'That file could not be read as a checklist. Export one first, then import that file.';
    }
  };
  reader.onerror = () => { msg.textContent = 'That file could not be read. Try again.'; };
  reader.readAsText(file);
}

async function load() {
  $('loading-state').hidden = false;
  $('error-state').hidden = true;
  try {
    const res = await fetch('data/trophies.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch {
    $('loading-state').hidden = true;
    $('error-state').hidden = false;
    return;
  }
  $('loading-state').hidden = true;
  applyParams();
  showView(route());
  renderProgress();
  renderList();
  renderRoadmap();
}

for (const id of ['q', 'kind', 'grade', 'earned']) {
  $(id).addEventListener('input', renderList);
}
$('missable-only').addEventListener('change', renderList);
$('spoiler').addEventListener('change', renderList);
$('clear-filters').addEventListener('click', clearFilters);
$('empty-clear').addEventListener('click', clearFilters);
$('retry-load').addEventListener('click', load);
$('export-btn').addEventListener('click', exportChecklist);
$('import-file').addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) importChecklist(e.target.files[0]);
  e.target.value = '';
});
$('reset-btn').addEventListener('click', () => {
  if (!confirm('Clear every tick? Your earned trophies will be unticked.')) return;
  earned = new Set();
  saveIds(STORE_KEY, earned);
  renderProgress();
  renderList();
});
window.addEventListener('hashchange', () => {
  showView(route());
  const params = readParams();
  const select = params.get('select');
  if (select && data && data.trophies.some((t) => t.id === select)) selectTrophy(select);
});

load();
