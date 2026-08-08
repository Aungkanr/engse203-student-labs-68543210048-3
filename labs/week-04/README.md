# ENGSE203 LAB 4 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: Aungkanr Sakunbundee
- รหัสนักศึกษา: 6854210048-3
- Section: Sce1

## URLs

- Repository: https://github.com/Aungkanr/engse203-student-labs-68543210048-3/tree/lab/week-04
- Pull Request: https://github.com/Aungkanr/engse203-student-labs-68543210048-3/pull/8
- GitHub Pages: https://aungkanr.github.io/engse203-student-labs-68543210048-3/

## Component Tree

```text
.
├── .github/
├── docs/
├── labs/
│   ├── week-01/
│   ├── week-02/
│   ├── week-03/
│   └── week-04/
│       ├── evidence/       # โฟลเดอร์เก็บภาพหลักฐานการทดสอบ (Test Evidence)
│       ├── publish/        # โฟลเดอร์ผลลัพธ์จากการ Build เพื่อเตรียมส่ง
│       └── source/         # โฟลเดอร์เก็บ Source Code หลักของ React LAB 4
│           ├── dist/       # โฟลเดอร์สำหรับ Build ผลลัพธ์
│           ├── evidence/
│           ├── img/
│           ├── node_modules/
│           ├── public/
│           ├── scripts/
│           ├── src/
│           │   ├── components/ # โฟลเดอร์คอมเพนเนนต์ย่อย (AppHeader, FilterBar, RequestCard, RequestForm, RequestList, SummaryPanel)
│           │   ├── data/       # โฟลเดอร์เก็บข้อมูลเริ่มต้น (initialRequests.js)
│           │   ├── App.jsx     # ไฟล์คอมเพนเนนต์หลัก
│           │   └── main.jsx    # ไฟล์จุดเริ่มต้นรันโปรแกรม
│           ├── .gitignore
│           ├── .nvmrc
│           ├── index.html      # ไฟล์หน้าเว็บหลัก
│           ├── package-lock.json
│           ├── package.json    # ไฟล์กำหนดแพ็กเกจและสคริปต์
│           ├── lab-metadata.json # ไฟล์เมตาดาต้าสถานะการส่งแลป
│           ├── README.md       # ไฟล์รายงานแลป
│           └── vite.config.js  # ไฟล์ตั้งค่า Vite


## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

Component App จะรับหน้าที่เป็นศูนย์กลางในการถือ State หลักของคำร้องทั้งหมดและตัวกรองสถานะ ส่วนฟอร์มจะจัดการข้อมูลที่ผู้ใช้กำลังพิมพ์อยู่ด้วยตัวเอง โดยข้อมูลจะไหลจากบนลงล่างผ่าน Props เพื่อส่งต่อไปยัง Component ลูกต่างๆ เช่น SummaryPanel, FilterBar, และ RequestList ในขณะเดียวกัน เมื่อผู้ใช้ทำกิจกรรมที่ฝั่งลูก (เช่น เพิ่มคำร้อง เปลี่ยนตัวกรอง หรือกดลบ) ระบบจะใช้ฟังก์ชัน Callback ส่งข้อมูลและคำสั่งย้อนกลับจากล่างขึ้นบน เพื่อให้ App อัปเดตข้อมูลและเรนเดอร์หน้าจอใหม่ทั้งหมดครับ

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
|---|---|---|---|
| TC-01 Initial | แสดงผลเริ่มต้นถูกต้อง Console ไม่มี Error | Pass | ![TC-01](evidence/desktop.png) |
| TC-02 Controlled input | ฟิลด์ข้อมูลอัปเดตตาม State พิมพ์ได้ปกติ | Pass | ![TC-02](img/TC2.png) |
| TC-03 Invalid | แสดงข้อความ Error ใต้ฟิลด์ และไม่เพิ่มข้อมูล | Pass | ![TC-03](evidence/validation.png) |
| TC-04 Valid add | ข้อมูลถูกเพิ่มไว้บนสุด ฟอร์มถูกรีเซ็ต และ Summary อัปเดต | Pass | ![TC-04](img/TC4.png) |
| TC-05 Filter | แสดงเฉพาะรายการที่ตรงกับสถานะที่เลือก | Pass | ![TC-05-1](img/TC5_1.png)<br>![TC-05-2](img/TC5_2.png)<br>![TC-05-3](img/TC5_3.png) |
| TC-06 All | แสดงรายการคำร้องกลับมาครบทุกสถานะ | Pass | ![TC-06](img/TC6.png) |
| TC-07 Empty | แสดงข้อความไม่พบคำร้องเมื่อไม่มีรายการในตัวกรอง | Pass | ![TC-07](evidence/empty-state.png) |
| TC-08 Delete | ลบรายการออกได้ถูกต้องและ Summary อัปเดตลดลง | Pass | ![TC-08-1](img/TC8_before.png)<br>![TC-08-2](img/TC8_after.png) |
| TC-09 Mobile | แสดงผลบนจอ 375px ได้สวยงาม ไม่มี Scroll แนวนอน | Pass | ![TC-09](evidence/mobile-375.png) |
| TC-10 Keyboard | โฟกัสแสดงชัดเจน เลื่อนและกดปุ่มได้ด้วยคีย์บอร์ด | Pass | ![TC-10](img/TC10.png) |
| TC-11 Build | รันสคริปต์ Build และ Preview ผ่านสมบูรณ์ | Pass | ![TC-11-b](img/TC11_b.png)<br>![TC-11-pv](img/TC11_pv.png)<br>![TC-11-pvsus](img/TC11_pvsus.png) |
| TC-12 Pages | หน้าเว็บโหลดสมบูรณ์ผ่านลิงก์บนโหมด Incognito | Pass | ![TC-12](evidence/pages-incognito.png) |

## Screenshots

- Desktop: ![Desktop](evidence/desktop.png)
- Mobile 375px: ![Mobile](evidence/mobile-375.png)
- Validation: ![Validation](evidence/validation.png)
- Empty state: ![Empty State](evidence/empty-state.png)

## Week 03 → Week 04 Reflection

ตอนทำ Week 03 แบบ DOM-driven เราต้องคอยใช้คำสั่งเข้าไปหยิบจับแก้หน้าเว็บตรงๆ พวก document.createElement หรือ innerHTML ซึ่งถ้าโปรเจกต์เริ่มโต โค้ดจะยาวแถมพังง่ายถ้าจัดการลำดับไม่ดี พอเปลี่ยนมาเป็น Week 04 แบบ State-driven React การทำงานเลยเปลี่ยนมาเป็น แค่เปลี่ยนค่าข้อมูลใน State React ก็จะจัดการคำนวณและวาดหน้า UI ใหม่ให้อัตโนมัติ ทำให้โค้ดเป็นระเบียบ แบ่งเป็น Component ชัดเจน และคุมระบบได้ง่ายแถมปลอดภัยกว่าเดิม

## AI / External Resource Disclosure

- **เครื่องมือหรือแหล่งที่ใช้:** Google Gemini (AI)
- **Prompt/คำถามสำคัญ:** ช่วยตรวจสอบโครงสร้างไฟล์ `lab-metadata.json`, แนะนำวิธีการแก้ปัญหา Error ของ Git commands , รวมถึงการจัดรูปแบบ Component Tree
- **ส่วนที่นำมาปรับ:** นำคำแนะนำการแก้ไขปัญหาการอัปเดตสถานะ Submitted, การแก้ไขลิงก์ Pull Request , และโครงสร้างการจัดวางหน้า README มาปรับใช้กับโปรเจกต์
- **วิธีที่ตรวจสอบความถูกต้อง:** รันคำสั่งตรวจสอบ `npm run check` เพื่อให้ผลลัพธ์ผ่านเกณฑ์ PASS และตรวจสอบสถานะการแสดงผลบนหน้าเว็บไซต์ Dashboard ของรายวิชา กด Ctrl + Shift + V เพื่อเช็คหน้า README `npm run dev ` เพื่อเช็คหน้าเว็บไซต์

