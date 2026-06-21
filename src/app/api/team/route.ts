import { NextRequest } from 'next/server';
import { TeamController } from '@/modules/team/presentation/controllers/TeamController';

export const GET = () => TeamController.getAll();
export const POST = (req: NextRequest) => TeamController.create(req);
