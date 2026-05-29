import { loadChapters } from '../content.js';

export async function render(el, { state }) {
  const chapters = await loadChapters();
  el.innerHTML = `
    <h1>Chapters</h1>
    <p class="muted small">Tap a chapter to browse words, phrases, and notes.</p>
    <div id="list"></div>
  `;
  const list = el.querySelector('#list');
  for (const ch of chapters) {
    const a = document.createElement('a');
    a.className = 'chapter-link';
    a.href = `#/chapters/${ch.slug}`;
    const count = ch.reference ? 'reference' : `${ch.cards.length} card${ch.cards.length === 1 ? '' : 's'}`;
    a.innerHTML = `
      <div class="chapter-link-title">
        <span>${escapeHtml(ch.title)}</span>
        <span class="chapter-link-count">${count}</span>
      </div>
      <div class="chapter-link-desc">${escapeHtml(ch.description)}</div>
    `;
    list.appendChild(a);
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
