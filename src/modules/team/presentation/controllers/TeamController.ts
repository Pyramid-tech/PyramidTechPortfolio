import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import { TeamService } from '../../application/services/TeamService';
import { TeamRepository } from '../../infrastructure/repositories/TeamRepository';
import { createMemberSchema, updateMemberSchema } from '../schemas/teamSchema';
import { HttpError } from '@/shared/errors/HttpError';
import { logger } from '@/shared/logger';

const COOKIE_NAME = 'pyramid_token';

const teamService = new TeamService(new TeamRepository(), logger);

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

async function requireAuth(req: NextRequest): Promise<void> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) throw new HttpError(401, 'Unauthorized');
  try {
    await jwtVerify(token, getSecret());
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
}

export class TeamController {
  // ── Public ──────────────────────────────────────────────────────────
  static async getAll(): Promise<NextResponse> {
    try {
      logger.info('GET /api/team');
      const members = await teamService.getActiveMembers();
      return NextResponse.json(members);
    } catch (error) {
      if (error instanceof HttpError) {
        logger.warning('GET /api/team client error', { status: error.statusCode, message: error.message });
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      }
      logger.error('GET /api/team unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async getCount(): Promise<NextResponse> {
    try {
      logger.info('GET /api/team/count');
      const data = await teamService.getActiveCount();
      return NextResponse.json(data);
    } catch (error) {
      if (error instanceof HttpError) {
        logger.warning('GET /api/team/count client error', { status: error.statusCode, message: error.message });
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      }
      logger.error('GET /api/team/count unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  // ── Admin (JWT required) ─────────────────────────────────────────────
  static async getAllAdmin(req: NextRequest): Promise<NextResponse> {
    try {
      await requireAuth(req);
      const members = await teamService.getAllMembers();
      return NextResponse.json(members);
    } catch (error) {
      if (error instanceof HttpError)
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      logger.error('GET /api/team/admin unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async create(req: NextRequest): Promise<NextResponse> {
    try {
      await requireAuth(req);
      const body = await req.json();
      const parsed = createMemberSchema.safeParse(body);
      if (!parsed.success)
        return NextResponse.json({ message: 'Invalid request body', errors: parsed.error.issues }, { status: 400 });

      const member = await teamService.createMember(parsed.data);
      return NextResponse.json(member, { status: 201 });
    } catch (error) {
      if (error instanceof HttpError)
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      logger.error('POST /api/team unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async update(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      await requireAuth(req);
      const body = await req.json();
      const parsed = updateMemberSchema.safeParse(body);
      if (!parsed.success)
        return NextResponse.json({ message: 'Invalid request body', errors: parsed.error.issues }, { status: 400 });

      const member = await teamService.updateMember(id, parsed.data);
      return NextResponse.json(member);
    } catch (error) {
      if (error instanceof HttpError)
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      logger.error('PUT /api/team/[id] unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async deactivate(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      await requireAuth(req);
      await teamService.deactivateMember(id);
      return NextResponse.json({ message: 'Member deactivated' });
    } catch (error) {
      if (error instanceof HttpError)
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      logger.error('PATCH /api/team/[id]/deactivate unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async reactivate(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      await requireAuth(req);
      await teamService.reactivateMember(id);
      return NextResponse.json({ message: 'Member reactivated' });
    } catch (error) {
      if (error instanceof HttpError)
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      logger.error('PATCH /api/team/[id]/reactivate unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}
