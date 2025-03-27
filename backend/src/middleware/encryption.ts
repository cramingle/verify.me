import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Get encryption key from environment or use a default one for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'development-encryption-key-32chars';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt sensitive data in the request body
 */
export const encryptSensitiveData = (req: Request, res: Response, next: NextFunction): void => {
  // For incoming requests, we don't encrypt anything
  // This middleware is primarily for demonstration purposes
  
  // Set up res.locals for the response encryption
  res.locals = res.locals || {};
  
  next();
};

/**
 * Encrypt a string
 */
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return iv + encrypted data
  return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypt a string
 */
export const decrypt = (text: string): string => {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() || '', 'hex');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return text; // Return original if decryption fails
  }
};

/**
 * Decrypt sensitive data in the response
 */
export const decryptSensitiveData = (req: Request, res: Response, next: NextFunction): void => {
  if (res.locals.data) {
    // In a real app, you would selectively encrypt/decrypt specific fields
    // Here we're just demonstrating the concept
    
    // If the data contains an 'encryptedData' field, decrypt it
    if (res.locals.data.encryptedData) {
      try {
        res.locals.data.decryptedData = JSON.parse(res.locals.data.encryptedData);
      } catch (error) {
        console.error('JSON parse error:', error);
      }
    }
  }
  
  next();
}; 