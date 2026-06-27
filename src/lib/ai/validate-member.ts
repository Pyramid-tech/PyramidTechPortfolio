/**
 * AI validation for team-member submissions. Scores how confident we are that a
 * profile is a genuine, professional, publishable team member (0–100), routing
 * to the vision model when a photo is supplied.
 *
 * NEVER throws: any failure (Groq down, timeout, non-2xx, unparseable output) is
 * returned as `{ available: false }` so callers hold the member for approval.
 */
import { z } from 'zod';

import type { MemberContent, MemberVerdict } from '@/types/team';

import { chatCompletion, type ChatMessage, type ContentPart } from './groq';

const SYSTEM_PROMPT = `You are a strict reviewer for the public "Team" page of a company's marketing website. You decide whether a submitted team-member profile is a genuine, professional person who is safe to auto-publish.

Return ONLY a JSON object of the form:
{"confidence": <integer 0-100>, "reason": "<one short sentence>", "flags": ["<optional short tags>"]}

"confidence" = how confident you are that this is a REAL, professional team member safe to publish unedited. Score LOW (below 50) if you see ANY of:
- Gibberish, keyboard-mashing, or placeholder text (e.g. "asdf", "test", "lorem ipsum", "John Doe", "name", "N/A").
- Fake, joke, or implausible names or job titles.
- Spam, promotional copy, or unrelated links in the name/title/description.
- Offensive, sexual, hateful, or otherwise inappropriate content.
- A photo that is NOT a genuine professional headshot of a real person (logo, meme, cartoon, blank/placeholder, screenshot, or a subject clearly inconsistent with the stated name/role).

Score HIGH (50 or above) only when the name, job title and description read as a plausible, professional real person AND the photo (if provided) is a real professional headshot consistent with the profile.

Be conservative: when unsure, score below 50. Keep "reason" to one concise sentence.`;

const verdictSchema = z.object({
  confidence: z.coerce.number(),
  reason: z.coerce.string().optional(),
  flags: z.array(z.coerce.string()).optional(),
});

/** Strip ``` / ```json fences if a model wraps its JSON despite json_object mode. */
function stripFences(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('```')) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export async function validateMember(
  content: MemberContent,
  avatarUrl?: string | null,
): Promise<MemberVerdict> {
  const details = [
    `Name: ${content.name}`,
    `Job title: ${content.jobTitle}`,
    `Description/bio: ${content.description?.trim() || '(none)'}`,
    `LinkedIn URL: ${content.linkedinUrl?.trim() || '(none)'}`,
  ].join('\n');

  const intro = avatarUrl
    ? 'Review this team-member profile and the attached profile photo, then score it:'
    : 'Review this team-member profile (no photo provided), then score it:';

  const userContent: string | ContentPart[] = avatarUrl
    ? [
        { type: 'text', text: `${intro}\n\n${details}` },
        { type: 'image_url', image_url: { url: avatarUrl } },
      ]
    : `${intro}\n\n${details}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];

  try {
    const { content: raw, model } = await chatCompletion({ messages, jsonObject: true });
    const parsed = verdictSchema.parse(JSON.parse(stripFences(raw)));
    const reason =
      parsed.reason?.trim() || (parsed.flags?.length ? parsed.flags.join('; ') : null);
    return { available: true, confidence: clamp(parsed.confidence), reason, model };
  } catch (err) {
    return {
      available: false,
      confidence: null,
      reason: `AI validation unavailable: ${String(err instanceof Error ? err.message : err).slice(0, 200)}`,
      model: null,
    };
  }
}
