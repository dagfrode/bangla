import * as storage from '../storage.js';
import { allCards } from '../content.js';
import { counts } from '../srs.js';

export async function render(el, { state, refresh }) {
  const cards = await allCards();
  const cardIds = cards.map((c) => c.id);
  const c = counts(state, cardIds);
  const newSeen = c.seen;
  const dueCount = c.due;
  const totalNew = c.total - c.seen;

  el.innerHTML = `
    <h1>Today</h1>
    <p class="muted small">${formatDate()}</p>

    <div class="card">
      <div class="card-title">Daily checklist</div>
      <div id="checklist"></div>
    </div>

    <div class="card">
      <div class="card-title">Streak</div>
      <p class="muted">🔥 ${state.streak.current} day${state.streak.current === 1 ? '' : 's'} · longest ${state.streak.longest}</p>
    </div>

    <div class="card">
      <div class="card-title">Today's queue</div>
      <p class="muted small">${dueCount} due · ${Math.min(state.settings.newPerDay, totalNew)} new</p>
      <a class="btn" href="#/review">Start review</a>
    </div>

    <div class="card">
      <div class="card-title">Settings</div>
      <div class="row">
        <label for="newPerDay">New cards per day</label>
        <input id="newPerDay" type="number" min="0" max="50" value="${state.settings.newPerDay}" />
      </div>
      <div class="row">
        <span>Export progress</span>
        <button class="btn btn-secondary" id="exportBtn" style="width:auto">Copy JSON</button>
      </div>
      <div class="row">
        <span>Import progress</span>
        <button class="btn btn-secondary" id="importBtn" style="width:auto">Paste JSON</button>
      </div>
    </div>
  `;

  const cl = el.querySelector('#checklist');
  for (const item of state.checklist.items) {
    const row = document.createElement('div');
    row.className = 'checklist-item' + (item.done ? ' done' : '');
    row.innerHTML = `
      <div class="checklist-box">${item.done ? '✓' : ''}</div>
      <div class="checklist-label">${escapeHtml(item.label)}</div>
    `;
    row.addEventListener('click', () => {
      item.done = !item.done;
      storage.save(state);
      refresh();
    });
    cl.appendChild(row);
  }

  el.querySelector('#newPerDay').addEventListener('change', (e) => {
    const v = Math.max(0, Math.min(50, parseInt(e.target.value || '0', 10)));
    state.settings.newPerDay = v;
    storage.save(state);
  });

  el.querySelector('#exportBtn').addEventListener('click', async () => {
    const text = storage.exportJSON(state);
    try {
      await navigator.clipboard.writeText(text);
      alert('Progress JSON copied to clipboard.');
    } catch {
      prompt('Copy this:', text);
    }
  });

  el.querySelector('#importBtn').addEventListener('click', () => {
    const text = prompt('Paste exported JSON:');
    if (!text) return;
    try {
      storage.importJSON(text);
      location.reload();
    } catch (e) {
      alert('Import failed: ' + e.message);
    }
  });
}

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
