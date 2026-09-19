import { RADIO_FIELDS } from '@/lib/constants';
import type { BookRequestDTO } from '@/types/book';

const FALLBACK_SITE_URL = 'https://www.pyramidtech.dev';

const COLOR = {
  page: '#141218',
  card: '#211F26',
  inset: '#2B2930',
  border: '#4A4458',
  hairline: '#303030',
  text: '#E6E0E9',
  textSecondary: '#B5B0B8',
  textMuted: '#848088',
  accent: '#CCC2DC',
  onAccent: '#141218',
};

const DISPLAY_FONT = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const BODY_FONT = "'Hanken Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function multiline(value: string): string {
  return escapeHtml(value.trim()).replace(/\r?\n/g, '<br>');
}

function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  return configured?.startsWith('https://') ? configured.replace(/\/$/, '') : FALLBACK_SITE_URL;
}

function optionLabel(formKey: string, value: string): string {
  const field = RADIO_FIELDS.find((candidate) => candidate.formKey === formKey);
  return field?.radioArray.find((option) => option.value === value)?.name ?? value;
}

function websiteHref(value: string): string | null {
  const trimmed = value.trim();
  if (/^https?:\/\/\S+$/i.test(trimmed)) return trimmed;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return null;
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Beirut',
  }).format(date);
}

function eyebrow(label: string): string {
  return `<div style="font-family:${DISPLAY_FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLOR.accent};margin:0 0 8px;">${label}</div>`;
}

function detailCell(label: string, value: string): string {
  return `
    <td class="stack" width="50%" valign="top" style="padding:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.inset}" style="background:${COLOR.inset};border:1px solid ${COLOR.border};border-radius:12px;">
        <tr>
          <td style="padding:14px 16px;">
            <div style="font-family:${DISPLAY_FONT};font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${COLOR.textMuted};margin:0 0 6px;">${label}</div>
            <div style="font-family:${BODY_FONT};font-size:15px;font-weight:600;line-height:1.4;color:${COLOR.text};">${escapeHtml(value)}</div>
          </td>
        </tr>
      </table>
    </td>`;
}

function contactRow(label: string, valueHtml: string): string {
  return `
    <tr>
      <td width="96" valign="top" style="padding:10px 0;border-top:1px solid ${COLOR.hairline};font-family:${DISPLAY_FONT};font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${COLOR.textMuted};">${label}</td>
      <td valign="top" style="padding:10px 0;border-top:1px solid ${COLOR.hairline};font-family:${BODY_FONT};font-size:15px;line-height:1.5;color:${COLOR.text};">${valueHtml}</td>
    </tr>`;
}

function link(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${COLOR.accent};text-decoration:none;">${escapeHtml(label)}</a>`;
}

function button(href: string, label: string, variant: 'primary' | 'secondary'): string {
  const primary = variant === 'primary';
  return `
    <td class="btn-cell" style="padding:6px;">
      <table role="presentation" class="btn-table" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" bgcolor="${primary ? COLOR.accent : COLOR.card}" style="border-radius:999px;border:1px solid ${primary ? COLOR.accent : COLOR.border};">
            <a class="btn-link" href="${escapeHtml(href)}" style="display:inline-block;padding:13px 24px;white-space:nowrap;font-family:${DISPLAY_FONT};font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;text-decoration:none;color:${primary ? COLOR.onAccent : COLOR.text};border-radius:999px;">${escapeHtml(label)}</a>
          </td>
        </tr>
      </table>
    </td>`;
}

export function renderProjectRequestEmail(
  dto: BookRequestDTO,
  submittedAt: Date = new Date(),
): RenderedEmail {
  const base = siteUrl();
  const name = singleLine(dto.name);
  const company = singleLine(dto.company);
  const service = optionLabel('_service', dto.service);
  const budget = optionLabel('_budget', dto.budget);
  const screens = optionLabel('_pages', dto.pages);
  const timeline = optionLabel('_quickness', dto.quickness);
  const submitted = formatSubmittedAt(submittedAt);
  const firstName = name.split(' ')[0] || name;
  const replyHref = `mailto:${dto.email.trim()}?subject=${encodeURIComponent('Your project request with Pyramid')}`;
  const dashboardHref = `${base}/dashboard/requests`;
  const website = dto.websiteUrl?.trim();
  const websiteLink = website ? websiteHref(website) : null;
  const message = dto.message?.trim();
  const phoneHref = `tel:${dto.phone.replace(/[^\d+]/g, '')}`;

  const subject = `New project request from ${name}${company ? ` (${company})` : ''}`;
  const preheader = `${service} · ${budget} · ${timeline}. ${message ? singleLine(message).slice(0, 90) : 'No message included.'}`;

  const contactRows = [
    contactRow('Name', escapeHtml(name)),
    contactRow('Email', link(`mailto:${dto.email.trim()}`, dto.email.trim())),
    contactRow('Phone', link(phoneHref, dto.phone.trim())),
    contactRow('Company', escapeHtml(company)),
    website
      ? contactRow('Website', websiteLink ? link(websiteLink, website) : escapeHtml(website))
      : '',
  ].join('');

  const messageBlock = message
    ? `
      <tr>
        <td class="px" style="padding:8px 32px 8px;">
          ${eyebrow('Their message')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-left:3px solid ${COLOR.accent};padding:4px 0 4px 16px;font-family:${BODY_FONT};font-size:15px;line-height:1.65;color:${COLOR.textSecondary};">${multiline(message)}</td>
            </tr>
          </table>
        </td>
      </tr>`
    : '';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background: ${COLOR.page}; }
  a { color: ${COLOR.accent}; }
  @media (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .stack { display: block !important; width: 100% !important; box-sizing: border-box; }
    .headline { font-size: 26px !important; }
    .px-grid { padding-left: 14px !important; padding-right: 14px !important; }
    .btn-cell { display: block !important; width: 100% !important; box-sizing: border-box; }
    .btn-table { width: 100% !important; }
    .btn-link { display: block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLOR.page};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.page}" style="background:${COLOR.page};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <tr>
          <td style="padding:0 8px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" width="40"><img src="${base}/images/logo/icon-nobg.png" width="36" height="36" alt="Pyramid" style="display:block;border:0;width:36px;height:36px;"></td>
                <td valign="middle" style="padding-left:10px;font-family:${DISPLAY_FONT};font-size:14px;font-weight:700;letter-spacing:4px;color:${COLOR.text};">PYRAMID</td>
                <td valign="middle" align="right" style="font-family:${BODY_FONT};font-size:12px;color:${COLOR.textMuted};">${escapeHtml(submitted)} · Beirut</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="${COLOR.card}" style="background:${COLOR.card};border:1px solid ${COLOR.border};border-radius:16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="px" style="padding:32px 32px 8px;">
                  ${eyebrow('New project request')}
                  <h1 class="headline" style="margin:0;font-family:${DISPLAY_FONT};font-size:32px;line-height:1.1;font-weight:700;text-transform:uppercase;letter-spacing:-0.5px;color:${COLOR.text};">${escapeHtml(name)}</h1>
                  <p style="margin:10px 0 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:${COLOR.textSecondary};">${escapeHtml(company)} wants to talk about <span style="color:${COLOR.text};font-weight:600;">${escapeHtml(service)}</span>.</p>
                </td>
              </tr>
              <tr>
                <td class="px-grid" style="padding:20px 26px 12px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>${detailCell('Service', service)}${detailCell('Budget', budget)}</tr>
                    <tr>${detailCell('Screens', screens)}${detailCell('Timeline', timeline)}</tr>
                  </table>
                </td>
              </tr>
              ${messageBlock}
              <tr>
                <td class="px" style="padding:20px 32px 8px;">
                  ${eyebrow('Contact')}
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${contactRows}</table>
                </td>
              </tr>
              <tr>
                <td class="px-grid" style="padding:20px 26px 32px;">
                  <table role="presentation" class="btn-table" cellpadding="0" cellspacing="0" border="0">
                    <tr>${button(replyHref, `Reply to ${firstName}`, 'primary')}${button(dashboardHref, 'Open dashboard', 'secondary')}</tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 16px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.6;color:${COLOR.textMuted};">
            Sent by the project form on <a href="${escapeHtml(base)}/book" style="color:${COLOR.textSecondary};text-decoration:underline;">${escapeHtml(base.replace(/^https?:\/\//, ''))}</a>.<br>
            You are receiving this because you are an active Pyramid team member.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    `NEW PROJECT REQUEST`,
    `${name} from ${company}`,
    `Submitted ${submitted} (Beirut)`,
    '',
    `Service:  ${service}`,
    `Budget:   ${budget}`,
    `Screens:  ${screens}`,
    `Timeline: ${timeline}`,
    '',
    ...(message ? ['Message:', message, ''] : []),
    `Email:    ${dto.email.trim()}`,
    `Phone:    ${dto.phone.trim()}`,
    `Company:  ${company}`,
    ...(website ? [`Website:  ${website}`] : []),
    '',
    `Open the dashboard: ${dashboardHref}`,
  ].join('\n');

  return { subject, html, text };
}
