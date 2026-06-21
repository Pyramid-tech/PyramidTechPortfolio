import { NextRequest } from 'next/server';
import { AuthController } from '@/modules/auth/presentation/controllers/AuthController';

export const GET = (req: NextRequest) => AuthController.me(req);
