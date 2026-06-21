import { NextRequest } from 'next/server';
import { AuthController } from '@/modules/auth/presentation/controllers/AuthController';

export const POST = (req: NextRequest) => AuthController.login(req);
