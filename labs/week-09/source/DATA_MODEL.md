# DATA_MODEL.md — การออกแบบฐานข้อมูล Campus Service Request

---

## 1. ภาพรวม

```text
┌─────────────────┐          ┌──────────────────────┐
│ users           │          │ requests             │
├─────────────────┤          ├──────────────────────┤
│ id      (PK)    │◄────────┐│ id            (PK)   │
│ name            │ 1      └│ requester_id  (FK)   │
│ department      │        m │ request_type         │
│ email   (UNIQUE)│          │ location · details   │
└─────────────────┘          │ priority · status    │
                             │ created_at           │
                             └──────────────────────┘

    1 คน แจ้งได้หลายคำร้อง ( One-to-Many )
```

---

## 2. ทำไมต้องแยกเป็น 2 ตาราง

การเก็บข้อมูล `requesterName` รวมไว้ในตารางคำร้อง (เหมือนตอน Week 06-07) จะทำให้เกิดปัญหาความซ้ำซ้อนของข้อมูล (Data Redundancy) และปัญหาอื่นๆ ตามมา เช่น:

- **ปัญหาการแก้ไขข้อมูล (Update Anomaly):** ถ้า "สมชาย" เปลี่ยนชื่อ หรือย้ายภาควิชา เราจะต้องไปค้นหาและตามแก้ข้อมูลของสมชายในทุกๆ คำร้องที่สมชายเคยแจ้งไว้ (ถ้าสมชายมีหลายคำร้อง ก็ต้องแก้ทุกที่) หากแก้ไม่ครบข้อมูลจะขัดแย้งกัน
- **ปัญหาข้อมูลผิดพลาด (Data Inconsistency):** การให้พิมพ์ชื่อใหม่ทุกครั้ง อาจเกิดการพิมพ์ผิด (Typo) เช่น พิมพ์ "สมชาย" เป็น "สมชย" ทำให้เวลาค้นหาหรือสรุปข้อมูล ระบบจะไม่มองว่าเป็นคนเดียวกัน
- **จัดเก็บรายละเอียดเพิ่มเติมได้ยาก:** หากในอนาคตต้องการเก็บข้อมูลอื่นของผู้แจ้งเพิ่ม เช่น เบอร์โทรศัพท์ หรืออีเมล จะต้องเพิ่มคอลัมน์เหล่านี้ในตารางคำร้อง ทำให้ข้อมูลบวมและซ้ำซ้อนหนักขึ้นไปอีก

การแยกเป็น 2 ตาราง (Normalization) และเชื่อมด้วยความสัมพันธ์แบบ 1-to-Many แก้ปัญหาเหล่านี้ได้ เพราะเมื่อผู้ใช้เปลี่ยนชื่อ เราจะแก้ไขเพียง 1 ที่ (ในตาราง `users`) และเมื่อต้องการแสดงผลคำร้องพร้อมชื่อ ระบบก็จะดึงชื่อล่าสุดมาแสดงได้ถูกต้องเสมอผ่านการ `JOIN`

---

## 3. รายละเอียดตาราง

### ตาราง `users`

| คอลัมน์ | ชนิดข้อมูล | ข้อกำหนด (Constraint) | เหตุผลที่เลือก |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | ใช้เป็นรหัสอ้างอิงที่ไม่ซ้ำกันสำหรับผู้ใช้แต่ละคน สร้างขึ้นอัตโนมัติเพื่อความสะดวกและป้องกันการซ้ำซ้อน |
| `name` | TEXT | NOT NULL | ต้องมีชื่อผู้ใช้เสมอ เพื่อให้ทราบว่าใครเป็นคนแจ้งคำร้อง |
| `department` | TEXT | NOT NULL | ต้องระบุภาควิชา เพื่อใช้ประโยชน์ในการกรอง หรือสรุปข้อมูลตามภาควิชาได้ |
| `email` | TEXT | NOT NULL, UNIQUE | ใช้เป็นช่องทางติดต่อหลัก จึงไม่ควรเว้นว่าง และต้องไม่ซ้ำกันเพื่อใช้ระบุตัวตน (หรือใช้ล็อกอิน) |

### ตาราง `requests`

| คอลัมน์ | ชนิดข้อมูล | ข้อกำหนด (Constraint) | เหตุผลที่เลือก |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | ใช้รหัสที่อ่านเข้าใจง่าย เช่น `REQ-001` ตามที่ระบบและผู้ใช้คุ้นเคย |
| `requester_id` | INTEGER | NOT NULL, FOREIGN KEY | เชื่อมโยงไปยัง `users.id` เพื่อระบุตัวผู้แจ้ง ต้องมีเสมอและค่าต้องมีอยู่จริงในตาราง `users` |
| `request_type` | TEXT | NOT NULL, CHECK | ต้องระบุประเภทคำร้อง และจำกัดเฉพาะค่าที่ระบบรองรับเท่านั้น |
| `location` | TEXT | NOT NULL | ข้อมูลสำคัญที่ช่างหรือเจ้าหน้าที่ต้องใช้เพื่อไปปฏิบัติงาน จึงห้ามว่าง |
| `details` | TEXT | NOT NULL | รายละเอียดของปัญหาจำเป็นสำหรับการประเมินงาน |
| `priority` | TEXT | NOT NULL, DEFAULT, CHECK | ระดับความเร่งด่วน มีค่าตั้งต้นเป็น `'normal'` เพื่อลดภาระการกรอกข้อมูล และล็อกค่าให้ถูกต้อง |
| `status` | TEXT | NOT NULL, DEFAULT, CHECK | สถานะคำร้องเริ่มที่ `'pending'` เสมอ และล็อกให้มีเฉพาะสถานะที่ระบบรองรับ |
| `created_at` | TEXT | NOT NULL, DEFAULT | บันทึกเวลาที่แจ้งอัตโนมัติ เพื่อใช้อ้างอิงและเรียงลำดับคำร้อง |

---

## 4. เหตุผลของการเลือกชนิดและข้อกำหนด

### ทำไม `users.id` กับ `requests.id` ใช้ชนิดต่างกัน

- `users.id` ใช้ **INTEGER (AUTOINCREMENT)** เพราะเป็นรหัสที่ระบบใช้จัดการภายใน (Internal ID) เน้นความรวดเร็วในการเชื่อมโยงข้อมูล (JOIN) และสร้างได้ง่ายโดยรันตัวเลขไปเรื่อยๆ
- `requests.id` ใช้ **TEXT** เพราะเป็นรหัสที่ผู้ใช้และเจ้าหน้าที่ต้องใช้สื่อสารกัน (External ID) เช่น `"REQ-001"` ซึ่งการมีตัวอักษรนำหน้าช่วยให้สื่อความหมายได้ชัดเจนกว่าตัวเลขโดดๆ

### ทำไมต้องมี CHECK constraint ทั้งที่ API ก็ตรวจข้อมูลอยู่แล้ว

API เป็นเพียงหน้าด่าน (Application Layer) ในขณะที่ Database เป็นแหล่งเก็บข้อมูลหลักและปราการด่านสุดท้าย (Data Layer) การใส่ CHECK constraint ในระดับฐานข้อมูลคือการทำ **Defense in depth** เพื่อให้แน่ใจว่าแม้จะมีการแทรกแซงโดยตรง (เช่น มีผู้ดูแลระบบเข้าไปรันคำสั่ง SQL เพิ่มข้อมูลเอง หรือมีบั๊กที่หลุดจาก API) ข้อมูลในระบบก็จะไม่ผิดเพี้ยนไปจากรูปแบบที่ควรจะเป็น

---

## 5. ตัวอย่างการใช้ JOIN

```sql
SELECT r.id,
       u.name AS requesterName,
       r.status
FROM requests r
JOIN users u ON u.id = r.requester_id;
```

| id | requesterName | status |
|---|---|---|
| REQ-001 | สมชาย ใจดี | pending |
| REQ-002 | สุภาวดี รักเรียน | in-progress |
| REQ-003 | ธนกฤต ตั้งใจ | completed |
| REQ-004 | สมชาย ใจดี | pending |
| REQ-005 | ปรียา ขยันยิ่ง | pending |
| REQ-006 | สุภาวดี รักเรียน | pending |
| REQ-007 | ธนกฤต ตั้งใจ | in-progress |
| REQ-008 | สมชาย ใจดี | completed |
| REQ-009 | ปรียา ขยันยิ่ง | completed |
| REQ-010 | สุภาวดี รักเรียน | pending |

---

## 6. ข้อสังเกตสำหรับสัปดาห์ที่ 10

เมื่อนำผลลัพธ์ของการทำ JOIN ในสัปดาห์นี้มาเปรียบเทียบกับข้อมูลรูปแบบ JSON ที่ API (Mock Data) ส่งกลับไปให้ React ทำการเรนเดอร์หน้าจอในตอน Week 07 จะพบว่า โครงสร้างของข้อมูลมีรูปแบบ (Shape) ที่ตรงกันพอดี (เช่น มีฟิลด์ `id`, `requesterName`, และ `status` รวมอยู่ในแถวเดียวกันเรียบร้อยแล้ว)

ข้อสังเกตที่สำคัญคือ การใช้คำสั่ง JOIN ของ SQL ช่วยทำหน้าที่ประกอบร่างข้อมูลจาก 2 ตาราง (Data Aggregation) ให้กลายเป็นแผ่นข้อมูลเดียวที่พร้อมใช้งาน (Flat Structure) ซึ่งหมายความว่าในสัปดาห์ที่ 10 เราสามารถนำผลลัพธ์ของ Query นี้ส่งกลับเป็น JSON ให้ฝั่ง Frontend นำไปใช้งานต่อได้ทันที โดยแทบไม่ต้องเขียนโค้ด JavaScript เพิ่มเติมเพื่อดึงข้อมูลผู้ใช้ทีละคนมาแมปเข้ากับคำร้องเองให้ซ้ำซ้อนเลย

---

## 7. ผลการทดสอบ Constraint (Negative Testing)

### ① ทดสอบ Foreign Key Constraint

คำสั่งที่ลอง:

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-TEST-1', 99999, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```

ผลที่ได้: `Error: stepping, FOREIGN KEY constraint failed (19)` ✓ ถูกปฏิเสธตามที่ควร

### ② ทดสอบ CHECK Constraint (status)

คำสั่งที่ลอง:

```sql
INSERT INTO requests (id, requester_id, request_type, location, details, status)
VALUES ('REQ-TEST-2', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ', 'ยกเลิก');
```

ผลที่ได้: `Error: stepping, CHECK constraint failed: status IN ('pending', 'in-progress', 'completed') (19)` ✓ ถูกปฏิเสธตามที่ควร

### ③ ทดสอบ UNIQUE Constraint (email)

คำสั่งที่ลอง:

```sql
INSERT INTO users (name, department, email)
VALUES ('ทดสอบ', 'ทดสอบ', 'somchai@rmutl.ac.th');
```

ผลที่ได้: `Error: stepping, UNIQUE constraint failed: users.email (19)` ✓ ถูกปฏิเสธตามที่ควร

### ④ ทดสอบ UNIQUE Constraint (id)

คำสั่งที่ลอง:

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-001', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```

ผลที่ได้: `Error: stepping, UNIQUE constraint failed: requests.id (19)` ✓ ถูกปฏิเสธตามที่ควร

### ⑤ ทดสอบ NOT NULL Constraint (location)

คำสั่งที่ลอง:

```sql
INSERT INTO requests (id, requester_id, request_type, details)
VALUES ('REQ-TEST-5', 1, 'แจ้งซ่อม', 'ทดสอบระบบ');
```

ผลที่ได้: `Error: stepping, NOT NULL constraint failed: requests.location (19)` ✓ ถูกปฏิเสธตามที่ควร