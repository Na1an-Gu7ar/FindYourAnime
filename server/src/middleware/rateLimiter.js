import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  legacyHeaders: false,
  limit: 120,
  message: { message: 'Too many requests. Please try again shortly.' },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000
});

export const authLimiter = rateLimit({
  legacyHeaders: false,
  limit: 20,
  message: { message: 'Too many auth attempts. Please try again shortly.' },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000
});
