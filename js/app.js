import * as storage from './storage.js';
import * as home from './views/home.js';
import * as review from './views/review.js';
import * as chapters from './views/chapters.js';
import * as chapter from './views/chapter.js';
import * as notepad from './views/notepad.js';

let state = storage.rollover(storage.load());

const viewEl = document.getElementById('view');
const streakEl = document.getElementById('topbar-streak');
const titleEl = document.getElementById('topbar-title');

const ROUTES = [
  { pattern: /^#?\/?$/, view: home, tab: 'home', title: 'Langla' },
  { pattern: /^#?\/review\/?$/, view: review, tab: 'review', title: 'Review' },
  { pattern: /^#?\/chapters\/?$/, view: chapters, tab: 'chapters', title: 'Chapters' },
  { pattern: /^#?\/chapters\/([^\/]+)\/?$/, view: chapter, tab: 'chapters', title: 'Chapter', paramKeys: ['slug'] },
  { pattern: /^#?\/notepad\/?$/, view: notepad, tab: 'notepad', title: 'Notepad' },
];

function paintChrome(routeTitle, activeTab) {
  titleEl.textContent = routeTitle;
  streakEl.textContent = `🔥 ${state.streak.current}`;
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.tab === activeTab);
  });
}

async function route() {
  state = storage.rollover(storage.load());
  const hash = location.hash || '#/';
  for (const r of ROUTES) {
    const m = hash.match(r.pattern);
    if (m) {
      const params = {};
      (r.paramKeys || []).forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      paintChrome(r.title, r.tab);
      try {
        await r.view.render(viewEl, { state, params, refresh: route });
      } catch (e) {
        console.error(e);
        viewEl.innerHTML = `<h1>Error</h1><p class="muted small">${escapeHtml(e.message)}</p>`;
      }
      viewEl.scrollTop = 0;
      window.scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

// register service worker (best-effort)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

route();
