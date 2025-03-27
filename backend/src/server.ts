import express, { Request, Response, RequestHandler, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { encryptSensitiveData, decryptSensitiveData } from './middleware/encryption';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7879;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Apply encryption middleware to all routes
app.use(encryptSensitiveData);

// Import routes
import authRoutes from './routes/auth';
import csvRoutes from './routes/csvRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/csv', csvRoutes);

// Sample data for demonstration
const channels = [
  { id: '1', company_id: '1', type: 'x', value: '@CompanyX', verified: true, verified_at: '2025-03-01' },
  { id: '2', company_id: '1', type: 'website', value: 'companyx.com', verified: true, verified_at: '2025-03-01' },
  { id: '3', company_id: '1', type: 'telegram', value: 't.me/CompanyX', verified: true, verified_at: '2025-03-01' },
  { id: '4', company_id: '2', type: 'x', value: '@CompanyY', verified: true, verified_at: '2025-03-01' },
  { id: '5', company_id: '2', type: 'website', value: 'companyy.com', verified: true, verified_at: '2025-03-01' },
];

// Verification route
app.post('/api/verify', (req: Request, res: Response, next: NextFunction) => {
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
    const companyName = channel.company_id === '1' ? 'Company X' : 'Company Y';
    
    res.locals.data = {
      verified: true,
      company: companyName
    };
    decryptSensitiveData(req, res, () => {
      res.json(res.locals.data);
    });
  } else {
    res.json({
      verified: false
    });
  }
});

app.post('/api/reports', (req: Request, res: Response) => {
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
app.post('/api/signup', (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({ error: true, message: 'All fields are required' });
    return;
  }
  
  // In a real app, we would validate email, hash password, and save to the database
  console.log('Signup:', { name, email });
  
  res.locals.data = { 
    user_id: 'new_user_123', 
    email,
    encryptedData: JSON.stringify({ name, email }) // This will be encrypted by middleware
  };
  
  decryptSensitiveData(req, res, () => {
    res.json(res.locals.data);
  });
});

app.post('/api/login', (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: true, message: 'Email and password are required' });
    return;
  }
  
  // Simple validation for demo
  if (email === 'admin@verify.me' && password === 'admin123') {
    res.locals.data = {
      token: 'admin_token_123',
      user: { id: 'admin_123', email, is_admin: true }
    };
  } else if (email.includes('@company') && password.length >= 8) {
    res.locals.data = {
      token: 'company_token_123',
      user: { id: 'company_123', email, is_admin: false }
    };
  } else {
    res.status(401).json({ error: true, message: 'Invalid credentials' });
    return;
  }
  
  decryptSensitiveData(req, res, () => {
    res.json(res.locals.data);
  });
});

// Protected endpoints (no real auth in this demo)
app.get('/api/channels', (req: Request, res: Response, next: NextFunction) => {
  // In a real app, we would filter by the authenticated company ID
  res.locals.data = { channels: channels.slice(0, 3) };
  decryptSensitiveData(req, res, () => {
    res.json(res.locals.data);
  });
});

app.post('/api/channels', (req: Request, res: Response, next: NextFunction) => {
  const { type, value } = req.body;
  
  if (!type || !value) {
    res.status(400).json({ error: true, message: 'Type and value are required' });
    return;
  }
  
  const newChannel = {
    id: Date.now().toString(),
    company_id: '1', // Hardcoded for demo
    type,
    value, // This will be encrypted by middleware
    verified: true,
    verified_at: new Date().toISOString()
  };
  
  // In a real app, we would save to the database
  channels.push(newChannel);
  
  res.locals.data = newChannel;
  decryptSensitiveData(req, res, () => {
    res.json(res.locals.data);
  });
});

app.get('/api/analytics', (req: Request, res: Response, next: NextFunction) => {
  // Sample analytics data
  res.locals.data = {
    total_verifications: 245,
    verified_count: 198,
    stats: {
      today: 52,
      week: 198,
      month: 245
    }
  };
  decryptSensitiveData(req, res, () => {
    res.json(res.locals.data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 