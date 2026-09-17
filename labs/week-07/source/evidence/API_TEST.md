# รายงานผลการทดสอบระบบ API (API Test Report)

**โปรเจกต์:** Campus API (Week 07)
**คำสั่งที่ใช้รันการทดสอบ:** `npm run test`
**เครื่องมือทดสอบ:** Node.js Native Test Runner (`node --test`) & Supertest

---

## 📊 สรุปผลการทดสอบ (Test Summary)

* **รวมเคสทั้งหมด:** 6 เคส
* **ผ่าน (Pass):** 6 ✅
* **ไม่ผ่าน (Fail):** 0 ❌
* **เวลาที่ใช้ทั้งหมด:** 390.429 ms
* **สถานะ:** **พร้อมใช้งาน (All Tests Passed)** 

---

## 📝 รายละเอียดเทสต์เคส (Test Cases)

| # | HTTP Method | Endpoint | รายละเอียดการทดสอบ (Description) | Status Code ที่คาดหวัง | ผลลัพธ์ |
|---|-------------|----------|----------------------------------|------------------------|---------|
| 1 | `GET` | `/api/requests` | คืนรายการทั้งหมด (Status 200 และต้องเป็น Array) | `200 OK` | ✅ ผ่าน |
| 2 | `GET` | `/api/requests/:id` | พบข้อมูล คืน Status 200 | `200 OK` | ✅ ผ่าน |
| 3 | `GET` | `/api/requests/:id` | ไม่พบข้อมูล คืน Status 404 | `404 Not Found` | ✅ ผ่าน |
| 4 | `POST` | `/api/requests` | ข้อมูลถูกต้อง คืน 201 และสถานะตั้งต้นเป็น pending | `201 Created` | ✅ ผ่าน |
| 5 | `POST` | `/api/requests` | ข้อมูลไม่ครบ/ผิดเงื่อนไข คืน Status 400 | `400 Bad Request` | ✅ ผ่าน |
| 6 | `GET` | `/api/requests` | ตรวจสอบ CORS header -> ตอบ origin ที่อนุญาต | `200 OK` | ✅ ผ่าน |

---

## 💻 บันทึกการรันคำสั่ง (Execution Log)

```text
> engse203-week06-campus-api@2.0.0 test
> node --test "tests/*.test.js"

::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "GET /api/requests HTTP/1.1" 200 1030 "-" "-"
▶ API Requests Tests (CP16)
  ✔ 1. GET /api/requests -> คืนรายการทั้งหมด (Status 200 และต้องเป็น Array) (28.883507ms)
::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "GET /api/requests HTTP/1.1" 200 1030 "-" "-"
::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "GET /api/requests/REQ-001 HTTP/1.1" 200 321 "-" "-"
  ✔ 2. GET /api/requests/:id -> พบข้อมูล คืน Status 200 (14.296791ms)
::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "GET /api/requests/REQ-999-NOTFOUND HTTP/1.1" 404 74 "-" "-"
  ✔ 3. GET /api/requests/:id -> ไม่พบข้อมูล คืน Status 404 (10.958931ms)
::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "POST /api/requests HTTP/1.1" 201 258 "-" "-"
  ✔ 4. POST /api/requests -> ข้อมูลถูกต้อง คืน 201 และสถานะตั้งต้นเป็น pending (28.336485ms)
::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "POST /api/requests HTTP/1.1" 400 406 "-" "-"
  ✔ 5. POST /api/requests -> ข้อมูลไม่ครบ/ผิดเงื่อนไข คืน Status 400 (8.403052ms)
::ffff:127.0.0.1 - - [17/Sep/2026:15:47:36 +0000] "GET /api/requests HTTP/1.1" 200 1289 "-" "-"
  ✔ 6. ตรวจสอบ CORS header -> ตอบ origin ที่อนุญาต (5.147696ms)
✔ API Requests Tests (CP16) (104.700059ms)
ℹ tests 6
ℹ suites 1
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 390.429401