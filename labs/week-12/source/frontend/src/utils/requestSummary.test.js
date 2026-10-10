import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('คืนค่าศูนย์ทั้งหมดถ้าข้อมูลว่าง', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

  const sample = [
    { id: 'REQ-001', status: 'pending' },
    { id: 'REQ-002', status: 'in-progress' },
    { id: 'REQ-003', status: 'completed' },
    { id: 'REQ-004', status: 'pending' },
  ];
  test('นับครบทุกสถานะ', () => {
    expect(summarizeRequests(sample)).toEqual({ total: 4, pending: 2, inProgress: 1, completed: 1 });
  });
});
