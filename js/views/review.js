import * as storage from '../storage.js';
import * as srs from '../srs.js';
import { allCards, getCard } from '../content.js';

export async function render(el, { state, refresh }) {
  const cards = await allCards();
  const cardIds = cards.map((c) => c.id);
  const queue = srs.selectReviewQueue(state, cardIds);
  const order = [...queue.due, ...queue.new];

  if (order.length === 0) {
    el.innerHTML = `
      <h1>Review</h1>
      <div class="review-empty">
        <p>No cards due. Nice work.</p>
        <a class="btn btn-secondary" href="#/">Back to today</a>
      </div>
    `;
    return;
  }

  let i = 0;
  let revealed = false;
  let reviewedAny = false;

  function paint() {
    if (i >= order.length) {
      if (reviewedAny) {
        storage.markReviewed(state);
        // also tick the "review" checklist item
        const item = state.checklist.items.find((x) => x.id === 'review');
        if (item) item.done = true;
        storage.save(state);
      }
      el.innerHTML = `
        <h1>Done</h1>
        <div class="review-empty">
          <p>Session complete — ${order.length} card${order.length === 1 ? '' : 's'} reviewed.</p>
          <a class="btn" href="#/">Back to today</a>
          <div class="spacer-12"></div>
          <a class="btn btn-secondary" href="#/review">Review more</a>
        </div>
      `;
      return;
    }
    const card = cards.find((c) => c.id === order[i]);
    const isNew = !state.cards[card.id];
    el.innerHTML = `
      <div class="review-progress">${i + 1} / ${order.length}${isNew ? ' · new' : ''}</div>
      <div class="review-card" id="card">
        <div class="review-front">${escapeHtml(card.english)}</div>
        ${revealed ? `<div class="review-back">${escapeHtml(card.bangla)}<div class="review-meta">${card.kind} · ${card.slug.replace(/^\d+-/, '').replace(/-/g, ' ')}</div></div>` : ''}
      </div>
      ${revealed
        ? `<div class="btn-row">
             <button class="btn btn-again" id="again">Again</button>
             <button class="btn btn-good" id="good">Good</button>
           </div>`
        : `<button class="btn" id="show">Show answer</button>`}
      <div class="spacer-12"></div>
      <button class="btn btn-secondary" id="ask">${isAsked(state, card.id) ? '✓ Tagged for tutor' : 'Ask tutor about this'}</button>
    `;
    el.querySelector('#card').addEventListener('click', () => {
      if (!revealed) { revealed = true; paint(); }
    });
    if (!revealed) {
      el.querySelector('#show').addEventListener('click', () => { revealed = true; paint(); });
    } else {
      el.querySelector('#again').addEventListener('click', () => {
        srs.grade(state, card.id, 'again');
        reviewedAny = true;
        storage.save(state);
        i += 1; revealed = false; paint();
      });
      el.querySelector('#good').addEventListener('click', () => {
        srs.grade(state, card.id, 'good');
        reviewedAny = true;
        storage.save(state);
        i += 1; revealed = false; paint();
      });
    }
    el.querySelector('#ask').addEventListener('click', () => {
      if (!state.askTutor.includes(card.id)) state.askTutor.push(card.id);
      else state.askTutor = state.askTutor.filter((x) => x !== card.id);
      storage.save(state);
      paint();
    });
  }

  paint();
}

function isAsked(state, id) {
  return state.askTutor.includes(id);
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
