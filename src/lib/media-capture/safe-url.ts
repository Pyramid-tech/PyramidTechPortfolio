import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export type UrlCheck = { ok: true; url: URL } | { ok: false; reason: string };

function ipv4IsPrivate(address: string): boolean {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255))
    return true;

  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 192 && b === 0) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function ipv6IsPrivate(address: string): boolean {
  const value = address.toLowerCase().split('%')[0];
  if (value === '::' || value === '::1') return true;
  if (value.startsWith('fe80') || value.startsWith('fc') || value.startsWith('fd')) return true;
  if (value.startsWith('ff')) return true;
  if (value.startsWith('::ffff:')) {
    const mapped = value.slice('::ffff:'.length);
    return isIP(mapped) === 4 ? ipv4IsPrivate(mapped) : true;
  }
  return false;
}

export function addressIsPrivate(address: string): boolean {
  const version = isIP(address);
  if (version === 4) return ipv4IsPrivate(address);
  if (version === 6) return ipv6IsPrivate(address);
  return true;
}

export async function assertPublicHttpsUrl(raw: string): Promise<UrlCheck> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: 'Malformed URL' };
  }

  if (url.protocol !== 'https:') return { ok: false, reason: 'Only https:// sources are allowed' };
  if (url.username || url.password)
    return { ok: false, reason: 'Credentials in URL are not allowed' };

  const hostname = url.hostname.replace(/^\[|\]$/g, '');

  if (isIP(hostname)) {
    if (addressIsPrivate(hostname)) return { ok: false, reason: 'Target address is not public' };
    return { ok: true, url };
  }

  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.internal')
  ) {
    return { ok: false, reason: 'Target host is not public' };
  }

  try {
    const records = await lookup(hostname, { all: true });
    if (records.length === 0) return { ok: false, reason: 'Host did not resolve' };
    if (records.some((record) => addressIsPrivate(record.address))) {
      return { ok: false, reason: 'Host resolves to a non-public address' };
    }
  } catch {
    return { ok: false, reason: 'Host did not resolve' };
  }

  return { ok: true, url };
}
