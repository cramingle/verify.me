import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { detectBot } from '../utils/botDetection';

// Founder-specific rate limiting
const founderLimiter = rateLimit({
  windowMs: Number(process.env.FOUNDER_RATE_WINDOW) || 900000, // 15 minutes
  max: Number(process.env.FOUNDER_RATE_LIMIT) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// IP whitelist middleware
export const founderIpWhitelist = (req: Request, res: Response, next: NextFunction): void => {
  const allowedIps = (process.env.FOUNDER_ALLOWED_IPS || '').split(',');
  const clientIp = (req.ip || req.connection.remoteAddress || '').toString();
  
  if (!allowedIps.includes(clientIp)) {
    res.status(403).json({
      error: 'Access denied',
      message: 'IP not whitelisted for founder access.'
    });
    return;
  }
  
  next();
};

// Enhanced bot detection for founder access
export const founderBotDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isBot = await detectBot(req);
    if (isBot) {
      res.status(403).json({
        error: 'Access denied: Automated access detected',
        message: 'Founder access is not available for automated requests.'
      });
      return;
    }
    next();
  } catch (error) {
    console.error('Founder bot detection error:', error);
    next();
  }
};

// Founder-specific security headers
export const founderSecurityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Stricter CSP for founder access
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.verify.me; " +
    "frame-ancestors 'none';"
  );
  
  // Additional security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

export { founderLimiter }; 