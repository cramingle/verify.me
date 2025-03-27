import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { detectBot } from '../utils/botDetection';


// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for verification endpoint
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 verifications per hour
  message: 'Too many verification attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Bot detection middleware
export const botDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isBot = await detectBot(req);
    if (isBot) {
      res.status(403).json({
        error: 'Access denied: Automated access detected',
        message: 'This endpoint is not available for automated access.'
      });
      return;
    }
    next();
  } catch (error) {
    console.error('Bot detection error:', error);
    next();
  }
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.verify.me;"
  );
  
  next();
};

// Export rate limiters
export { apiLimiter, verificationLimiter }; 