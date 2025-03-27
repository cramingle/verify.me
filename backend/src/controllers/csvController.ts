import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Define custom Request type that includes user
interface CustomRequest extends Request {
  user?: {
    companyId: string;
  };
}

// Create a mock PrismaClient with verification property
interface MockVerification {
  id: string;
  channel: string;
  type: string;
  description?: string;
  status: 'unverified' | 'verified' | 'failed';
  companyId: string;
  verifiedAt: Date | null;
  metadata: any;
}

// Mock prisma client for development
const prisma = {
  verification: {
    create: async (data: any): Promise<MockVerification> => {
      return {
        id: Math.random().toString(36).substring(7),
        channel: data.data.channel,
        type: data.data.type,
        description: data.data.description,
        status: data.data.status,
        companyId: data.data.companyId,
        verifiedAt: null,
        metadata: data.data.metadata
      };
    },
    findMany: async (query: any): Promise<MockVerification[]> => {
      // Mock implementation for findMany
      return [
        {
          id: '1',
          channel: 'Email',
          type: 'Business',
          description: 'Test email',
          status: 'unverified',
          companyId: query.where.companyId,
          verifiedAt: null,
          metadata: {}
        }
      ];
    },
    update: async (data: any): Promise<MockVerification> => {
      // Mock implementation for update
      return {
        id: data.where.id,
        channel: 'Email',
        type: 'Business',
        description: 'Test email',
        status: data.data.status,
        companyId: '1',
        verifiedAt: data.data.verifiedAt,
        metadata: data.data.metadata
      };
    }
  }
} as any;

// Validation schema for CSV data
const csvDataSchema = z.object({
  channel: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['unverified', 'verified', 'failed']).default('unverified')
});

const csvUploadSchema = z.array(csvDataSchema);

export const uploadCsv = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = csvUploadSchema.parse(req.body);
    
    // Create verification records for each entry
    const verifications = await Promise.all(
      data.map(async (item) => {
        return prisma.verification.create({
          data: {
            channel: item.channel,
            type: item.type,
            description: item.description,
            status: 'unverified',
            companyId: companyId,
            metadata: {
              source: 'csv_upload',
              uploadedAt: new Date().toISOString()
            }
          }
        });
      })
    );

    res.status(200).json({
      message: 'CSV data uploaded successfully',
      count: verifications.length,
      verifications
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid CSV data format',
        details: error.errors
      });
      return;
    }
    console.error('CSV upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyCsvData = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { verificationIds } = req.body;
    if (!Array.isArray(verificationIds)) {
      res.status(400).json({ error: 'Invalid verification IDs' });
      return;
    }

    // Get all verifications for the company
    const verifications = await prisma.verification.findMany({
      where: {
        id: { in: verificationIds },
        companyId: companyId,
        status: 'unverified'
      }
    });

    if (verifications.length === 0) {
      res.status(404).json({ error: 'No unverified records found' });
      return;
    }

    // Process each verification
    const results = await Promise.all(
      verifications.map(async (verification: MockVerification) => {
        try {
          // Here you would implement your verification logic
          // For now, we'll simulate a verification process
          const isVerified = await simulateVerification(verification);
          
          return prisma.verification.update({
            where: { id: verification.id },
            data: {
              status: isVerified ? 'verified' : 'failed',
              verifiedAt: isVerified ? new Date() : null,
              metadata: {
                ...verification.metadata,
                verificationAttemptedAt: new Date().toISOString(),
                verificationResult: isVerified ? 'success' : 'failure'
              }
            }
          });
        } catch (verificationError) {
          console.error(`Verification failed for ID ${verification.id}:`, verificationError);
          return prisma.verification.update({
            where: { id: verification.id },
            data: {
              status: 'failed',
              metadata: {
                ...verification.metadata,
                verificationAttemptedAt: new Date().toISOString(),
                verificationError: verificationError instanceof Error ? verificationError.message : 'Unknown error'
              }
            }
          });
        }
      })
    );

    res.status(200).json({
      message: 'Verification process completed',
      results
    });
  } catch (error) {
    console.error('CSV verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to simulate verification process
async function simulateVerification(verification: MockVerification): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demonstration, randomly verify 80% of entries
  return Math.random() < 0.8;
} 