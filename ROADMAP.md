# Roadmap — future development

A standing note of what to add later, in priority order. Not a commitment — a menu.

## Content to add (in roughly this order)

The current 7 chapters + 2 bonus chapters cover the in-law-hosting core. After 1–2 weeks of drilling, the gaps you hit in real conversation will tell you what to add next. Likely candidates:

### Main chapter slots still open (05–08)
- **`05-food-and-meals.md`** — types of food, spices, taste words (`mishti`, `tetto`, `jhal`), "more please" / "less please", "no thank you, I'm full", common dishes (`bhat`, `dal`, `tarkari`, `mach`, `mangsho`, `roti`). Heavy daily use during the visit.
- **`06-weather-and-norway.md`** — snow (`bauph`/loanword), rain (`brishti`), cloudy (`megla`), sunshine (`rod`), beautiful (`shundor`), "this is Oslo", "we live near…". Plus survival tour-guide phrases.
- **`07-daily-routine.md`** — wake (`utha`), wash (`dhowa`), dress (`pora`), morning routine, walk (`hata`), shop (`bajar kora`), come back home. Extracts directly from your existing `bangla.md` lines 135–185.
- **`08-wedding-and-blessings.md`** — ceremony terms (`biye`, `gaye holud`, `mehedi`), congratulations, blessings, "thank you for coming", photo phrases.

### Cross-cutting vocabulary chapters (post-wedding-deck, when you outgrow the core)

Add as separate themed chapters when you're ready for breadth:

- **Action verbs (extended)** — `lekha` (write), `pora` (read), `ghumano` (sleep), `utha` (wake), `dhowa` (wash), `shesh kora` (finish), `shuru kora` (start), `kaj kora` (work), `kena` (buy), `becha` (sell), `taka dewa` (pay), `bujha` (understand), `bhula` (forget), `mone rakha` (remember), `cheshta kora` (try), `opekkha kora` (wait). Each with apni-form conjugation row in the reference doc.
- **Adjectives** — `notun`/`puratan` (new/old), `shoja`/`koshTo` (easy/hard), `nongra`/`porishkar` (dirty/clean), `kachhe`/`dure` (near/far), `taratari`/`aste` (fast/slow), `bhora`/`khali` (full/empty), `Thik`/`bhul` (right/wrong), `shotti`/`mittha` (true/false).
- **Concrete nouns (daily)** — `taka` (money), `phone` (phone), `chabi` (key), `bag` (bag), `kapor` (clothes), `juto` (shoes), `pani` / `tel` (water/oil), `lobon` (salt), `chini` (sugar), `rasta` (road), `gari` (car), `bus` (bus), `train` / `rail` (train), `bank` (bank), `bajar` (market), `dokan` (shop), `daktar` (doctor), `oushod` (medicine), `kaj` (work/job), `shomossha` (problem).
- **Time adverbs** — `kal` (yesterday OR tomorrow — context decides!), `aage` (before/earlier), `pore` (after/later), `ekhon` (now), `tokhon` (then), `shobshomoy` (always), `kokhono na` (never), `mazhe mazhe` (sometimes), `prai` (often).
- **Connectors** — `ar` / `ebong` (and), `kintu` (but), `othoba` / `ba` (or), `karon` (because), `jodi` (if), `jokhon` (when), `kintu o` (but also), `tobu o` (still / nevertheless).
- **Modals & ability** — `parte para` (can/be able), `uchit` (should/ought), `chai` (want), `dorkar` (need — already have), `bhalo lagbe` (would like).

### Numbers above 20 (deferred)
The bonus chapter teaches 13–20 + round tens + 100/1000. The full 21–99 set is ~80 individually irregular words — too much for a 3-month sprint. Recommendation: add a `bonus-numbers-21-99.md` chapter **only** if you find yourself stuck mid-conversation needing them. Many Bangladeshis use English numbers in mixed speech anyway.

## App features (v2 candidates)

Ranked by ROI for the wedding goal:

1. **Tutor-recorded audio per card** — slot exists in the data model concept, just needs a `mp3` path field per word/phrase and a play button in the review view. Highest impact on pronunciation.
2. **YouTube embeds per chapter** — drop a `youtube:` key in chapter frontmatter, render as embedded iframe in the chapter detail. Good for shadowing practice, easy to add.
3. **Sentence-builder drill** — present the English sentence, show the Bangla words shuffled, user taps them in order. Trains production, not just recognition. ~1 day of work.
4. **Conjugation auto-quiz** — given a verb infinitive + tense + person, type the conjugated form. Validates against `_reference-verbs.md` table.
5. **Anki export** — one-click "download `.apkg`" so progress isn't trapped if the user wants to switch tools. Defensive feature.
6. **Multi-device sync** — currently you can export/import JSON manually. Real sync needs a backend (out of scope for static hosting). Skip unless it becomes painful.
7. **Norwegian L1 toggle** — show NO translations beside EN on cards. Useful when the English meaning is ambiguous (e.g. `lagchhe` doesn't map cleanly).
8. **Per-chapter test mode** — drill only one chapter's cards in a focused session, separate from the daily SRS queue. Useful right before a tutor session.

## Process / discipline notes

- **Drill first, expand second.** Adding 500 cards before the existing 226 are familiar means you drown. Wait until you can do a full review session in under 5 minutes before adding a new chapter.
- **Use the in-chapter "Tutor questions" as your standing session agenda.** The notepad's auto-collected ask-tutor list adds to this — bring both to the tutor each week.
- **Lock in the `apni` register first.** Mixing in `tumi` forms (which the existing notes have) is fine for your fiancée but risky with in-laws. Resist the temptation to "learn both at once."
- **Every new chapter should answer: will this come up while hosting in-laws in Norway?** If no, defer until after August.
- **Audio comes from the tutor, not TTS.** When you start recording phrases, do it with the tutor's voice. Browser TTS for Bangla teaches the wrong rhythm.

## Open meta-questions for you

- Will your in-laws speak any English at all, or strictly Bangla? (Affects how much *production* you need vs. *comprehension*.)
- Are there other Bangladeshis in your Norwegian circle you can practise with between tutor sessions?
- Is your fiancée willing to do 10-minute "in-law roleplay" sessions where she pretends to be her mother? (Cheapest, highest-yield practice.)
