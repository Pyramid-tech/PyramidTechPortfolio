import { NextRequest } from 'next/server';
import { TeamController } from '@/modules/team/presentation/controllers/TeamController';

export const PUT = (req: NextRequest, { params }: { params: { id: string } }) => TeamController.update(req, params.id);
