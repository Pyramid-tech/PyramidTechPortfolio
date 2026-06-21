import { NextRequest } from 'next/server';
import { TeamController } from '@/modules/team/presentation/controllers/TeamController';

export const PATCH = (req: NextRequest, { params }: { params: { id: string } }) =>
  TeamController.reactivate(req, params.id);
