# Langla — wedding sprint Bangla app

> **Langla** = **Ba**ngla + **L** (for *learning* and *LLM*).

Live: [dagfrode.github.io/bangla](https://dagfrode.github.io/bangla/)

A mobile-first Progressive Web App for daily Bangla practice, built around a hard deadline: hosting in-laws in Norway for a wedding in August.

- **No build step.** Vanilla JS (ES modules), plain CSS, served as static files.
- **Offline-first.** Installs to home screen, works without network.
- **Content lives in markdown.** One file per chapter under `content/`, parsed at runtime.
- **Progress lives in `localStorage`.** Export / import the JSON to move between devices.

## Run locally

From the repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` on desktop, or `http://<your-laptop-ip>:8000` on your phone (must be on the same Wi-Fi).

Service workers require either `localhost` or HTTPS — `file://` will not work.

## Adding or editing content

Each chapter is a markdown file at `content/NN-slug.md`. Add the slug to `content/index.json`'s `chapters` array (the service worker also lists it in the precache array — update `sw.js` for offline support of new chapters).

### Chapter format (locked — the parser depends on it)

````markdown
---
title: Hospitality
order: 2
tags: [in-laws, food, apni]
description: Welcoming guests, offering food and drink.
---

## Words
- bangla = english
- bangla = english

## Phrases
- bangla = english

## Grammar notes

Free markdown. Headings, paragraphs, bullet lists, pipe tables, inline `code`, **bold**, and blockquotes are rendered.

## Practice prompts
- A thing to try today

## Tutor questions
- Something to confirm next session
````

**Words** and **Phrases** each become flashcards. The card ID is `slug::bangla-side` and is stable: as long as the Bangla string doesn't change, your SRS progress is preserved across edits to the English side.

Add `reference: true` to the frontmatter to mark a chapter as reference-only (it won't generate flashcards). See `content/_reference-verbs.md`.

## How the SRS works

Leitner boxes. Five boxes with intervals **1, 3, 7, 14, 30 days**. Grading:

- **Good** → next box, due in that box's interval
- **Again** → back to box 1, due tomorrow, lapses counter incremented

A daily new-card cap (default 5) is enforced. Adjust under Today → Settings.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Settings → Pages → Branch: `main`, folder: `/ (root)`. Save.
3. Wait ~1 minute. The app is live at `https://<user>.github.io/<repo>/`.
4. Open it on your phone, tap browser menu → **Add to Home Screen**.

The `.nojekyll` file disables Jekyll processing so dotfiles and underscored files (like `_reference-verbs.md`) are served correctly.

## Project layout

```
index.html              PWA shell
manifest.json           PWA manifest
sw.js                   Service worker (offline cache)
icon.svg / icon-maskable.svg
css/style.css
js/
  app.js                hash router + chrome
  parser.js             chapter markdown parser + minimal MD renderer
  content.js            loads all chapter files at startup
  storage.js            localStorage wrapper + checklist rollover + streak
  srs.js                Leitner-box SRS
  views/
    home.js             today: checklist, streak, settings
    review.js           card stack
    chapters.js         list
    chapter.js          single chapter detail
    notepad.js          lesson-prep notepad + ask-tutor collection
content/
  index.json            ordered list of chapter slugs
  00-foundation.md
  01-greetings-and-respect.md
  02-hospitality.md
  03-family-relationships.md
  04-objects-and-spatial.md
  09-feelings-smalltalk.md
  _reference-verbs.md   reference only, no flashcards
bangla.md               raw tutor-session notes (historical)
```

## Roadmap

See [`ROADMAP.md`](./ROADMAP.md) for future content (action verbs, adjectives, daily-routine nouns, connectors, modals) and v2 app feature candidates (audio, YouTube embeds, sentence-builder, conjugation auto-quiz).
