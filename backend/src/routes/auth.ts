import { Router, Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// JWT secret should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'verify-me-secret-key-2025';
const JWT_EXPIRES_IN = '30d';

// Email verification token expiration (24 hours)
const VERIFICATION_TOKEN_EXPIRES = 24 * 60 * 60 * 1000;

// Create a mock mail transport (replace with real service in production)
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io', // Replace with your actual SMTP host
  port: 2525,
  auth: {
    user: process.env.MAIL_USER || 'your-mailtrap-user',
    pass: process.env.MAIL_PASS || 'your-mailtrap-password'
  }
});

// Register a new company
router.post('/register', (async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: true, message: 'All fields are required' });
    }

    // Check if email already exists
    const existingCompany = await prisma.company.findUnique({
      where: { email }
    });

    if (existingCompany) {
      return res.status(400).json({ error: true, message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES);

    // Create company in database
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        subscriptionStatus: 'TRIAL',
      }
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@verify.me',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Verify.me!</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not register for Verify.me, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Return success without sensitive data
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Error registering company:', error);
    res.status(500).json({ error: true, message: 'Failed to register company' });
  }
}) as RequestHandler);

// Verify email
router.get('/verify-email', (async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: true, message: 'Verification token is required' });
    }

    // Find company with this token
    const company = await prisma.company.findFirst({
      where: { 
        verificationToken: token as string,
        verificationTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!company) {
      return res.status(400).json({ error: true, message: 'Invalid or expired verification token' });
    }

    // Update company status
    await prisma.company.update({
      where: { id: company.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    // Redirect to login page with success message
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?verified=true`);
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: true, message: 'Failed to verify email' });
  }
}) as RequestHandler);

// Login
router.post('/login', (async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    // Find company by email
    const company = await prisma.company.findUnique({
      where: { email }
    });

    if (!company) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!company.isVerified) {
      return res.status(401).json({ 
        error: true, 
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: company.id, email: company.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return success with token and user info
    res.status(200).json({
      success: true,
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        subscriptionStatus: company.subscriptionStatus
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: true, message: 'Failed to login' });
  }
}) as RequestHandler);

// Request password reset
router.post('/forgot-password', (async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: true, message: 'Email is required' });
    }

    // Find company by email
    const company = await prisma.company.findUnique({
      where: { email }
    });

    if (!company) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES);

    // Update company with reset token
    await prisma.company.update({
      where: { id: company.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    });

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@verify.me',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Return success without revealing whether the email exists
    res.status(200).json({
      success: true,
      message: 'If your email exists in our system, you will receive a password reset link'
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: true, message: 'Failed to process password reset request' });
  }
}) as RequestHandler);

// Reset password
router.post('/reset-password', (async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: true, message: 'Token and new password are required' });
    }

    // Find company with this token
    const company = await prisma.company.findFirst({
      where: { 
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!company) {
      return res.status(400).json({ error: true, message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update company password
    await prisma.company.update({
      where: { id: company.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    // Return success
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: true, message: 'Failed to reset password' });
  }
}) as RequestHandler);

export default router; 