// Parses a chapter markdown file into a structured object.
// Format (locked):
//   ---
//   title: ...
//   order: N
//   tags: [a, b]
//   description: ...
//   reference: true  # optional, hides from SRS
//   ---
//   ## Words
//   - bangla = english
//   ## Phrases
//   - bangla = english
//   ## Grammar notes
//   <free markdown>
//   ## Practice prompts
//   - item
//   ## Tutor questions
//   - item

const FRONT_RE = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

function parseFrontmatter(text) {
  const m = text.match(FRONT_RE);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    } else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (/^-?\d+$/.test(val)) val = parseInt(val, 10);
    meta[key] = val;
  }
  return { meta, body: text.slice(m[0].length) };
}

function splitSections(body) {
  const sections = {};
  const lines = body.split('\n');
  let current = null;
  let buf = [];
  const flush = () => {
    if (current) sections[current] = buf.join('\n').trim();
    buf = [];
  };
  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      flush();
      current = h[1].trim();
    } else if (current) {
      buf.push(line);
    }
  }
  flush();
  return sections;
}

function parsePairs(text) {
  if (!text) return [];
  return text.split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((l) => l.replace(/^-\s*/, ''))
    .map((l) => {
      const idx = l.indexOf(' = ');
      if (idx === -1) return null;
      const bangla = l.slice(0, idx).trim();
      const english = l.slice(idx + 3).trim();
      return { bangla, english };
    })
    .filter(Boolean);
}

function parseList(text) {
  if (!text) return [];
  return text.split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter(Boolean);
}

// Minimal markdown renderer for grammar notes — headings, paragraphs, lists, inline code, bold.
export function renderMarkdown(text) {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/);
  const out = [];
  for (const block of blocks) {
    const t = block.trim();
    if (!t) continue;
    if (t.startsWith('### ')) out.push(`<h3>${inline(t.slice(4))}</h3>`);
    else if (t.startsWith('## ')) out.push(`<h2>${inline(t.slice(3))}</h2>`);
    else if (t.startsWith('# ')) out.push(`<h1>${inline(t.slice(2))}</h1>`);
    else if (/^[-*]\s/.test(t)) {
      const items = t.split('\n').filter((l) => /^[-*]\s/.test(l)).map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`);
      out.push(`<ul>${items.join('')}</ul>`);
    } else if (t.startsWith('|')) {
      // simple pipe table
      const rows = t.split('\n').filter((l) => l.trim().startsWith('|'));
      const cells = rows.map((r) => r.split('|').slice(1, -1).map((c) => c.trim()));
      const isSep = (row) => row.every((c) => /^:?-+:?$/.test(c));
      let html = '<div class="tablewrap"><table>';
      cells.forEach((row, i) => {
        if (isSep(row)) return;
        const tag = i === 0 ? 'th' : 'td';
        html += '<tr>' + row.map((c) => `<${tag}>${inline(c)}</${tag}>`).join('') + '</tr>';
      });
      html += '</table></div>';
      out.push(html);
    } else if (t.startsWith('> ')) {
      out.push(`<blockquote>${inline(t.replace(/^>\s?/gm, ''))}</blockquote>`);
    } else {
      out.push(`<p>${inline(t).replace(/\n/g, '<br>')}</p>`);
    }
  }
  return out.join('\n');
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  let t = escapeHtml(s);
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return t;
}

export function parseChapter(slug, raw) {
  const { meta, body } = parseFrontmatter(raw);
  const sections = splitSections(body);
  const words = parsePairs(sections['Words']);
  const phrases = parsePairs(sections['Phrases']);
  const prompts = parseList(sections['Practice prompts']);
  const tutorQs = parseList(sections['Tutor questions']);
  const grammar = sections['Grammar notes'] || '';

  const cards = [];
  if (!meta.reference) {
    for (const w of words) cards.push({ id: `${slug}::${w.bangla}`, slug, kind: 'word', bangla: w.bangla, english: w.english });
    for (const p of phrases) cards.push({ id: `${slug}::${p.bangla}`, slug, kind: 'phrase', bangla: p.bangla, english: p.english });
  }

  return {
    slug,
    title: meta.title || slug,
    order: typeof meta.order === 'number' ? meta.order : 100,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    description: meta.description || '',
    reference: !!meta.reference,
    words,
    phrases,
    prompts,
    tutorQs,
    grammar,
    cards,
  };
}
