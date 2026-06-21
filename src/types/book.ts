/**
 * Wire contracts for the Book (project request) domain. Shared by the API
 * routes (server) and the UI + api-client (browser).
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
