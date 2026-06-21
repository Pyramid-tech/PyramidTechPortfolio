/**
 * Wire contract for the Auth domain — the current-user shape shared between the
 * server (auth/session helpers) and any UI that renders it.
 */

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
}
