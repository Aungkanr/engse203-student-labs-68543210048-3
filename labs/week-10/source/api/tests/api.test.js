import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => { await loadSeed(); app = createApp(); });

describe('GET /api/requests', () => {
  test('1. GET /api/requests → 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests').expect(200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. คืน requesterName ไม่ใช่ requester_id', async () => {
    const res = await request(app).get('/api/requests').expect(200);
    if (res.body.length > 0) {
      assert.ok('requesterName' in res.body[0]);
      assert.ok(!('requester_id' in res.body[0]));
    }
  });

  test('3. GET /:id พบ → 200 · ไม่พบ → 404', async () => {
    // พบ
    const res1 = await request(app).get('/api/requests/REQ-001').expect(200);
    assert.equal(res1.body.id, 'REQ-001');

    // ไม่พบ
    await request(app).get('/api/requests/REQ-9999').expect(404);
  });

  test('4. POST ถูกต้อง → 201', async () => {
    const newReq = {
      requesterName: 'นายทดสอบ ทดสอบ',
      requestType: 'แจ้งซ่อม',
      location: 'ห้อง 101',
      details: 'แอร์เสียเปิดไม่ติด',
      priority: 'urgent'
    };
    const res = await request(app).post('/api/requests').send(newReq).expect(201);
    assert.equal(res.body.requesterName, 'นายทดสอบ ทดสอบ');
  });

  test('5. POST ไม่ครบ → 400', async () => {
    const badReq = { requestType: 'แจ้งซ่อม' };
    await request(app).post('/api/requests').send(badReq).expect(400);
  });

  test('6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด', async () => {
    const res = await request(app).get('/api/requests?status=pending\' OR \'1\'=\'1').expect(200);
    // Should get empty array because no status matches exactly "pending' OR '1'='1"
    assert.equal(res.body.length, 0);
  });
});
