import * as storage from '../storage.js';
import { getCard } from '../content.js';

export async function render(el, { state, refresh }) {
  // Resolve ask-tutor card IDs to readable lines
  const items = [];
  for (const id of state.askTutor) {
    const card = await getCard(id);
    if (card) items.push({ id, label: `${card.bangla} = ${card.english}`, slug: card.slug });
    else items.push({ id, label: id, slug: '' });
  }

  el.innerHTML = `
    <h1>Lesson prep</h1>
    <p class="muted small">Bring these to your next tutor session.</p>

    <div class="askt">
      <div class="askt-title">Cards tagged "ask tutor" (${items.length})</div>
      ${items.length === 0
        ? '<p class="muted small">No tagged cards yet. Tap the "?" next to any word or phrase, or use the button in review.</p>'
        : items.map((it) => `
            <div class="askt-item">
              <span>${escapeHtml(it.label)}</span>
              <button class="askt-remove" data-rm="${escapeHtml(it.id)}" title="Remove">×</button>
            </div>
          `).join('')}
    </div>

    <div class="card">
      <div class="card-title">Notepad</div>
      <p class="muted small">Free notes — questions, sentences you want to try, etc. Saved automatically.</p>
      <textarea class="notepad-textarea" id="np" placeholder="e.g. Ask about past tense forms of khawa. Practise 'apnar shorir kemon achhe' with fiancée tonight.">${escapeHtml(state.notepad)}</textarea>
    </div>
  `;

  const np = el.querySelector('#np');
  np.addEventListener('input', () => {
    state.notepad = np.value;
    storage.save(state);
  });

  el.querySelectorAll('[data-rm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-rm');
      state.askTutor = state.askTutor.filter((x) => x !== id);
      storage.save(state);
      refresh();
    });
  });

  // also tick the tutor checklist item if notepad has content or items exist
  if ((state.notepad && state.notepad.trim().length > 0) || items.length > 0) {
    const t = state.checklist.items.find((x) => x.id === 'tutor');
    if (t && !t.done) {
      t.done = true;
      storage.save(state);
    }
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
