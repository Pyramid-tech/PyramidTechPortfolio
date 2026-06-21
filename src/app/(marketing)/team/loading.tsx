import Navigation from '@/components/sections/navigation';
import TeamSkeleton from '@/components/sections/team/skeleton';
import Footer from '@/components/sections/footer';

export default function TeamLoading() {
  return (
    <>
      <Navigation />
      <section className="min-h-screen w-full bg-bg-1 py-[8vw]">
        <TeamSkeleton count={5} />
      </section>
      <Footer />
    </>
  );
}
