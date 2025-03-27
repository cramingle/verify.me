const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { encryptSensitiveData, decryptSensitiveData } = require('./middleware/encryption');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
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
app.post('/verify', (req, res) => {
  const { input_value } = req.body;
  
  if (!input_value) {
    res.status(400).json({ error: true, message: 'Input value is required' });
    return;
  }
  
  const channel = channels.find(c => 
    c.value.toLowerCase() === input_value.toLowerCase() ||
    c.value.toLowerCase().includes(input_value.toLowerCase()) ||
    input_value.toLowerCase().includes(c.value.toLowerCase())
  );
  
  if (channel) {
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

app.post('/reports', (req, res) => {
  const { reporter_name, reported_channel, reason } = req.body;
  
  if (!reporter_name || !reported_channel || !reason) {
    res.status(400).json({ error: true, message: 'All fields are required' });
    return;
  }
  
  res.json({ success: true });
});

app.post('/auth/register', (req, res) => {
  const { name, email, password, company } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: true, message: 'Missing required fields' });
  }
  
  return res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    userId: `user_${Date.now()}`
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Export the Express app as a serverless function
module.exports = app; 
module.exports = app; 