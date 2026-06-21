import type { PyramidRequestRow } from '../models/PyramidRequest';
import type { BookRequestDTO } from '../../application/dtos/BookRequestDTO';

export interface IBookRepository {
  isDuplicate(contentHash: string): Promise<boolean>;
  create(dto: BookRequestDTO, contentHash: string): Promise<PyramidRequestRow>;
  getAll(): Promise<PyramidRequestRow[]>;
}
