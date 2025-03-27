import { Request } from 'express';

export function detectBot(req: Request): Promise<boolean>; 