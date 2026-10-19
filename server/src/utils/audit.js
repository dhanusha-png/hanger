import { AuditLog } from '../models/index.js';

/**
 * Record administrative or security events in the AuditLog collection
 */
export async function recordAudit(req, action, entity, entityId = '', details = {}) {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const user = req.user;

    await AuditLog.create({
      user: user?._id || null,
      userName: user?.name || 'Anonymous',
      userRole: user?.role || 'system',
      action,
      entity,
      entityId: String(entityId || ''),
      details,
      ip: String(ip),
      createdAt: new Date(),
    });
  } catch (err) {
    // Non-blocking: audit errors should not fail the main request
    console.error('AuditLog error:', err.message);
  }
}
