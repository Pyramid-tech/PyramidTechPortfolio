import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import { BookService } from '../../application/services/BookService';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';
import { TeamRepository } from '@/modules/team/infrastructure/repositories/TeamRepository';
import { ResendEmailProvider } from '../../infrastructure/providers/ResendEmailProvider';
import { bookRequestSchema } from '../schemas/bookSchema';
import { HttpError } from '@/shared/errors/HttpError';
import { logger } from '@/shared/logger';

const COOKIE_NAME = 'pyramid_token';

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

const bookService = new BookService(
  new BookRepository(),
  new TeamRepository(),
  new ResendEmailProvider(),
  logger,
);

export class BookController {
  static async submit(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const parsed = bookRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ message: 'Invalid request body', errors: parsed.error.issues }, { status: 400 });
      }

      await bookService.submit(parsed.data);
      return NextResponse.json({ message: 'Request submitted' });
    } catch (error) {
      if (error instanceof HttpError) {
        logger.warning('POST /api/book client error', { status: error.statusCode, message: error.message });
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      }
      logger.error('POST /api/book unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  static async getAll(req: NextRequest): Promise<NextResponse> {
    try {
      await requireAuth(req);
      const requests = await bookService.getAll();
      return NextResponse.json(requests);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      }
      logger.error('GET /api/book unexpected error', { error: String(error) });
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
}
