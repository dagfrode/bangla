import { parseChapter } from './parser.js';

let chaptersCache = null;
let cardIndexCache = null;

export async function loadChapters() {
  if (chaptersCache) return chaptersCache;
  const idx = await fetch('./content/index.json').then((r) => r.json());
  const chapters = [];
  for (const slug of idx.chapters) {
    const raw = await fetch(`./content/${slug}.md`).then((r) => r.text());
    chapters.push(parseChapter(slug, raw));
  }
  chapters.sort((a, b) => a.order - b.order);
  chaptersCache = chapters;
  cardIndexCache = new Map();
  for (const ch of chapters) {
    for (const card of ch.cards) cardIndexCache.set(card.id, card);
  }
  return chapters;
}

export async function getChapter(slug) {
  const chapters = await loadChapters();
  return chapters.find((c) => c.slug === slug);
}

export async function getCard(id) {
  if (!cardIndexCache) await loadChapters();
  return cardIndexCache.get(id);
}

export async function allCards() {
  const chapters = await loadChapters();
  const out = [];
  for (const ch of chapters) out.push(...ch.cards);
  return out;
}
