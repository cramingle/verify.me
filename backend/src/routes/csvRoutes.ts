import express, { RequestHandler } from 'express';
import { uploadCsv, verifyCsvData } from '../controllers/csvController';

// Create a dummy auth middleware until we implement the real one
const authenticateToken: RequestHandler = (req, res, next) => {
  // Set a dummy user for development
  (req as any).user = { companyId: '1' };
  next();
};

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Route for uploading CSV data
router.post('/upload', uploadCsv as RequestHandler);

// Route for verifying uploaded CSV data
router.post('/verify', verifyCsvData as RequestHandler);

export default router; 