import { RADIO_FIELDS } from '@/lib/constants';

const FALLBACK_SITE_URL = 'https://www.pyramidtech.dev';

export const DISPLAY_FONT = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const BODY_FONT = "'Hanken Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";

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

export interface EmailPalette {
  page: string;
  card: string;
  inset: string;
  border: string;
  hairline: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  onAccent: string;
}

export interface EmailLayout {
  colorScheme: 'light' | 'dark';
  title: string;
  preheader: string;
  headerAside: string;
  cardRows: string;
  footerLines: string[];
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function multiline(value: string): string {
  return escapeHtml(value.trim()).replace(/\r?\n/g, '<br>');
}

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  return configured?.startsWith('https://') ? configured.replace(/\/$/, '') : FALLBACK_SITE_URL;
}

export function findOptionLabel(formKey: string, value: string): string | undefined {
  const field = RADIO_FIELDS.find((candidate) => candidate.formKey === formKey);
  return field?.radioArray.find((option) => option.value === value)?.name;
}

export function optionLabel(formKey: string, value: string): string {
  return findOptionLabel(formKey, value) ?? value;
}

export function websiteHref(value: string): string | null {
  const trimmed = value.trim();
  if (/^https?:\/\/\S+$/i.test(trimmed)) return trimmed;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(trimmed)) return `https://${trimmed}`;
  return null;
}

export function emailKit(palette: EmailPalette, { breakLongWords = false }: { breakLongWords?: boolean } = {}) {
  const wrap = breakLongWords ? 'word-break:break-word;overflow-wrap:anywhere;' : '';

  function eyebrow(label: string): string {
    return `<div style="font-family:${DISPLAY_FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${palette.accent};margin:0 0 8px;">${escapeHtml(label)}</div>`;
  }

  function headline(text: string): string {
    return `<h1 class="headline" style="margin:0;font-family:${DISPLAY_FONT};font-size:32px;line-height:1.1;font-weight:700;text-transform:uppercase;letter-spacing:-0.5px;color:${palette.text};${wrap}">${escapeHtml(text)}</h1>`;
  }

  function lead(html: string): string {
    return `<p style="margin:10px 0 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:${palette.textSecondary};${wrap}">${html}</p>`;
  }

  function detailCell(label: string, value: string, wide: boolean): string {
    return `
    <td class="stack" ${wide ? 'colspan="2"' : 'width="50%"'} valign="top" style="padding:6px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.inset}" style="background:${palette.inset};border:1px solid ${palette.border};border-radius:12px;">
        <tr>
          <td style="padding:14px 16px;">
            <div style="font-family:${DISPLAY_FONT};font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${palette.textMuted};margin:0 0 6px;">${escapeHtml(label)}</div>
            <div style="font-family:${BODY_FONT};font-size:15px;font-weight:600;line-height:1.4;color:${palette.text};${wrap}">${escapeHtml(value)}</div>
          </td>
        </tr>
      </table>
    </td>`;
  }

  function detailGrid(cells: Array<[string, string]>): string {
    const rows: string[] = [];
    for (let i = 0; i < cells.length; i += 2) {
      const pair = cells.slice(i, i + 2);
      const wide = pair.length === 1;
      rows.push(`                    <tr>${pair.map(([label, value]) => detailCell(label, value, wide)).join('')}</tr>`);
    }
    return `<tr>
                <td class="px-grid" style="padding:20px 26px 12px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${rows.join('\n')}
                  </table>
                </td>
              </tr>`;
  }

  function quote(html: string): string {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-left:3px solid ${palette.accent};padding:4px 0 4px 16px;font-family:${BODY_FONT};font-size:15px;line-height:1.65;color:${palette.textSecondary};${wrap}">${html}</td>
            </tr>
          </table>`;
  }

  function contactRow(label: string, valueHtml: string): string {
    return `
    <tr>
      <td width="96" valign="top" style="padding:10px 0;border-top:1px solid ${palette.hairline};font-family:${DISPLAY_FONT};font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${palette.textMuted};">${escapeHtml(label)}</td>
      <td valign="top" style="padding:10px 0;border-top:1px solid ${palette.hairline};font-family:${BODY_FONT};font-size:15px;line-height:1.5;color:${palette.text};">${valueHtml}</td>
    </tr>`;
  }

  function link(href: string, label: string): string {
    return `<a href="${escapeHtml(href)}" style="color:${palette.accent};text-decoration:none;">${escapeHtml(label)}</a>`;
  }

  function footerLink(href: string, label: string): string {
    return `<a href="${escapeHtml(href)}" style="color:${palette.textSecondary};text-decoration:underline;">${escapeHtml(label)}</a>`;
  }

  function button(href: string, label: string, variant: 'primary' | 'secondary'): string {
    const primary = variant === 'primary';
    return `
    <td class="btn-cell" style="padding:6px;">
      <table role="presentation" class="btn-table" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" bgcolor="${primary ? palette.accent : palette.card}" style="border-radius:999px;border:1px solid ${primary ? palette.accent : palette.border};">
            <a class="btn-link" href="${escapeHtml(href)}" style="display:inline-block;padding:13px 24px;white-space:nowrap;font-family:${DISPLAY_FONT};font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;text-decoration:none;color:${primary ? palette.onAccent : palette.text};border-radius:999px;">${escapeHtml(label)}</a>
          </td>
        </tr>
      </table>
    </td>`;
  }

  function buttonRow(buttons: string[]): string {
    return `<tr>
                <td class="px-grid" style="padding:20px 26px 32px;">
                  <table role="presentation" class="btn-table" cellpadding="0" cellspacing="0" border="0">
                    <tr>${buttons.join('')}</tr>
                  </table>
                </td>
              </tr>`;
  }

  function layout({ colorScheme, title, preheader, headerAside, cardRows, footerLines }: EmailLayout): string {
    const base = siteUrl();
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="${colorScheme}">
<meta name="supported-color-schemes" content="${colorScheme}">
<title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background: ${palette.page}; }
  a { color: ${palette.accent}; }
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
<body style="margin:0;padding:0;background:${palette.page};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.page}" style="background:${palette.page};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <tr>
          <td style="padding:0 8px 20px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" width="40"><img src="${escapeHtml(base)}/images/logo/icon-nobg.png" width="36" height="36" alt="Pyramid" style="display:block;border:0;width:36px;height:36px;"></td>
                <td valign="middle" style="padding-left:10px;font-family:${DISPLAY_FONT};font-size:14px;font-weight:700;letter-spacing:4px;color:${palette.text};">PYRAMID</td>
                <td valign="middle" align="right" style="font-family:${BODY_FONT};font-size:12px;color:${palette.textMuted};">${headerAside}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="${palette.card}" style="background:${palette.card};border:1px solid ${palette.border};border-radius:16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${cardRows}
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 16px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.6;color:${palette.textMuted};">
            ${footerLines.join('<br>\n            ')}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
  }

  return { eyebrow, headline, lead, detailGrid, quote, contactRow, link, footerLink, button, buttonRow, layout };
}
