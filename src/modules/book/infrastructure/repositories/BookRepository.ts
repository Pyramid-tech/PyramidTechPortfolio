import { eq, desc } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidRequests, type PyramidRequestRow } from '../models/PyramidRequest';
import type { IBookRepository } from '../interfaces/IBookRepository';
import type { BookRequestDTO } from '../../application/dtos/BookRequestDTO';

export class BookRepository implements IBookRepository {
  async isDuplicate(contentHash: string): Promise<boolean> {
    const rows = await db
      .select({ id: pyramidRequests.id })
      .from(pyramidRequests)
      .where(eq(pyramidRequests.contentHash, contentHash))
      .limit(1);
    return rows.length > 0;
  }

  async create(dto: BookRequestDTO, contentHash: string): Promise<PyramidRequestRow> {
    const rows = await db
      .insert(pyramidRequests)
      .values({
        service: dto.service,
        budget: dto.budget,
        pages: dto.pages,
        quickness: dto.quickness,
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        company: dto.company,
        websiteUrl: dto.websiteUrl ?? null,
        message: dto.message ?? null,
        contentHash,
      })
      .returning();
    return rows[0];
  }

  async getAll(): Promise<PyramidRequestRow[]> {
    return db.select().from(pyramidRequests).orderBy(desc(pyramidRequests.createdAt));
  }
}
