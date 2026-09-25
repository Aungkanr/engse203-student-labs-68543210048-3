# หลักฐานการปฏิบัติการ (EVIDENCE.md)
## LAB 09 — ฐานข้อมูลเชิงสัมพันธ์และภาษา SQL (Relational Databases & SQL)

**ชื่อ-สกุล:** นาย อังคาร สกุลบุญดี
**รหัสนักศึกษา:** 68543210048-3
**สถานะการประเมิน:** 

---

## 1. ผลการตรวจสอบด้วยสคริปต์อัตโนมัติ (Automated Checker)

ผลการทดสอบด้วยคำสั่ง `node --disable-warning=ExperimentalWarning check-week09.mjs`:

```text
✅ FILE มีไฟล์ campus.db
✅ FILE มีไฟล์ schema.sql
✅ CP19 มีตาราง users
✅ CP19 มีตาราง requests
✅ CP19 users มีคอลัมน์ id, name, department
✅ CP19 requests มีคอลัมน์ครบตามที่ออกแบบ
✅ CP18 ทั้งสองตารางมี Primary Key
✅ CP18 requests มี Foreign Key ชี้ไป users
✅ CP19 requests มีคอลัมน์ NOT NULL อย่างน้อย 5 คอลัมน์
✅ CP19 มีข้อมูลใน users อย่างน้อย 4 คน
✅ CP19 มีข้อมูลใน requests อย่างน้อย 5 รายการ
✅ CP22 เพิ่มข้อมูลเองแล้ว — requests อย่างน้อย 8 รายการ
✅ CP21 JOIN ระหว่าง requests กับ users ทำงานได้
✅ CP21 ไม่มีคำร้องที่ชี้ไปผู้ใช้ที่ไม่มีจริง
✅ CP25 Foreign Key ปฏิเสธ requester_id ที่ไม่มีจริง
✅ CP25 ปฏิเสธ id ที่ซ้ำกับของเดิม
✅ CP23 schema.sql มี CREATE TABLE ทั้งสองตาราง
✅ CP23 schema.sql มี FOREIGN KEY หรือ REFERENCES
✅ CP23 schema.sql รันซ้ำได้ (มี DROP TABLE IF EXISTS)
✅ CP23 schema.sql มี INSERT ข้อมูลตั้งต้น
✅ CP23 schema.sql รันจริงแล้วสร้างฐานข้อมูลได้
✅ CP24 มีไฟล์ DATA_MODEL.md
✅ CP24 อธิบายเหตุผลที่แยก users ออกจาก requests
✅ CP22 มีไฟล์ queries.sql
✅ CP22 queries.sql มีคำสั่ง SELECT อย่างน้อย 8 ข้อ
✅ CP22 queries.sql มีการใช้ JOIN
✅ CP22 queries.sql มีการใช้ WHERE และ ORDER BY
✅ CHAL ⭐ ใช้ GROUP BY สรุปข้อมูล
✅ CHAL ⭐ ใช้ฟังก์ชันรวม (COUNT/SUM/AVG)
✅ CHAL ⭐ สร้าง INDEX เพื่อให้ค้นเร็วขึ้น

──────────────────────────────────────────────────────────
🏫 ในห้อง (CP17–CP21)   ผ่าน 11/11 รายการ
🏠 ที่บ้าน (CP22–CP25)   ผ่าน 16/16 รายการ
⭐ Challenge            ผ่าน 3/3 รายการ
──────────────────────────────────────────────────────────
ผ่าน 30/30 รายการ
```

---

## 2. โครงสร้างฐานข้อมูลจริง (Database Schema Verification)

### ตาราง `users`
ตรวจสอบผ่าน `PRAGMA table_info(users);`:
```text
cid  name        type     notnull  dflt_value  pk
---  ----------  -------  -------  ----------  --
0    id          INTEGER  0                    1 
1    name        TEXT     1                    0 
2    department  TEXT     1                    0 
3    email       TEXT     1                    0
```

### ตาราง `requests`
ตรวจสอบผ่าน `PRAGMA table_info(requests);`:
```text
cid  name          type     notnull  dflt_value                   pk
---  ------------  -------  -------  ---------------------------  --
0    id            TEXT     0                                     1 
1    requester_id  INTEGER  1                                     0 
2    request_type  TEXT     1                                     0 
3    location      TEXT     1                                     0 
4    details       TEXT     1                                     0 
5    priority      TEXT     1        'normal'                     0 
6    status        TEXT     1        'pending'                    0 
7    created_at    TEXT     1        datetime('now','localtime')  0
```

### การตรวจสอบ Foreign Key และ Index
- **Foreign Key List (`PRAGMA foreign_key_list(requests);`):**
  - ชี้จาก `requests.requester_id` ไปยัง `users.id` (ตารางแม่: `users`)
- **Index List (`PRAGMA index_list(requests);`):**
  - `idx_requests_status` บนคอลัมน์ `status`
  - `idx_requests_requester` บนคอลัมน์ `requester_id`

---

## 3. หลักฐานการทดสอบข้อกำหนด Constraint (Negative Testing — CP25)

การทดสอบนี้พิสูจน์ว่าฐานข้อมูลปฏิเสธข้อมูลที่ผิดรูปแบบอย่างถูกต้องครบทั้ง 5 กรณี:

### ① Foreign Key
**คำสั่งที่ลอง:**
```sql
INSERT INTO requests (id, requester_id, request_type, location, details) VALUES ('REQ-TEST-1', 99999, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```
**ผลที่ได้:** 
`Error: stepping, FOREIGN KEY constraint failed (19)` ✓ ถูกปฏิเสธตามที่ควร

### ② CHECK Constraint (status)
**คำสั่งที่ลอง:**
```sql
INSERT INTO requests (id, requester_id, request_type, location, details, status) VALUES ('REQ-TEST-2', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ', 'ยกเลิก');
```
**ผลที่ได้:** 
`Error: stepping, CHECK constraint failed: status IN ('pending', 'in-progress', 'completed') (19)` ✓ ถูกปฏิเสธตามที่ควร

### ③ UNIQUE Constraint (email)
**คำสั่งที่ลอง:**
```sql
INSERT INTO users (name, department, email) VALUES ('ทดสอบ', 'ทดสอบ', 'somchai@rmutl.ac.th');
```
**ผลที่ได้:** 
`Error: stepping, UNIQUE constraint failed: users.email (19)` ✓ ถูกปฏิเสธตามที่ควร

### ④ UNIQUE Constraint (id)
**คำสั่งที่ลอง:**
```sql
INSERT INTO requests (id, requester_id, request_type, location, details) VALUES ('REQ-001', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```
**ผลที่ได้:** 
`Error: stepping, UNIQUE constraint failed: requests.id (19)` ✓ ถูกปฏิเสธตามที่ควร

### ⑤ NOT NULL Constraint (location)
**คำสั่งที่ลอง:**
```sql
INSERT INTO requests (id, requester_id, request_type, details) VALUES ('REQ-TEST-5', 1, 'แจ้งซ่อม', 'ทดสอบระบบ');
```
**ผลที่ได้:** 
`Error: stepping, NOT NULL constraint failed: requests.location (19)` ✓ ถูกปฏิเสธตามที่ควร

---

## 4. ผลลัพธ์การรันคำสั่ง Query ทั้งหมดจาก `queries.sql` (CP22 & Challenge)

### ① คำร้องทั้งหมด เรียงตามรหัส (`ORDER BY`)
```sql
SELECT * FROM requests ORDER BY id;
```
**ผลลัพธ์ (10 แถว):**
```text
id       requester_id  request_type       location                details                              priority  status       created_at         
-------  ------------  -----------------  ----------------------  -----------------------------------  --------  -----------  -------------------
REQ-001  1             แจ้งซ่อม           ห้องปฏิบัติการ 301      เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า  urgent    pending      2026-09-24 20:51:59
REQ-002  2             บริการบัญชีผู้ใช้  อาคารวิศวกรรมซอฟต์แวร์  เข้าสู่ระบบห้องปฏิบัติการไม่ได้      normal    in-progress  2026-09-24 20:51:59
REQ-003  3             ขอใช้อุปกรณ์       ห้องประชุม 2            ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน  normal    completed    2026-09-24 20:51:59
REQ-004  1             แจ้งซ่อม           ห้องปฏิบัติการ 302      คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด   urgent    pending      2026-09-24 20:51:59
REQ-005  4             อื่น ๆ             ห้องสมุด ชั้น 2         ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ  normal    pending      2026-09-24 20:51:59
REQ-006  2             แจ้งซ่อม           ห้องปฏิบัติการ 401      ไฟในห้องกะพริบตลอดเวลา               normal    pending      2026-09-24 20:51:59
REQ-007  3             ขอใช้อุปกรณ์       ห้องประชุม 1            ขอยืมโปรเจคเตอร์เพิ่ม                urgent    in-progress  2026-09-24 20:51:59
REQ-008  1             บริการบัญชีผู้ใช้  อาคารวิศวกรรม           รีเซ็ตรหัสผ่านเข้าระบบ               normal    completed    2026-09-24 20:51:59
REQ-009  4             ขอใช้อุปกรณ์       ห้องสมุด                ขอยืมหูฟังสำหรับเรียนออนไลน์         normal    completed    2026-09-24 20:51:59
REQ-010  2             แจ้งซ่อม           อาคารเรียนรวม           หน้าต่างในห้องเรียนปิดไม่ได้         urgent    pending      2026-09-24 20:51:59
```

---

### ② คำร้องที่ยังไม่ได้ดำเนินการ (`WHERE status = 'pending'`)
```sql
SELECT id, location, details FROM requests
WHERE status = 'pending'
ORDER BY id;
```
**ผลลัพธ์:**
```text
id       location            details                            
-------  ------------------  -----------------------------------
REQ-001  ห้องปฏิบัติการ 301     เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า
REQ-004  ห้องปฏิบัติการ 302     คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด 
REQ-005  ห้องสมุด ชั้น 2        ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ
REQ-006  ห้องปฏิบัติการ 401     ไฟในห้องกะพริบตลอดเวลา             
REQ-010  อาคารเรียนรวม         หน้าต่างในห้องเรียนปิดไม่ได้
```

---

### ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ (`WHERE priority = 'urgent' AND status != 'completed'`)
```sql
SELECT * FROM requests WHERE priority = 'urgent' AND status != 'completed';
```
**ผลลัพธ์:**
```text
id       requester_id  request_type  location            details                              priority  status       created_at         
-------  ------------  ------------  ------------------  -----------------------------------  --------  -----------  -------------------
REQ-001  1             แจ้งซ่อม      ห้องปฏิบัติการ 301   เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า               urgent    pending      2026-09-24 20:51:59
REQ-004  1             แจ้งซ่อม      ห้องปฏิบัติการ 302   คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด                urgent     pending      2026-09-24 20:51:59
REQ-007  3             ขอใช้อุปกรณ์  ห้องประชุม 1        ขอยืมโปรเจคเตอร์เพิ่ม                        urgent     in-progress  2026-09-24 20:51:59
REQ-010  2             แจ้งซ่อม      อาคารเรียนรวม      หน้าต่างในห้องเรียนปิดไม่ได้                    urgent     pending      2026-09-24 20:51:59
```

---

### ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด (`LIKE`)
```sql
SELECT * FROM requests WHERE details LIKE '%ไม่ทำงาน%';
```
**ผลลัพธ์:**
```text
id       requester_id  request_type  location            details                              priority  status   created_at         
-------  ------------  ------------  ------------------  -----------------------------------  --------  -------  -------------------
REQ-001  1             แจ้งซ่อม      ห้องปฏิบัติการ 301  เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า  urgent    pending  2026-09-24 20:51:59
```

---

### ⑤ คำร้องพร้อมชื่อผู้แจ้ง (`JOIN`)
```sql
SELECT r.id,
       u.name AS requesterName,
       r.status
FROM requests r
JOIN users u ON u.id = r.requester_id;
```
**ผลลัพธ์:**
```text
id       requesterName     status     
-------  ----------------  -----------
REQ-001  สมชาย ใจดี        pending    
REQ-002  สุภาวดี รักเรียน  in-progress
REQ-003  ธนกฤต ตั้งใจ      completed  
REQ-004  สมชาย ใจดี        pending    
REQ-005  ปรียา ขยันยิ่ง    pending    
REQ-006  สุภาวดี รักเรียน  pending    
REQ-007  ธนกฤต ตั้งใจ      in-progress
REQ-008  สมชาย ใจดี        completed  
REQ-009  ปรียา ขยันยิ่ง    completed  
REQ-010  สุภาวดี รักเรียน  pending
```

---

### ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง (`JOIN` + `WHERE`)
```sql
SELECT r.id, u.name, r.details
FROM requests r
JOIN users u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;
```
**ผลลัพธ์:**
```text
id       name              details                            
-------  ----------------  -----------------------------------
REQ-001  สมชาย ใจดี        เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า
REQ-002  สุภาวดี รักเรียน  เข้าสู่ระบบห้องปฏิบัติการไม่ได้    
REQ-004  สมชาย ใจดี        คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด 
REQ-006  สุภาวดี รักเรียน  ไฟในห้องกะพริบตลอดเวลา             
REQ-008  สมชาย ใจดี        รีเซ็ตรหัสผ่านเข้าระบบ             
REQ-010  สุภาวดี รักเรียน  หน้าต่างในห้องเรียนปิดไม่ได้
```

---

### ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน (`DISTINCT`)
```sql
SELECT DISTINCT u.name
FROM requests r
JOIN users u ON u.id = r.requester_id;
```
**ผลลัพธ์:**
```text
name            
----------------
สมชาย ใจดี      
สุภาวดี รักเรียน
ธนกฤต ตั้งใจ    
ปรียา ขยันยิ่ง
```

---

### ⑧ คำร้อง 3 รายการล่าสุด (`ORDER BY` + `LIMIT`)
```sql
SELECT id, created_at, details FROM requests ORDER BY created_at DESC LIMIT 3;
```
**ผลลัพธ์:**
```text
id       created_at           details                            
-------  -------------------  -----------------------------------
REQ-001  2026-09-24 20:51:59  เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า
REQ-002  2026-09-24 20:51:59  เข้าสู่ระบบห้องปฏิบัติการไม่ได้    
REQ-003  2026-09-24 20:51:59  ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน
```

---

### ⭐ Challenge ⑨: นับจำนวนคำร้องแยกตามสถานะ (`GROUP BY` + `COUNT`)
```sql
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC;
```
**ผลลัพธ์:**
```text
status       total
-----------  -----
pending      5    
completed    3    
in-progress  2
```

---

### ⭐ Challenge ⑩: สรุปผู้แจ้งและจำนวนคำร้อง (`LEFT JOIN` + `COUNT`)
```sql
SELECT u.name, u.department, COUNT(r.id) AS total
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id
ORDER BY total DESC, u.name;
```
**ผลลัพธ์:**
```text
name              department         total
----------------  -----------------  -----
สมชาย ใจดี        วิศวกรรมซอฟต์แวร์  3    
สุภาวดี รักเรียน  วิศวกรรมซอฟต์แวร์  3    
ธนกฤต ตั้งใจ      วิศวกรรมไฟฟ้า      2    
ปรียา ขยันยิ่ง    สำนักวิทยบริการ    2
```

---

### ⭐ Challenge ⑪: สร้าง INDEX เพิ่มความเร็วในการค้นหา
```sql
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
```
**ผลการตรวจสอบ Index ใน SQLite:**
- `idx_requests_status` ถูกสร้างขึ้นเพื่อเร่งความเร็วในการกรองข้อมูลด้วย `WHERE status = ...` และ `GROUP BY status`
- `idx_requests_requester` ถูกสร้างขึ้นเพื่อเร่งความเร็วในการ `JOIN` ตาราง `requests` เข้ากับ `users` ผ่านคอลัมน์ `requester_id`

---

## 5. การทดสอบความสามารถในการรันซ้ำของ Schema (Idempotency — CP23)

ได้ทำการทดสอบรันไฟล์ `schema.sql` ซ้ำมากกว่า 2 ครั้งทั้งบน In-Memory Database และบนไฟล์ `campus.db`:
- มีคำสั่ง `PRAGMA foreign_keys = ON;` ที่ต้นไฟล์
- มีคำสั่งลบตารางเดิมตามลำดับความสัมพันธ์:
  ```sql
  DROP TABLE IF EXISTS requests;
  DROP TABLE IF EXISTS users;
  ```
  *(ลบตารางลูก `requests` ที่มี Foreign Key ก่อน แล้วจึงลบตารางแม่ `users`)*
- ผลการรันซ้ำ: ทำงานได้สำเร็จโดยไม่เกิด Error `table ... already exists` หรือติดปัญหา Foreign Key Lock ใดๆ

---

## 6. สรุปความพร้อมในการส่งมอบสำหรับสัปดาห์ที่ 10 (Handover Summary)

| ไฟล์ที่ส่งมอบ       | สถานะ                  | สิ่งที่พร้อมนำไปใช้ในสัปดาห์ที่ 10                                                                          |
| --------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| `campus.db`     | พร้อมใช้งาน (SQLite3 DB) | Node.js (สัปดาห์ที่ 10) สามารถเชื่อมต่อผ่าน `node:sqlite` ได้ทันที มีข้อมูล 2 ตาราง ครบทั้ง Constraint และ Index |
| `schema.sql`    | สมบูรณ์ 100%             | ใช้เป็น Migration Script สร้างและตั้งค่าฐานข้อมูลใหม่ได้ทุกเมื่ออย่างอัตโนมัติ                                    |
| `queries.sql`   | ผ่านการทดสอบจริง         | พร้อมนำคำสั่ง SQL โดยเฉพาะ Query ข้อ ⑤ (JOIN) ไปใส่ใน `requestService.js` ได้ทันที                         |
| `DATA_MODEL.md` | เอกสารสมบูรณ์            | ใช้เป็น Architecture Reference สำหรับทีมพัฒนาในการออกแบบ Service Layer และ DTO                         |
