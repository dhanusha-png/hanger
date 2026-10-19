import crypto from 'crypto';

/**
 * Strips MongoDB operator keys ($gt, $where, etc.) from req.body, req.query, req.params
 * to prevent NoSQL injection attacks.
 */
export function sanitizeNoSql(target) {
  if (!target || typeof target !== 'object') return target;

  if (Array.isArray(target)) {
    return target.map(sanitizeNoSql);
  }

  const clean = {};
  for (const [key, val] of Object.entries(target)) {
    // Drop keys starting with '$' or containing '.'
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    if (val && typeof val === 'object') {
      clean[key] = sanitizeNoSql(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Express middleware to sanitize body, query, and params against NoSQL injection
 */
export function noSqlSanitizer(req, _res, next) {
  if (req.body) req.body = sanitizeNoSql(req.body);
  if (req.query) req.query = sanitizeNoSql(req.query);
  if (req.params) req.params = sanitizeNoSql(req.params);
  next();
}

/**
 * Generates a cryptographically secure random hex token (e.g. for password resets)
 */
export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * SHA-256 hash helper for indexing/storing sensitive one-time tokens
 */
export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}
