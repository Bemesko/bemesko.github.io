// Published at /posts.json so other places (the GitHub profile README) can
// list the latest blog posts without hitting Substack, which blocks CI runners.
import type { APIRoute } from 'astro';
import posts from '../data/posts.json';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(posts.map(({ title, url, date }) => ({ title, url, date }))), {
    headers: { 'Content-Type': 'application/json' },
  });
