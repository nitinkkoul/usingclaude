import { test, expect } from '@playwright/test';
import { uniqueTitle } from '../../utils/dataGenerator';

// API tests use Playwright's built-in `request` fixture — no browser opens.
test.describe('Posts API', () => {
  test('GET a single post', { tag: '@smoke' }, async ({ request }) => {
    const res = await request.get('/posts/1');

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: 1, userId: 1 });
    expect(typeof body.title).toBe('string');
  });

  test('GET posts filtered by user', { tag: '@regression' }, async ({ request }) => {
    const res = await request.get('/posts', { params: { userId: 2 } });

    expect(res.ok()).toBeTruthy();
    const posts: { userId: number }[] = await res.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.userId === 2)).toBe(true);
  });

  test('POST creates a post', { tag: '@smoke' }, async ({ request }) => {
    const payload = { title: uniqueTitle('post'), body: 'created by playwright', userId: 1 };
    const res = await request.post('/posts', { data: payload });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toBeDefined();
  });

  test('PUT updates a post', { tag: '@regression' }, async ({ request }) => {
    const payload = { id: 1, title: 'updated title', body: 'updated', userId: 1 };
    const res = await request.put('/posts/1', { data: payload });

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(payload);
  });

  test('DELETE removes a post', { tag: '@regression' }, async ({ request }) => {
    const res = await request.delete('/posts/1');
    expect(res.status()).toBe(200);
  });

  test('GET unknown post returns 404', { tag: '@regression' }, async ({ request }) => {
    const res = await request.get('/posts/999999');
    expect(res.status()).toBe(404);
  });
});
