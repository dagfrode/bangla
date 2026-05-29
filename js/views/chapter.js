import * as storage from '../storage.js';
import { getChapter } from '../content.js';
import { renderMarkdown } from '../parser.js';

export async function render(el, { state, params, refresh }) {
  const ch = await getChapter(params.slug);
  if (!ch) {
    el.innerHTML = `<h1>Not found</h1><a class="btn btn-secondary" href="#/chapters">Back</a>`;
    return;
  }
  el.innerHTML = `
    <a class="muted small" href="#/chapters">← Chapters</a>
    <h1>${escapeHtml(ch.title)}</h1>
    <p class="muted small">${escapeHtml(ch.description)}</p>

    ${ch.words.length ? `
      <h2>Words</h2>
      <div class="card">${ch.words.map((w) => pair(w, ch.slug, state)).join('')}</div>
    ` : ''}

    ${ch.phrases.length ? `
      <h2>Phrases</h2>
      <div class="card">${ch.phrases.map((p) => pair(p, ch.slug, state)).join('')}</div>
    ` : ''}

    ${ch.grammar ? `
      <h2>Grammar notes</h2>
      <div class="card grammar">${renderMarkdown(ch.grammar)}</div>
    ` : ''}

    ${ch.prompts.length ? `
      <h2>Practice prompts</h2>
      <div class="card">
        <ul>${ch.prompts.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
      </div>
    ` : ''}

    ${ch.tutorQs.length ? `
      <h2>Tutor questions (from the chapter)</h2>
      <div class="card">
        <ul>${ch.tutorQs.map((q) => `<li>${escapeHtml(q)}</li>`).join('')}</ul>
      </div>
    ` : ''}
  `;

  el.querySelectorAll('[data-ask]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-ask');
      if (!state.askTutor.includes(id)) state.askTutor.push(id);
      else state.askTutor = state.askTutor.filter((x) => x !== id);
      storage.save(state);
      refresh();
    });
  });
}

function pair(entry, slug, state) {
  const id = `${slug}::${entry.bangla}`;
  const tagged = state.askTutor.includes(id);
  return `
    <div class="pair">
      <div>
        <div class="pair-bangla">${escapeHtml(entry.bangla)}</div>
        <div class="pair-english">${escapeHtml(entry.english)}</div>
      </div>
      <button class="pair-tag${tagged ? ' tagged' : ''}" data-ask="${escapeHtml(id)}" title="Ask tutor about this">${tagged ? '✓' : '?'}</button>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
