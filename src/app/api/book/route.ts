import { NextRequest } from 'next/server';

import { BookController } from '@/modules/book/presentation/controllers/BookController';

export const POST = (req: NextRequest) => BookController.submit(req);
export const GET = (req: NextRequest) => BookController.getAll(req);
