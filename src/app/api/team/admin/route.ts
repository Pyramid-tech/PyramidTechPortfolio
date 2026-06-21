import { NextRequest } from 'next/server';
import { TeamController } from '@/modules/team/presentation/controllers/TeamController';

export const GET = (req: NextRequest) => TeamController.getAllAdmin(req);
