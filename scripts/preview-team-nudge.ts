import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

// preview only — generates the messages WITHOUT sending to Telegram or writing the DB
// to run it: npx tsx scripts/preview-team-nudge.ts
async function main() {
  const { preview } = await import('../src/lib/jobs/team-nudge');
  const p = await preview();

  console.log('\n📅 التاريخ:', p.date);
  console.log('👥 ما سجّلوا دخول:', p.staleMembers.join('، ') || '—');
  console.log('🛠️  قيد التطوير:', p.devProjects.join('، ') || '—');

  console.log('\n──────── BRIEF (يومي، بيعدّل نفس الرسالة) ────────\n');
  console.log(p.brief);

  console.log('\n──────── DETAILED (كل 3 أيام، رسالة جديدة) ────────\n');
  console.log(p.detailed);
  console.log('\n──────────────────────────────────────────────\n');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
