import {
  emailKit,
  escapeHtml,
  multiline,
  optionLabel,
  singleLine,
  siteUrl,
  websiteHref,
  type EmailPalette,
  type RenderedEmail,
} from '@/lib/emails/shared';
import type { BookRequestDTO } from '@/types/book';

const COLOR: EmailPalette = {
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

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Beirut',
  }).format(date);
}

export function renderProjectRequestEmail(
  dto: BookRequestDTO,
  submittedAt: Date = new Date(),
): RenderedEmail {
  const {
    eyebrow,
    headline,
    lead,
    detailGrid,
    quote,
    contactRow,
    link,
    footerLink,
    button,
    buttonRow,
    layout,
  } = emailKit(COLOR);
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
          ${quote(multiline(message))}
        </td>
      </tr>`
    : '';

  const cardRows = `<tr>
                <td class="px" style="padding:32px 32px 8px;">
                  ${eyebrow('New project request')}
                  ${headline(name)}
                  ${lead(`${escapeHtml(company)} wants to talk about <span style="color:${COLOR.text};font-weight:600;">${escapeHtml(service)}</span>.`)}
                </td>
              </tr>
              ${detailGrid([
                ['Service', service],
                ['Budget', budget],
                ['Screens', screens],
                ['Timeline', timeline],
              ])}
              ${messageBlock}
              <tr>
                <td class="px" style="padding:20px 32px 8px;">
                  ${eyebrow('Contact')}
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${contactRows}</table>
                </td>
              </tr>
              ${buttonRow([
                button(replyHref, `Reply to ${firstName}`, 'primary'),
                button(dashboardHref, 'Open dashboard', 'secondary'),
              ])}`;

  const html = layout({
    colorScheme: 'dark',
    title: subject,
    preheader,
    headerAside: `${escapeHtml(submitted)} · Beirut`,
    cardRows,
    footerLines: [
      `Sent by the project form on ${footerLink(`${base}/book`, base.replace(/^https?:\/\//, ''))}.`,
      'You are receiving this because you are an active Pyramid team member.',
    ],
  });

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
