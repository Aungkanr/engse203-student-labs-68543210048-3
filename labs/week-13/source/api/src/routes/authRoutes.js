import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

const router = Router();

// In-memory rate limiting map for challenge
const attempts = new Map();

export function resetLoginLimiter() {
  attempts.clear();
}

router.post('/login', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean up expired records
  for (const [key, record] of attempts.entries()) {
    if (now > record.expires) attempts.delete(key);
  }

  const record = attempts.get(ip) || { count: 0, expires: now + 15 * 60 * 1000 };
  
  if (record.count >= 5) {
    return res.status(429).json({ error: 'เข้าสู่ระบบผิดพลาดเกินกำหนด กรุณาลองใหม่ภายหลัง' });
  }

  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  
  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    // Record failed attempt
    record.count += 1;
    attempts.set(ip, record);
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  
  // Successful login, clear attempts
  attempts.delete(ip);
  res.status(200).json(result);
});

export default router;
