import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('API Requests Tests (CP16)', () => {
  
  // เคสที่ 1
  test('1. GET /api/requests → คืนรายการทั้งหมด (Status 200 และต้องเป็น Array)', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body), 'ข้อมูลที่ตอบกลับมาควรจะเป็น Array');
  });

  // เคสที่ 2
  test('2. GET /api/requests/:id → พบข้อมูล คืน Status 200', async () => {
    // ทริค: ยิงดึงข้อมูลทั้งหมดมาก่อน เพื่อเอา ID แรกสุดมาใช้ทดสอบ
    const list = await request(app).get('/api/requests');
    const firstId = list.body[0].id; 
    
    const res = await request(app).get(`/api/requests/${firstId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, firstId);
  });

  // เคสที่ 3
  test('3. GET /api/requests/:id → ไม่พบข้อมูล คืน Status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999-NOTFOUND');
    assert.equal(res.status, 404);
  });

  // เคสที่ 4
  test('4. POST /api/requests → ข้อมูลถูกต้อง คืน 201 และสถานะตั้งต้นเป็น pending', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id !== undefined, 'เซิร์ฟเวอร์ต้องสร้าง ID กลับมาให้ด้วย');
  });

  // เคสที่ 5
  test('5. POST /api/requests → ข้อมูลไม่ครบ/ผิดเงื่อนไข คืน Status 400', async () => {
    // แกล้งส่งข้อมูลไปไม่ครบ (ขาด location, details, ฯลฯ)
    const invalidData = { requesterName: 'ทดสอบ' }; 
    const res = await request(app).post('/api/requests').send(invalidData);
    assert.equal(res.status, 400);
  });

  // เคสที่ 6
  test('6. ตรวจสอบ CORS header → ตอบ origin ที่อนุญาต', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173'); // จำลองว่ายิงมาจากเว็บ React
      
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
  });

});