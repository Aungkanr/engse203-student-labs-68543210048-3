# บันทึกการใช้งาน AI (AI_USAGE.md)

**เครื่องมือ AI:** Claude
**งาน:** Week 13: Software Quality & Security
**ผู้จัดทำ:** อังคาร สกุลบุญดี

โค้ด CP48 ถึง CP52 ผมเขียนเอง ใช้ AI ช่วยตอนเจอปัญหาก่อนส่งงานและตอน deploy

---

## ครั้งที่ 1: `.env.example` ไม่ขึ้น GitHub

**ถามอะไร:** checker ผ่าน 27/27 แต่บน GitHub ไม่มี `api/.env.example`

**AI ตอบ:** กฎ `**/.env.*` ใน `.gitignore` บล็อกไฟล์นี้ไปด้วย checker ผ่านเพราะอ่านไฟล์จากเครื่อง

**แก้เอง:** เพิ่มข้อยกเว้นใน `.gitignore` ให้ `api/.env.example` กับ `frontend/.env.production` ของ week-13 ส่วน `api/.env` ยัง ignore เหมือนเดิม

**เข้าใจไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2: หน้าเว็บบน Render จะเรียก `localhost:3001`

**ถามอะไร:** ก่อน deploy ต้องเตรียมอะไร

**AI ตอบ:** `apiClient.js` มี fallback เป็น `localhost:3001` ถ้า build โดยไม่มี `.env.production` ค่านี้จะติดไปใน bundle

**แก้เอง:** commit `frontend/.env.production` (ค่าว่าง) แล้ว merge ก่อนสร้าง service

**เข้าใจไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 3: Render start ไม่ได้ถ้าไม่มี `JWT_SECRET`

**ถามอะไร:** ตั้งค่า Render เหมือน week-12 ได้ไหม

**AI ตอบ:** `config.js` ของผม throw error ตอน production ถ้าไม่มี `JWT_SECRET` ให้ Render สุ่มค่าด้วยปุ่ม Generate

**แก้เอง:** ตั้ง `JWT_SECRET` บน Render แล้วลอง login `staff@rmutl.ac.th` ได้ token

**เข้าใจไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 4: branch `lab/week-13` ค้างของเก่า

**ถามอะไร:** branch นี้ไม่มีบน GitHub และไฟล์ไม่ตรงกับ `main`

**AI ตอบ:** branch ค้างที่ merge commit เก่าซึ่งมี submodule เสีย งานทั้งหมดอยู่ใน `main` แล้ว เลื่อนไปเริ่มจาก `main` ได้

**แก้เอง:** เลื่อน branch แล้ว commit โค้ด Challenge (security headers, 429, Bearer token)

**เข้าใจไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 5: การ์ด week-13 เปิดไป PR ของ week-12

**ถามอะไร:** กดปุ่ม Pull Request บนการ์ด week-13 แล้วไปเจอ PR #48

**AI ตอบ:** `lab-metadata.json` ยังเป็นค่าที่คัดลอกมาจาก week-12 และ tag `lab-13-submission-v1` ยังไม่มีบน GitHub

**แก้เอง:** แก้ commit เป็น `4cd157d` PR เป็น #58 รัน `npm run build:pages` แล้ว push tag

**เข้าใจไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุป

- **ทำเอง:** validation (CP48), hash รหัสผ่าน (CP49), login/JWT (CP50), 401/403 (CP51), fail-fast secret (CP52)
- **AI ช่วย:** ไฟล์ env, เตรียม deploy บน Render, จัดการ branch, แก้ metadata
- **ยังไม่มั่นใจ:** ไม่มี
