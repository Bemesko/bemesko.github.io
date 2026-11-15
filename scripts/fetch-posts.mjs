// Refresh src/data/posts.json with the latest posts from the Substack feed.
//
// Substack answers 403 to requests from GitHub Actions runners, so the feed
// is tried directly first (works from a home connection) and then through
// rss2json.com, whose servers fetch it for us. If both fail, the committed
// posts.json is left untouched and the build carries on with it.
//
// Each post keeps: title, url, date, subtitle (only when the post has a real
// one), excerpt (the opening of the text) and minutes (reading time).
import { writeFile } from 'node:fs/promises';

const FEED = 'https://captaindevops.substack.com/feed';
const OUT = new URL('../src/data/posts.json', import.meta.url);
const LIMIT = 5;
const EXCERPT_CHARS = 170;
const WORDS_PER_MINUTE = 230;

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

/** Post HTML to plain text, without Substack's subscribe widgets. */
const toText = (html) =>
  decode(
    html
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/<form[\s\S]*?<\/form>/g, ' ')
      .replace(/<(figcaption|script|style)[\s\S]*?<\/\1>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');

/** Cut at a word boundary and add an ellipsis. */
const clip = (s, max) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.–—-]+$/, '')}…`;
};

function enrich({ title, url, date, description, contentHtml }) {
  const text = toText(contentHtml ?? '');
  const desc = toText(description ?? '');
  // Substack uses the subtitle as the description, or the first lines when
  // there is no subtitle; only keep it when it isn't just the opening text
  const isOpening = desc && text.startsWith(desc.slice(0, 40));
  const words = text.split(' ').filter(Boolean).length;
  return {
    title: decode(title),
    url,
    date,
    subtitle: isOpening ? '' : desc,
    excerpt: clip(text || desc, EXCERPT_CHARS),
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? m[1] : '';
};

async function fromRss() {
  const res = await fetch(FEED, {
    headers: { 'user-agent': 'Mozilla/5.0 (portfolio build)', accept: 'application/rss+xml' },
  });
  if (!res.ok) throw new Error(`feed answered ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) =>
    enrich({
      title: tag(item, 'title'),
      url: decode(tag(item, 'link')),
      date: new Date(decode(tag(item, 'pubDate'))).toISOString(),
      description: tag(item, 'description'),
      contentHtml: tag(item, 'content:encoded'),
    }),
  );
}

async function fromRss2Json() {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED)}`,
  );
  if (!res.ok) throw new Error(`rss2json answered ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(`rss2json said ${data.message ?? data.status}`);
  return data.items.map((i) =>
    enrich({
      title: i.title,
      url: i.link,
      // rss2json returns "YYYY-MM-DD HH:MM:SS" in UTC
      date: new Date(`${i.pubDate.replace(' ', 'T')}Z`).toISOString(),
      description: i.description,
      contentHtml: i.content,
    }),
  );
}

async function main() {
  for (const [name, source] of [
    ['feed', fromRss],
    ['rss2json', fromRss2Json],
  ]) {
    try {
      const posts = (await source())
        .filter((p) => p.title && p.url && !Number.isNaN(Date.parse(p.date)))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, LIMIT);
      if (posts.length === 0) throw new Error('no posts');
      await writeFile(OUT, `${JSON.stringify(posts, null, 2)}\n`);
      console.log(`posts.json: ${posts.length} posts via ${name}, latest "${posts[0].title}"`);
      return;
    } catch (err) {
      console.warn(`posts: ${name} failed (${err.message})`);
    }
  }
  console.warn('posts: every source failed, keeping the committed posts.json');
}

await main();
