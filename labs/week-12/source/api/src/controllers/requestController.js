import * as service from '../services/requestService.js';
import { validateRequestInput, isValidStatus } from '../validators/requestValidator.js';

export function listRequests(req, res) {
  const requests = service.findAll({ status: req.query.status });
  res.status(200).json(requests);
}

export function getRequest(req, res) {
  const target = service.findById(req.params.id);
  if (!target) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  res.status(200).json(target);
}

export function createRequest(req, res) {
  const errors = validateRequestInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลคำร้องไม่ถูกต้อง', details: errors });
  }
  res.status(201).json(service.create(req.body));
}

export function updateRequestStatus(req, res) {
  const { status } = req.body;
  if (!isValidStatus(status)) {
    return res.status(400).json({ error: 'สถานะต้องเป็น pending, in-progress หรือ completed' });
  }
  const updated = service.updateStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  console.log(`[status] ${updated.id} → ${updated.status}`);   // บันทึกการเปลี่ยนสถานะ
  res.status(200).json(updated);
}

export function deleteRequest(req, res) {
  const deleted = service.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: `ไม่พบคำร้องรหัส ${req.params.id}` });
  }
  res.status(204).send();
}
