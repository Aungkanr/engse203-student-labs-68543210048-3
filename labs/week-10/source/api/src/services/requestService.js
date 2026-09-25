import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { AppError } from '../middleware/errorHandler.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');
const SCHEMA_FILE = path.join(API_ROOT, 'data', 'schema.sql');

let db;

export async function loadSeed() {
  db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');

  // ถ้ายังไม่มีตาราง (ไฟล์ฐานข้อมูลใหม่) ให้สร้างจาก schema.sql
  const ready = db.prepare(
    "SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='requests'"
  ).get().c;
  if (!ready) db.exec(readFileSync(SCHEMA_FILE, 'utf8'));
}

function toAppError(err) {
  const m = err.message ?? '';
  if (m.includes('FOREIGN KEY')) return new AppError('อ้างถึงข้อมูลที่ไม่มีอยู่จริง', 400);
  if (m.includes('CHECK'))       return new AppError('ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด', 400);
  if (m.includes('UNIQUE'))      return new AppError('ข้อมูลนี้มีอยู่แล้วในระบบ', 409);
  return err;   // error อื่นปล่อยผ่าน → errorHandler ตอบ 500
}

const SELECT_SHAPE = `
  SELECT r.id,
         u.name          AS requesterName,
         r.request_type  AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id`;

export function findAll({ status } = {}) {
  return status
    ? db.prepare(`${SELECT_SHAPE} WHERE r.status = ? ORDER BY r.id`).all(status)
    : db.prepare(`${SELECT_SHAPE} ORDER BY r.id`).all();
}

export function findById(id) {
  return db.prepare(`${SELECT_SHAPE} WHERE r.id = ?`).get(id) ?? null;
}

function nextId() {
  const row = db.prepare(
    "SELECT id FROM requests WHERE id LIKE 'REQ-%' ORDER BY id DESC LIMIT 1"
  ).get();
  const n = row ? Number(String(row.id).replace('REQ-', '')) + 1 : 1;
  return `REQ-${String(n).padStart(3, '0')}`;
}

/** แปลงชื่อผู้แจ้งเป็น id — ถ้ายังไม่มีในระบบก็สร้างให้ */
function resolveUserId(name) {
  const found = db.prepare('SELECT id FROM users WHERE name = ?').get(name);
  if (found) return found.id;                  // มีแล้ว ใช้ id เดิม

  const slug = Date.now().toString(36);
  return db.prepare('INSERT INTO users (name, department, email) VALUES (?, ?, ?)')
           .run(name, 'ไม่ระบุ', `user-${slug}@rmutl.ac.th`).lastInsertRowid;
}

export function create(input) {
  const id = nextId();
  db.exec('BEGIN');
  try {
    const requesterId = resolveUserId(input.requesterName.trim());
    db.prepare(
      `INSERT INTO requests (id, requester_id, request_type, location, details, priority)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      requesterId,
      input.requestType,
      input.location.trim(),
      input.details.trim(),
      input.priority ?? 'normal'
    );
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw toAppError(err);
  }
  return findById(id);
}

export function updateStatus(id, status) {
  try {
    const result = db.prepare('UPDATE requests SET status = ? WHERE id = ?')
                     .run(status, id);
    return result.changes ? findById(id) : null;
  } catch (err) {
    throw toAppError(err);
  }
}

export function remove(id) {
  const target = findById(id);
  if (!target) return null; // CP31 actually in guide says throw AppError? Wait, guide CP31 says nothing about DELETE error.
  // Wait, let's look at CP31 in guide again. "ทำไมลบของที่ไม่มีแล้วได้ 204" was what I remembered. BUT in the text the user pasted, CP31 is ONLY SQL injection. I will stick to what the user pasted.
  try {
    db.prepare('DELETE FROM requests WHERE id = ?').run(id);
    return target;
  } catch (err) {
    throw toAppError(err);
  }
}

export function findAllUsers() {
  return db.prepare('SELECT * FROM users').all();
}

export function findRequestsByUserId(userId) {
  return db.prepare(`${SELECT_SHAPE} WHERE u.id = ? ORDER BY r.id`).all(userId);
}
