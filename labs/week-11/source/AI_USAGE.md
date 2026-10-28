# บันทึกการใช้งาน AI ช่วยเหลือในการทำโปรเจกต์ (AI_USAGE.md)

**เครื่องมือ AI ที่ใช้งาน:** Claude
**สัปดาห์ / งานที่ทำ:** Week 11: Full-stack Integration & Deploy
**ผู้จัดทำ:** อังคาร สกุลบุญดี

สัปดาห์นี้ผมใช้ AI ช่วยหาสาเหตุบั๊ก 3 ครั้งระหว่างทำ CP39, CP43 และ Challenge Turso

---

## ครั้งที่ 1: bundle production ฝัง `localhost:3001` (CP39)

**ถามอะไร**

รัน `check-week11.mjs` แล้วข้อ "bundle production ไม่ฝัง localhost:3001" ไม่ผ่าน ทั้งที่ตั้ง `VITE_API_BASE_URL=` ว่างไว้ใน `frontend/.env.production` แล้ว

**AI ตอบว่าอย่างไร (สรุปสั้น)**

- `apiClient.js` ใช้ `import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'` ถ้า Vite อ่านค่าไม่เจอ ค่า fallback `localhost:3001` จะถูกฝังลงใน bundle
- ตอน production API เสิร์ฟ frontend จากพอร์ตเดียวกัน fallback ควรเป็น `''` เพื่อเรียก `/api/...` แบบ path สัมพัทธ์

**ใช้ส่วนไหน / แก้เองตรงไหน**

เปลี่ยน fallback ใน `frontend/src/services/apiClient.js` เป็น `''` แล้ว `npm run build` ใหม่ จากนั้นรัน checker ซ้ำจนข้อ CP39 ผ่าน

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2: root `package.json` ไม่มี script `build` กับ `start` (CP43)

**ถามอะไร**

checker แจ้งว่า root `package.json` ต้องมี script `build` (ใช้ `--include=dev`) และ `start` ผมไม่รู้ว่าต้องเขียนคำสั่งอะไรให้ build ทั้ง frontend และ api จาก root

**AI ตอบว่าอย่างไร (สรุปสั้น)**

- `build` ต้องติดตั้ง dev dependency ของ frontend ด้วย `--include=dev` เพราะ Vite อยู่ใน devDependencies และตอน `NODE_ENV=production` npm จะข้าม devDependencies
- ใช้ `--prefix` สั่ง npm ในโฟลเดอร์ย่อยจาก root ได้ ไม่ต้อง `cd`

**ใช้ส่วนไหน / แก้เองตรงไหน**

เพิ่ม 2 script นี้ใน root `package.json` เอง แล้วทดสอบด้วย `NODE_ENV=production PORT=10000 npm start`

```json
"build": "npm install --include=dev --prefix frontend && npm run build --prefix frontend && npm install --prefix api",
"start": "npm start --prefix api"
```

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 3: เปลี่ยนฐานข้อมูลไปใช้ Turso (Challenge ⭐⭐)

**ถามอะไร**

จะให้ `requestService.js` ต่อ Turso ได้โดยไม่ทำให้ checker กับ `npm test` ในเครื่องพัง ต้องเขียนยังไง

**AI ตอบว่าอย่างไร (สรุปสั้น)**

- ใช้แพ็กเกจ `libsql` ซึ่งเป็น sync แบบเดียวกับ `node:sqlite` ห้ามใช้ `@libsql/client` เพราะเป็น async ทั้งหมด controller จะต้องแก้ตาม
- ใช้ `await import('libsql')` ในฟังก์ชัน แทน `import` บนหัวไฟล์ เครื่องที่ไม่มี `TURSO_DATABASE_URL` จะยังใช้ `node:sqlite` ได้ตามปกติ
- ให้ `getDbStatus()` คืนค่าตัวแปร `driver` แทน `'sqlite'` แบบตายตัว `/api/health` จะได้บอกว่าใช้ฐานข้อมูลไหนอยู่

**ใช้ส่วนไหน / แก้เองตรงไหน**

เขียนฟังก์ชัน `openDatabase()` ใน `api/src/services/requestService.js` ให้เลือก Turso หรือ SQLite ตาม env เปลี่ยน `loadSeed()` ให้เรียก `await openDatabase()` และติดตั้ง `libsql` ใน `dependencies` ของ api จากนั้นรัน checker ซ้ำ ยังผ่านครบ

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุป

- **ส่วนที่ทำเอง:** config, health check, error handler, การเสิร์ฟ static ตอน production, README และ `DATABASE_CHOICES.md`
- **ส่วนที่ AI ช่วย:** หาสาเหตุ bundle ฝัง `localhost:3001`, เขียน script `build`/`start` ที่ root และวิธีต่อ Turso ด้วย `libsql`
- **ส่วนที่ยังไม่มั่นใจ:** ไม่มี
