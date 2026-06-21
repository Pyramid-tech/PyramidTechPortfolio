/**
 * Shared shapes for the Book (project request) domain — used by server code
 * (data fns, Server Actions) and by the client form/admin UI.
 */

export interface BookRequestDTO {
  service: string;
  budget: string;
  pages: string;
  quickness: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  websiteUrl?: string;
  message?: string;
}

/**
 * Admin-facing shape of a submitted request as returned over the API.
 *
 * Deliberately decoupled from the DB row: it omits internal columns such as
 * `contentHash`, and types `createdAt` as a string because the timestamp is
 * JSON-serialized across the wire.
 */
export interface PyramidRequestDTO {
  id: string;
  service: string;
  budget: string;
  pages: string;
  quickness: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  websiteUrl: string | null;
  message: string | null;
  createdAt: string | null;
}
