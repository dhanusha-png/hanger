import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name cannot exceed 80 characters'),
  email: z.string({ required_error: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  phone: z.string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^(?:\+91|91|0)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number (+91 optional)'),
  password: z.string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
    .regex(/[0-9]/, 'Password must contain at least one number (0-9)'),
  confirmPassword: z.string().optional(),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  pincode: z.string().trim().regex(/^(\d{6})?$/, 'Pincode must be 6 digits if provided').optional().or(z.literal('')),
  acceptedTerms: z.boolean({ required_error: 'You must accept the Terms & Privacy Policy' })
    .refine(val => val === true, {
      message: 'You must accept the Terms & Privacy Policy to create an account'
    })
}).refine(data => {
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty'),
  rememberMe: z.boolean().optional()
});

export function formatZodErrors(err) {
  const errors = {};
  if (err && Array.isArray(err.errors)) {
    err.errors.forEach(e => {
      const field = e.path[0] || 'general';
      if (!errors[field]) {
        errors[field] = e.message;
      }
    });
  }
  return errors;
}
