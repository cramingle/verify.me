const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { encryptSensitiveData, decryptSensitiveData } = require('./dist/middleware/encryption');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7879;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Apply encryption middleware to all routes
app.use(encryptSensitiveData);

// Sample data for demonstration
const channels = [
  { id: '1', company_id: '1', type: 'x', value: '@CompanyX', verified: true, verified_at: '2025-03-01' },
  { id: '2', company_id: '1', type: 'website', value: 'companyx.com', verified: true, verified_at: '2025-03-01' },
  { id: '3', company_id: '1', type: 'telegram', value: 't.me/CompanyX', verified: true, verified_at: '2025-03-01' },
  { id: '4', company_id: '2', type: 'x', value: '@CompanyY', verified: true, verified_at: '2025-03-01' },
  { id: '5', company_id: '2', type: 'website', value: 'companyy.com', verified: true, verified_at: '2025-03-01' },
  { id: '6', company_id: '3', type: 'x', value: '@kisra_fistya', verified: true, verified_at: '2025-03-01' }
];

// Routes
app.post('/api/verify', (req, res) => {
  const { input_value } = req.body;
  
  if (!input_value) {
    res.status(400).json({ error: true, message: 'Input value is required' });
    return;
  }
  
  // Find matching channel
  const channel = channels.find(c => 
    c.value.toLowerCase() === input_value.toLowerCase() ||
    c.value.toLowerCase().includes(input_value.toLowerCase()) ||
    input_value.toLowerCase().includes(c.value.toLowerCase())
  );
  
  // Log verification attempt
  console.log(`Verification attempt: ${input_value} - Result: ${channel ? 'Verified' : 'Not found'}`);
  
  if (channel) {
    // In a real app, we would query the company name from the database
    let companyName = 'Company X';
    if (channel.company_id === '2') {
      companyName = 'Company Y';
    } else if (channel.company_id === '3') {
      companyName = 'KisraFistya Inc.';
    }
    
    res.json({
      verified: true,
      company: companyName
    });
  } else {
    res.json({
      verified: false
    });
  }
});

app.post('/api/reports', (req, res) => {
  const { reporter_name, reported_channel, reason } = req.body;
  
  if (!reporter_name || !reported_channel || !reason) {
    res.status(400).json({ error: true, message: 'All fields are required' });
    return;
  }
  
  // In a real app, we would save this to the database
  console.log('Report received:', { reporter_name, reported_channel, reason });
  
  res.json({ success: true });
});

// Simple auth endpoints (for demo purposes only, not secure)
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({ error: true, message: 'All fields are required' });
    return;
  }
  
  // In a real app, we would validate email, hash password, and save to the database
  console.log('Signup:', { name, email });
  
  res.json({ 
    user_id: 'new_user_123', 
    email,
    name
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: true, message: 'Email and password are required' });
    return;
  }
  
  // Simple validation for demo
  if (email === 'admin@verify.me' && password === 'admin123') {
    res.json({
      token: 'admin_token_123',
      user: { id: 'admin_123', email, is_admin: true }
    });
  } else if (email.includes('@company') && password.length >= 8) {
    res.json({
      token: 'company_token_123',
      user: { id: 'company_123', email, is_admin: false }
    });
  } else {
    res.status(401).json({ error: true, message: 'Invalid credentials' });
  }
});

// Protected endpoints (no real auth in this demo)
app.get('/api/channels', (req, res) => {
  // In a real app, we would filter by the authenticated company ID
  res.json({ channels: channels.slice(0, 3) });
});

app.post('/api/channels', (req, res) => {
  const { type, value } = req.body;
  
  if (!type || !value) {
    res.status(400).json({ error: true, message: 'Type and value are required' });
    return;
  }
  
  const newChannel = {
    id: Date.now().toString(),
    company_id: '1', // Hardcoded for demo
    type,
    value,
    verified: true,
    verified_at: new Date().toISOString()
  };
  
  // In a real app, we would save to the database
  channels.push(newChannel);
  
  res.json(newChannel);
});

app.get('/api/analytics', (req, res) => {
  // Sample analytics data
  res.json({
    total_verifications: 245,
    verified_count: 198,
    stats: {
      today: 52,
      week: 198,
      month: 245
    }
  });
});

// Auth routes specifically for the API (mock implementation)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, company } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: true, message: 'Missing required fields' });
  }
  
  // Mock successful registration
  return res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    userId: `user_${Date.now()}`
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless
module.exports = app; 