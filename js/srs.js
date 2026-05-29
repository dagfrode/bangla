// Leitner-box SRS. Five boxes; intervals in days: 1, 3, 7, 14, 30.
// Cards start unseen (no entry in state.cards). On first grade, they become box 1.
// Grade "good" → box +1, due in interval[box-1] days.
// Grade "again" → back to box 1, due tomorrow, lapses++.

import { today } from './storage.js';

const INTERVALS = [1, 3, 7, 14, 30];

export function ymdAddDays(ymd, days) {
  const d = new Date(ymd);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isDue(entry, t = today()) {
  if (!entry) return false;
  return entry.due <= t;
}

// Returns { due, new } arrays of card IDs (capped by newPerDay).
export function selectReviewQueue(state, allCardIds) {
  const t = today();
  const due = [];
  const newOnes = [];
  for (const id of allCardIds) {
    const entry = state.cards[id];
    if (!entry) newOnes.push(id);
    else if (entry.due <= t) due.push(id);
  }
  const cap = state.settings.newPerDay ?? 5;
  // Shuffle new cards deterministically by day so the same set appears all day
  const shuffled = stableShuffle(newOnes, t);
  return { due, new: shuffled.slice(0, cap) };
}

function stableShuffle(arr, seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function grade(state, cardId, result) {
  const t = today();
  let entry = state.cards[cardId];
  if (!entry) entry = { box: 0, due: t, lapses: 0 };
  if (result === 'good') {
    entry.box = Math.min(entry.box + 1, INTERVALS.length);
  } else {
    entry.box = 1;
    entry.lapses = (entry.lapses || 0) + 1;
  }
  const interval = INTERVALS[entry.box - 1] || 1;
  entry.due = ymdAddDays(t, interval);
  state.cards[cardId] = entry;
}

export function counts(state, allCardIds) {
  const t = today();
  let due = 0, seen = 0;
  for (const id of allCardIds) {
    const e = state.cards[id];
    if (!e) continue;
    seen += 1;
    if (e.due <= t) due += 1;
  }
  return { due, seen, total: allCardIds.length };
}
