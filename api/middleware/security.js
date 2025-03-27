"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationLimiter = exports.apiLimiter = exports.securityHeaders = exports.botDetection = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const botDetection_1 = require("../utils/botDetection");
// Rate limiting configuration
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
exports.apiLimiter = apiLimiter;
// Stricter rate limit for verification endpoint
const verificationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 50 verifications per hour
    message: 'Too many verification attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
exports.verificationLimiter = verificationLimiter;
// Bot detection middleware
const botDetection = async (req, res, next) => {
    try {
        const isBot = await (0, botDetection_1.detectBot)(req);
        if (isBot) {
            res.status(403).json({
                error: 'Access denied: Automated access detected',
                message: 'This endpoint is not available for automated access.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Bot detection error:', error);
        next();
    }
};
exports.botDetection = botDetection;
// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.verify.me;");
    next();
};
exports.securityHeaders = securityHeaders;
