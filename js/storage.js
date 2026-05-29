const KEY = 'langla-app-v1';

const DEFAULT_CHECKLIST = [
  { id: 'review', label: 'Review today\'s cards', done: false },
  { id: 'practice', label: 'Practice 3 phrases with fiancée', done: false },
  { id: 'tutor', label: 'Note 1 question for the tutor', done: false },
];

const DEFAULTS = () => ({
  version: 1,
  cards: {},
  streak: { current: 0, longest: 0, lastDay: null },
  checklist: { day: today(), items: DEFAULT_CHECKLIST.map((i) => ({ ...i })) },
  notepad: '',
  askTutor: [],
  settings: { newPerDay: 5 },
});

export function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS();
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS(), ...parsed, settings: { ...DEFAULTS().settings, ...(parsed.settings || {}) } };
  } catch (e) {
    return DEFAULTS();
  }
}

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

// Roll the checklist over if the device date has changed since last write.
// Streak handling: advances when ≥1 review happens on a day; otherwise resets if a day was missed.
export function rollover(state) {
  const t = today();
  if (state.checklist.day === t) return state;
  state.checklist = { day: t, items: DEFAULT_CHECKLIST.map((i) => ({ ...i })) };

  // If lastDay was yesterday, streak continues (already advanced when they reviewed).
  // If lastDay is older than yesterday and not null, streak resets.
  if (state.streak.lastDay) {
    const last = new Date(state.streak.lastDay);
    const yesterday = new Date(t);
    yesterday.setDate(yesterday.getDate() - 1);
    const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (ymd(last) !== ymd(yesterday) && ymd(last) !== t) {
      state.streak.current = 0;
    }
  }
  return state;
}

export function markReviewed(state) {
  const t = today();
  if (state.streak.lastDay !== t) {
    state.streak.current += 1;
    if (state.streak.current > state.streak.longest) state.streak.longest = state.streak.current;
    state.streak.lastDay = t;
  }
}

export function exportJSON(state) {
  return JSON.stringify(state, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) throw new Error('Not a v1 export');
  save(parsed);
  return parsed;
}
