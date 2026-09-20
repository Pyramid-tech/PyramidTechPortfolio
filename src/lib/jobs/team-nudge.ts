import type PgBoss from 'pg-boss';
import { and, or, eq, isNull, lt, gt, desc, isNotNull } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pyramidTeam } from '@/lib/db/schema/team';
import { pyramidProjects } from '@/lib/db/schema/project';
import { pyramidUpdates } from '@/lib/db/schema/update';
import { chatCompletion } from '@/lib/ai/groq';
import { sendMessage, editMessageText, chatId } from '@/lib/telegram/client';
import { logger } from '@/lib/logger';

const JOB_NAME = 'team-nudge';
const DAY_MS = 24 * 60 * 60 * 1000;

function staleDays(): number {
  const n = Number(process.env.TEAM_NUDGE_STALE_DAYS);
  return Number.isFinite(n) && n > 0 ? n : 3;
}

function detailedEveryDays(): number {
  const n = Number(process.env.TEAM_NUDGE_DETAILED_EVERY_DAYS);
  return Number.isFinite(n) && n >= 0 ? n : 3;
}

function cronExpr(): string {
  return process.env.TEAM_NUDGE_CRON || '0 12 * * *';
}

function stripQuotes(s: string): string {
  return s.replace(/["“”«»„]/g, '');
}

function beirutDate(d: Date): string {
  return new Intl.DateTimeFormat('ar', {
    timeZone: 'Asia/Beirut',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

interface StaleMember {
  name: string;
  latestLoginAt: Date | null;
  daysSince: number | null;
}

interface DevProject {
  title: string;
  summary: string;
  updatedAt: Date | null;
  daysSinceUpdate: number | null;
}

async function collectStaleMembers(cutoff: Date, now: Date): Promise<StaleMember[]> {
  const rows = await db
    .select({
      name: pyramidTeam.name,
      latestLoginAt: pyramidTeam.latestLoginAt,
    })
    .from(pyramidTeam)
    .where(
      and(
        or(
          isNull(pyramidTeam.deactivatedAt),
          gt(pyramidTeam.reactivatedAt, pyramidTeam.deactivatedAt),
        ),
        eq(pyramidTeam.approvalStatus, 'approved'),
        isNotNull(pyramidTeam.password),
        or(isNull(pyramidTeam.latestLoginAt), lt(pyramidTeam.latestLoginAt, cutoff)),
      ),
    );

  return rows.map((r) => ({
    name: r.name,
    latestLoginAt: r.latestLoginAt,
    daysSince: r.latestLoginAt
      ? Math.floor((now.getTime() - r.latestLoginAt.getTime()) / DAY_MS)
      : null,
  }));
}

async function collectDevProjects(now: Date): Promise<DevProject[]> {
  const rows = await db
    .select({
      title: pyramidProjects.title,
      summary: pyramidProjects.summary,
      updatedAt: pyramidProjects.updatedAt,
    })
    .from(pyramidProjects)
    .where(
      and(
        or(
          isNull(pyramidProjects.deactivatedAt),
          gt(pyramidProjects.reactivatedAt, pyramidProjects.deactivatedAt),
        ),
        eq(pyramidProjects.lifecycle, 'in-development'),
      ),
    )
    .orderBy(desc(pyramidProjects.updatedAt));

  return rows.map((r) => ({
    title: r.title,
    summary: r.summary,
    updatedAt: r.updatedAt,
    daysSinceUpdate: r.updatedAt
      ? Math.floor((now.getTime() - r.updatedAt.getTime()) / DAY_MS)
      : null,
  }));
}

async function generateBrief(members: StaleMember[], projects: DevProject[]): Promise<string> {
  const system =
    'أنت "منبّه Pyramid"، رفيق الشلّة البذيء يلي بيهزّأ رفقاتو بكلام جريء ومنحرف شوي. ' +
    'هودي كلّن رفقاء مقرّبين وعم يتباسطوا، فمسموح نبرة خلاعة خفيفة وكلمات بذيئة عامية ' +
    'متل "يلا يا أرانب يا كساياات" بروح المزح والبساط بين الشباب. ' +
    'اكتب جملة وحدة قصيرة باللهجة اللبنانية العامية، جريئة ومضحكة، تذكّرهن يفوتوا عاللوحة ' +
    'ويتابعوا الشغل. بدون مقدمات، بدون علامات تنصيص، وإيموجي أو تنين بيزبطوا الجو.';
  const user =
    `عدد الأعضاء يلي ما سجّلوا دخول مؤخراً: ${members.length}` +
    (members.length ? ` (${members.map((m) => m.name).join('، ')})` : '') +
    `. عدد المشاريع قيد التطوير: ${projects.length}` +
    (projects.length ? ` (${projects.map((p) => p.title).join('، ')})` : '') +
    '.';

  const { content } = await chatCompletion({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.85,
  });
  return stripQuotes(content.trim());
}

async function generateDetailed(members: StaleMember[], projects: DevProject[]): Promise<string> {
  const system =
    'أنت "منبّه Pyramid"، رفيق الشلّة البذيء يلي بيهزّأ رفقاتو بكلام جريء ومنحرف شوي وبيضحّك الكل. ' +
    'هودي كلّن رفقاء مقرّبين وعم يتباسطوا، فمسموح نبرة خلاعة وكلمات بذيئة عامية ' +
    'متل "يلا يا أرانب يا كسايااات" بروح المزح والبساط بين الشباب — خلّيها هزار مع تجريح . ' +
    'اكتب رسالة نظرة عامة باللهجة اللبنانية العامية، جريئة . ' +
    'لكل عضو ما سجّل دخول اكتبلو جملة تهزيء شخصية جريئة ومضحكة (كنية بذيئة، تشبيه منحرف، تحدّي بمزح). ' +
    'بعدين لكل مشروع قيد التطوير قدّم ملخّص مبني حصراً على الوصف المُعطى تحت. ' +
    'مهم جداً: لا تخترع ولا ميزة ولا تفصيل ولا تغيير مش موجود بالوصف — الجدّية بالمعلومة والهزار بالأسلوب. ' +
    'بالنسبة لآخر تحديث اذكر بس عدد الأيام، ولا تصف شو تغيّر لأنو ما عنا هالمعلومة. ' +
    'ممنوع تستعمل علامات التنصيص (" " أو “ ”) نهائياً — اكتب الكنيات والكلمات عادي بدون قوصين. ' +
    'استعمل عناوين وإيموجي بشكل مرح بس مرتّب، وسكّر الرسالة بجملة تحفيزية بتضحّك. جاهزة للإرسال بدون مقدمات.';
  const memberLines = members.length
    ? members
        .map(
          (m) =>
            `- ${m.name}: ${m.daysSince === null ? 'ما سجّل دخول أبداً' : `آخر دخول من ${m.daysSince} يوم`}`,
        )
        .join('\n')
    : 'لا أحد — كلّهم فايتين، برافو! 👏';
  const projectLines = projects.length
    ? projects
        .map(
          (p) =>
            `- ${p.title}\n  الوصف: ${p.summary}\n  آخر تحديث: ${p.daysSinceUpdate === null ? 'غير متوفر' : `من ${p.daysSinceUpdate} يوم`}`,
        )
        .join('\n')
    : 'ما في مشاريع قيد التطوير حالياً.';
  const user = `الأعضاء يلي ما سجّلوا دخول:\n${memberLines}\n\nالمشاريع قيد التطوير:\n${projectLines}`;

  const { content } = await chatCompletion({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.85,
  });
  return stripQuotes(content.trim());
}

async function handleBrief(text: string, snapshot: object): Promise<void> {
  const [existing] = await db
    .select()
    .from(pyramidUpdates)
    .where(eq(pyramidUpdates.kind, 'brief'))
    .orderBy(desc(pyramidUpdates.createdAt))
    .limit(1);

  if (existing?.messageId) {
    const ok = await editMessageText(existing.messageId, text);
    if (ok) {
      await db
        .update(pyramidUpdates)
        .set({ content: text, snapshot, updatedAt: new Date() })
        .where(eq(pyramidUpdates.id, existing.id));
      return;
    }
  }

  const messageId = await sendMessage(text);
  if (messageId === null) return;
  await db.insert(pyramidUpdates).values({
    kind: 'brief',
    content: text,
    messageId,
    chatId: chatId(),
    snapshot,
  });
}

async function shouldSendDetailed(now: Date, everyDays: number): Promise<boolean> {
  const [last] = await db
    .select({ createdAt: pyramidUpdates.createdAt })
    .from(pyramidUpdates)
    .where(eq(pyramidUpdates.kind, 'detailed'))
    .orderBy(desc(pyramidUpdates.createdAt))
    .limit(1);

  if (!last) return true;
  return now.getTime() - last.createdAt.getTime() >= everyDays * DAY_MS;
}

async function handleDetailed(text: string, snapshot: object): Promise<void> {
  const messageId = await sendMessage(text);
  if (messageId === null) return;
  await db.insert(pyramidUpdates).values({
    kind: 'detailed',
    content: text,
    messageId,
    chatId: chatId(),
    snapshot,
  });
}

export async function preview(): Promise<{
  date: string;
  staleMembers: string[];
  devProjects: string[];
  brief: string;
  detailed: string;
}> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - staleDays() * DAY_MS);

  const [members, projects] = await Promise.all([
    collectStaleMembers(cutoff, now),
    collectDevProjects(now),
  ]);

  const date = beirutDate(now);
  const [brief, detailed] = await Promise.all([
    generateBrief(members, projects),
    generateDetailed(members, projects),
  ]);

  return {
    date,
    staleMembers: members.map((m) => m.name),
    devProjects: projects.map((p) => p.title),
    brief: `${brief}\n\n📅 ${date}`,
    detailed: `${detailed}\n\n📅 ${date}`,
  };
}

export async function run(): Promise<void> {
  logger.info('team-nudge: started');

  const now = new Date();
  const cutoff = new Date(now.getTime() - staleDays() * DAY_MS);

  const [members, projects] = await Promise.all([
    collectStaleMembers(cutoff, now),
    collectDevProjects(now),
  ]);

  const snapshot = {
    date: beirutDate(now),
    staleMembers: members.map((m) => ({ name: m.name, daysSince: m.daysSince })),
    devProjects: projects.map((p) => ({
      title: p.title,
      summary: p.summary,
      daysSinceUpdate: p.daysSinceUpdate,
    })),
  };

  const brief = await generateBrief(members, projects);
  await handleBrief(`${brief}\n\n📅 ${snapshot.date}`, snapshot);

  if (await shouldSendDetailed(now, detailedEveryDays())) {
    const detailed = await generateDetailed(members, projects);
    await handleDetailed(`${detailed}\n\n📅 ${snapshot.date}`, snapshot);
    logger.info('team-nudge: sent brief + detailed', {
      staleMembers: members.length,
      devProjects: projects.length,
    });
  } else {
    logger.info('team-nudge: sent brief', {
      staleMembers: members.length,
      devProjects: projects.length,
    });
  }
}

export async function registerTeamNudge(boss: PgBoss): Promise<void> {
  await boss.createQueue(JOB_NAME);
  await boss.schedule(JOB_NAME, cronExpr(), {}, { tz: 'Asia/Beirut' });
  await boss.work(JOB_NAME, run);
  logger.info(`team-nudge: scheduled (${cronExpr()} Asia/Beirut)`);
}
