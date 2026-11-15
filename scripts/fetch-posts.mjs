// Refresh src/data/posts.json with the latest posts from the Substack feed.
//
// Substack answers 403 to requests from GitHub Actions runners, so the feed
// is tried directly first (works from a home connection) and then through
// rss2json.com, whose servers fetch it for us. If both fail, the committed
// posts.json is left untouched and the build carries on with it.
import { writeFile } from 'node:fs/promises';

const FEED = 'https://captaindevops.substack.com/feed';
const OUT = new URL('../src/data/posts.json', import.meta.url);
const LIMIT = 5;

const decode = (s) =>
  s
    .replace(/^<!\[CDATA\[|\]\]>$/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : '';
};

async function fromRss() {
  const res = await fetch(FEED, {
    headers: { 'user-agent': 'Mozilla/5.0 (portfolio build)', accept: 'application/rss+xml' },
  });
  if (!res.ok) throw new Error(`feed answered ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    title: tag(item, 'title'),
    url: tag(item, 'link'),
    date: new Date(tag(item, 'pubDate')).toISOString(),
    excerpt: tag(item, 'description'),
  }));
}

async function fromRss2Json() {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED)}`,
  );
  if (!res.ok) throw new Error(`rss2json answered ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(`rss2json said ${data.message ?? data.status}`);
  return data.items.map((i) => ({
    title: i.title,
    url: i.link,
    // rss2json returns "YYYY-MM-DD HH:MM:SS" in UTC
    date: new Date(`${i.pubDate.replace(' ', 'T')}Z`).toISOString(),
    excerpt:
      i.description
        ?.replace(/<[^>]+>/g, '')
        .trim()
        .slice(0, 200) ?? '',
  }));
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
