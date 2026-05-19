/**
 * Zod Request Validation Middleware
 * Usage: validate(schema) — validates req.body against a Zod schema
 */

const { z } = require('zod');

/**
 * @param {import('zod').ZodSchema} schema
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field:   e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    req.body = result.data; // replace with parsed/coerced data
    next();
  };
}

// ── Reusable schemas ──────────────────────────────────────────
const { z: zod } = require('zod');

const signupSchema = zod.object({
  name:     zod.string().min(2).max(100).trim(),
  email:    zod.string().email().toLowerCase().trim(),
  password: zod.string().min(8, 'Password must be at least 8 characters')
               .regex(/[A-Z]/, 'Must contain uppercase')
               .regex(/[0-9]/, 'Must contain a number'),
  phone:    zod.string().optional(),
  role:     zod.enum(['STUDENT', 'RECRUITER']).default('STUDENT'),
});

const loginSchema = zod.object({
  email:    zod.string().email().toLowerCase().trim(),
  password: zod.string().min(1),
});

const createOrderSchema = zod.object({
  plan: zod.enum(['plan-1', 'plan-2', 'plan-3', 'plan-4-premium']),
});

module.exports = { validate, signupSchema, loginSchema, createOrderSchema };
