"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSensitiveData = exports.decrypt = exports.encrypt = exports.encryptSensitiveData = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Get encryption key from environment or use a default one for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'development-encryption-key-32chars';
const IV_LENGTH = 16; // For AES, this is always 16
/**
 * Encrypt sensitive data in the request body
 */
const encryptSensitiveData = (req, res, next) => {
    // For incoming requests, we don't encrypt anything
    // This middleware is primarily for demonstration purposes
    // Set up res.locals for the response encryption
    res.locals = res.locals || {};
    next();
};
exports.encryptSensitiveData = encryptSensitiveData;
/**
 * Encrypt a string
 */
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Return iv + encrypted data
    return iv.toString('hex') + ':' + encrypted;
};
exports.encrypt = encrypt;
/**
 * Decrypt a string
 */
const decrypt = (text) => {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift() || '', 'hex');
        const encryptedText = textParts.join(':');
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        console.error('Decryption error:', error);
        return text; // Return original if decryption fails
    }
};
exports.decrypt = decrypt;
/**
 * Decrypt sensitive data in the response
 */
const decryptSensitiveData = (req, res, next) => {
    if (res.locals.data) {
        // In a real app, you would selectively encrypt/decrypt specific fields
        // Here we're just demonstrating the concept
        // If the data contains an 'encryptedData' field, decrypt it
        if (res.locals.data.encryptedData) {
            try {
                res.locals.data.decryptedData = JSON.parse(res.locals.data.encryptedData);
            }
            catch (error) {
                console.error('JSON parse error:', error);
            }
        }
    }
    next();
};
exports.decryptSensitiveData = decryptSensitiveData;
