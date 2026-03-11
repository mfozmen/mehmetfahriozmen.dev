import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Hero />
      <div className="mt-24">
        <ProjectsGrid />
      </div>
    </main>
  );
}
