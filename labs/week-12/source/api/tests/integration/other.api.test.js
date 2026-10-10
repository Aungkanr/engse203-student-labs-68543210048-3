import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

const app = createApp();

beforeEach(async () => {
  await loadSeed();
});

describe('Other endpoints', () => {
  test('GET /api/health', async () => {
    await request(app).get('/api/health').expect(200);
  });
  
  test('GET /api/nope (404)', async () => {
    await request(app).get('/api/nope').expect(404);
  });

  test('GET /api/users', async () => {
    await request(app).get('/api/users').expect(200);
  });
});

describe('Root and Logger', () => {
  test('GET /', async () => {
    await request(app).get('/').expect(200);
  });
});
