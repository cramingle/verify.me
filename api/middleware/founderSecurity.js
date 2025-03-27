"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.founderLimiter = exports.founderSecurityHeaders = exports.founderBotDetection = exports.founderIpWhitelist = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const botDetection_1 = require("../utils/botDetection");
// Founder-specific rate limiting
const founderLimiter = (0, express_rate_limit_1.default)({
    windowMs: Number(process.env.FOUNDER_RATE_WINDOW) || 900000, // 15 minutes
    max: Number(process.env.FOUNDER_RATE_LIMIT) || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
exports.founderLimiter = founderLimiter;
// IP whitelist middleware
const founderIpWhitelist = (req, res, next) => {
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
exports.founderIpWhitelist = founderIpWhitelist;
// Enhanced bot detection for founder access
const founderBotDetection = async (req, res, next) => {
    try {
        const isBot = await (0, botDetection_1.detectBot)(req);
        if (isBot) {
            res.status(403).json({
                error: 'Access denied: Automated access detected',
                message: 'Founder access is not available for automated requests.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Founder bot detection error:', error);
        next();
    }
};
exports.founderBotDetection = founderBotDetection;
// Founder-specific security headers
const founderSecurityHeaders = (req, res, next) => {
    // Stricter CSP for founder access
    res.setHeader('Content-Security-Policy', "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' https://api.verify.me; " +
        "frame-ancestors 'none';");
    // Additional security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
};
exports.founderSecurityHeaders = founderSecurityHeaders;
