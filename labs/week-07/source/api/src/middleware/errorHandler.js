import { config } from '../config.js';

// --- ฟังก์ชันสำหรับจัดการกรณีที่หาเส้นทาง API ไม่เจอ (404) ---
export function notFound(req, res, next) {
  const error = new Error(`ไม่มีเส้นทางนี้: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// --- ฟังก์ชันจัดการ Error หลัก (CP14) ---
export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error('เกิดข้อผิดพลาดภายใน:', err.message);
  }

  res.status(status).json({
    error: status >= 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : err.message,
    ...(config.isProduction ? {} : { stack: err.stack?.split('\n').slice(0, 3) }),
  });
}

// --- ⭐ โค้ดสำหรับ Challenge (AppError & asyncHandler) ---
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}