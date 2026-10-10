# Campus Service — Full-Stack Integration (Week 11)

ระบบบริหารจัดการคำร้องบริการภายในมหาวิทยาลัย (Campus Service Request System) แบบ Full-Stack พัฒนาขึ้นโดยบูรณาการ React, Express, และ SQLite เข้าด้วยกัน พร้อมรองรับการรันทั้งในโหมด Development และ Production ด้วย Single Port สถาปัตยกรรมพร้อมใช้งานจริง

---

## 1. ภาพรวมระบบ (Overview)

ระบบช่วยให้บุคลากรและนักศึกษาสามารถส่งคำร้อง ติดตามสถานะ และจัดการคำร้องบริการต่างๆ เช่น การแจ้งซ่อม, การขอใช้อุปกรณ์, และบริการบัญชีผู้ใช้ 

### เทคโนโลยีที่ใช้
- **Frontend:** React (Vite), React Router, CSS Variables
- **Backend / API:** Node.js (v22+), Express.js (v5), Morgan, CORS
- **Database:** SQLite (ขับเคลื่อนด้วย `node:sqlite` ในตัว ไม่ต้องติดตั้ง driver ภายนอก)

---

## 2. สถาปัตยกรรม 3 ชั้น (Three-Tier Architecture)

ระบบออกแบบตามหลักการแยกหน้าที่ (Separation of Concerns) เป็นสถาปัตยกรรม 3 ชั้น:

```text
┌──────────────┐     HTTP / REST     ┌──────────────┐      SQL Query      ┌──────────────┐
│   Frontend   │ ──────────────────► │  API Server  │ ──────────────────► │   Database   │
│   (React)    │ ◄────────────────── │  (Express)   │ ◄────────────────── │   (SQLite)   │
└──────────────┘      JSON Data      └──────────────┘       Rows Data     └──────────────┘
```

| ชั้น (Tier)    | หน้าที่และความรับผิดชอบ                                                                                     | โฟลเดอร์     |
| ------------ | ------------------------------------------------------------------------------------------------------ | ----------- |
| **Frontend** | นำเสนอส่วนติดต่อผู้ใช้ (UI), ตรวจสอบความถูกต้องเบื้องต้น (Client Validation), เรียกใช้ API ผ่าน Service Layer         | `frontend/` |
| **API**      | ควบคุม Business Logic, กำหนด Routing, จัดการ Authentication & Validation, แปลง Error, คุยกับ DB ผ่าน Service | `api/src/`  |
| **Database** | จัดเก็บข้อมูลแบบสัมพันธ์ (Relational Data), บังคับ Foreign Keys, Transaction, Indexes                           | `api/data/` |

---

## 3. วิธีการรันระบบ (How to Run)

### 3.1 การรันในโหมด Development (2 Terminals)
```bash

cd ชื่อโฟลเดอร์ที่เก็บงานของตัวเอง/labs/week-11/source

# Terminal 1 — รัน API Server (พอร์ต 3001)
cd api
npm run dev

# Terminal 2 — รัน Frontend Vite Dev Server (พอร์ต 5173)
cd frontend
npm install
npm run dev
```
- Frontend เข้าใช้งานได้ที่: `http://localhost:5173`
- API Health Check เข้าดูได้ที่: `http://localhost:3001/api/health`

---

### 3.2 การรันในโหมด Production (Single Port)

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```
- เปิดเบราว์เซอร์เข้าใช้งานได้ที่: `http://localhost:3001`

---

### 3.1 การเตรียมระบบสำหรับผู้ติดตั้งครั้งแรก 
หากเพิ่ง Clone โปรเจกต์มาใหม่ หรือยังไม่เคยติดตั้ง Dependencies มาก่อน ให้ทำตามขั้นตอนนี้:

cd ชื่อโฟลเดอร์งานของตัวเอง/labs/week-11/source

1. **ติดตั้ง Dependencies ทั้ง 2 ส่วน:**
   ```bash
   # จากโฟลเดอร์ labs/week-11/source
   npm install --prefix api
   npm install --prefix frontend

2. **ตั้งค่าไฟล์ Environment Variables สำหรับ Dev:**

bash
cp api/.env.example api/.env
cp frontend/.env.example frontend/.env.local

3. **ตรวจสอบสคริปต์ใน `package.json` (ระดับ Root ของ source):**
   เปิดไฟล์ `package.json` ตรวจสอบในส่วน `"scripts"`ว่ามีข้อมูลข้างล่างไหม **หากยังไม่มี ให้เพิ่มคำสั่ง `"build"` และ `"start"` เข้าไปดังนี้:**
   ```json
   {
     "scripts": {
       "build": "npm install --include=dev --prefix frontend && npm run build --prefix frontend && npm install --prefix api",
       "start": "npm start --prefix api",
       "check": "node --disable-warning=ExperimentalWarning check-week11.mjs"
     }
   }

---

## 4. ตาราง Environment Variables

ระบบจัดการค่าคอนฟิกทั้งหมดผ่านโมดูลรวมศูนย์ `api/src/config.js` โดยรองรับตัวแปรดังนี้:

| ตัวแปร (Variable)    | คำอธิบาย                                                  | ค่าเริ่มต้น (Default)       | ใช้ตอน          |
| ------------------- | ------------------------------------------------------- | ----------------------- | -------------- |
| `NODE_ENV`          | โหมดการทำงาน (`development` หรือ `production`)            | `development`           | dev & prod     |
| `PORT`              | พอร์ตที่ API Server จะเปิดรับการเชื่อมต่อ                       | `3001`                  | dev & prod     |
| `CORS_ORIGIN`       | โดเมนที่อนุญาตให้เรียกใช้งาน API (CORS Whitelist)             | `http://localhost:5173` | dev & prod     |
| `DB_FILE`           | ที่ตั้งของไฟล์ฐานข้อมูล SQLite                                 | `api/data/campus.db`    | dev & prod     |
| `STATIC_DIR`        | โฟลเดอร์ที่เก็บไฟล์ Build ของ Frontend สำหรับเสิร์ฟ Static       | `frontend/dist`         | production     |
| `VITE_API_BASE_URL` | Base URL ที่ Frontend ใช้ยิงหา API (เว้นว่างไว้ตอน Production) | `http://localhost:3001` | build frontend |

---

## 5. การตัดสินใจออกแบบ (Design Decisions)

1. **ทำไมต้องแยกสถาปัตยกรรม 3 ชั้น (Three-Tier Architecture):**
   - **Loose Coupling:** ทำให้แต่ละชั้นเป็นอิสระต่อกัน Frontend ไม่จำเป็นต้องรู้ว่าหลังบ้านจัดเก็บข้อมูลด้วย SQL หรือรูปแบบใด รู้เพียงรูปแบบ API Contract ที่ตกลงกันไว้
   - **Maintainability & Scalability:** สามารถปรับแก้โค้ดเฉพาะส่วนได้โดยไม่กระทบส่วนอื่น เช่น การเปลี่ยนแหล่งเก็บข้อมูลจากไฟล์ JSON มาเป็น SQLite ทำได้โดยแก้เฉพาะ Service Layer โดยที่ Route และ Controller ไม่ต้องแก้เลย

2. **ทำไมจึงเลือก SQLite แทน MongoDB หรือ DBMS ขนาดใหญ่:**
   - **Zero Configuration:** เป็น Embedded Database ที่จัดเก็บข้อมูลลงไฟล์เดียวในเครื่อง (`campus.db`) ทำให้ Deploy ง่าย ไม่ต้องตั้งค่า Database Server แยก
   - **Relational Integrity:** ข้อมูลคำร้องของมหาวิทยาลัยมีโครงสร้างชัดเจน (Schema ชัด) และมีความสัมพันธ์ระหว่างตาราง (เช่น คำร้อง `requests` เชื่อมโยงกับผู้ใช้ `users`) ทำให้คุณสมบัติ Foreign Key และ Transaction แบบ ACID ของ SQLite ตอบโจทย์ความถูกต้องของข้อมูลได้ดีกว่า
   - **In-Process Performance:** ทำงานในโหมด Synchronous ในกระบวนการเดียวกันกับ Node.js ส่งผลให้การเข้าถึงข้อมูลรวดเร็วมาก เหมาะสำหรับระบบขนาดเล็กถึงขนาดกลาง
