import { describe, test, expect, vi } from 'vitest';
import { AppError, errorHandler, notFound } from '../../src/middleware/errorHandler.js';
import { logger } from '../../src/middleware/logger.js';

describe('Middlewares', () => {
  test('AppError sets status', () => {
    const err = new AppError('test', 400);
    expect(err.message).toBe('test');
    expect(err.status).toBe(400);
  });

  test('notFound sets 404', () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    notFound({ method: 'GET', originalUrl: '/x' }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('logger calls next', () => {
    const next = vi.fn();
    const res = { on: vi.fn((event, cb) => cb()), statusCode: 200 };
    logger({ method: 'GET', originalUrl: '/' }, res, next);
    expect(next).toHaveBeenCalled();
  });
});
