import {
  emailKit,
  escapeHtml,
  findOptionLabel,
  singleLine,
  siteUrl,
  type EmailPalette,
  type RenderedEmail,
} from '@/lib/emails/shared';
import { SITE } from '@/lib/site';
import { WHATSAPP_MESSAGES, whatsappUrl } from '@/lib/whatsapp';
import type { BookRequestDTO } from '@/types/book';

const SUBJECT = 'We received your project request';
const NEXT_STEP = 'We reply within two working days.';
const FIRST_NAME_MAX_LENGTH = 40;
const COMPANY_MAX_LENGTH = 80;

const COLOR: EmailPalette = {
  page: '#F4F7FC',
  card: '#FFFFFF',
  inset: '#F4F7FC',
  border: '#C5D2E6',
  hairline: '#DCE5F2',
  text: '#12243F',
  textSecondary: '#1C3B62',
  textMuted: '#4E6F96',
  accent: '#1E5DC8',
  onAccent: '#FFFFFF',
};

function truncate(value: string, maxLength: number): string {
  const chars = Array.from(value);
  return chars.length > maxLength ? `${chars.slice(0, maxLength - 1).join('').trimEnd()}…` : value;
}

function answer(formKey: string, value: string): string {
  return findOptionLabel(formKey, value) ?? '—';
}

export function renderProjectConfirmationEmail(dto: BookRequestDTO): RenderedEmail {
  const { eyebrow, headline, lead, detailGrid, quote, footerLink, button, buttonRow, layout } = emailKit(COLOR, {
    breakLongWords: true,
  });
  const base = siteUrl();
  const firstName = truncate(singleLine(dto.name).split(' ')[0], FIRST_NAME_MAX_LENGTH);
  const company = truncate(singleLine(dto.company), COMPANY_MAX_LENGTH);
  const email = dto.email.trim();
  const workHref = `${base}/work`;
  const whatsappHref = whatsappUrl(WHATSAPP_MESSAGES.default);
  const greeting = firstName ? `Thanks, ${firstName}` : 'Thanks';
  const intro = "Your project request arrived safely. Here's a summary of what you sent us.";
  const followUp = `Someone from the team will read it and get back to you at ${email}.`;
  const preheader = `${greeting}. ${NEXT_STEP} Here's a summary of your request.`;

  const summary: Array<[string, string]> = [
    ['Service', answer('_service', dto.service)],
    ['Budget', answer('_budget', dto.budget)],
    ['Screens', answer('_pages', dto.pages)],
    ['Timeline', answer('_quickness', dto.quickness)],
    ['Company', company],
  ];

  const cardRows = `<tr>
                <td class="px" style="padding:32px 32px 8px;">
                  ${eyebrow('Request received')}
                  ${headline(greeting)}
                  ${lead(escapeHtml(intro))}
                </td>
              </tr>
              ${detailGrid(summary)}
              <tr>
                <td class="px" style="padding:20px 32px 8px;">
                  ${eyebrow('What happens next')}
                  ${quote(`<span style="color:${COLOR.text};font-weight:600;">${escapeHtml(NEXT_STEP)}</span> ${escapeHtml(followUp)}`)}
                </td>
              </tr>
              ${buttonRow([button(workHref, 'See our work', 'primary')])}`;

  const html = layout({
    colorScheme: 'light',
    title: SUBJECT,
    preheader,
    headerAside: '',
    cardRows,
    footerLines: [
      `This address isn&#39;t monitored. To reach us, email ${footerLink(`mailto:${SITE.email}`, SITE.email)} or message us on ${footerLink(whatsappHref, 'WhatsApp')}.`,
      `You&#39;re receiving this because this email address was entered in the project form on ${footerLink(`${base}/book`, base.replace(/^https?:\/\//, ''))}. If that wasn&#39;t you, you can ignore this email.`,
    ],
  });

  const text = [
    SUBJECT.toUpperCase(),
    '',
    `${greeting}. ${intro}`,
    '',
    ...summary.map(([label, value]) => `${`${label}:`.padEnd(10)}${value}`),
    '',
    'WHAT HAPPENS NEXT',
    `${NEXT_STEP} ${followUp}`,
    '',
    `See our work: ${workHref}`,
    '',
    '---',
    `This address isn't monitored. To reach us, email ${SITE.email} or message us on WhatsApp: ${whatsappHref}`,
    `You're receiving this because this email address was entered in the project form on ${base}/book. If that wasn't you, you can ignore this email.`,
  ].join('\n');

  return { subject: SUBJECT, html, text };
}
