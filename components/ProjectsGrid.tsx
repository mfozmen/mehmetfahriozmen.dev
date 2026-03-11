import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">
        Systems I&apos;ve helped build
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
}
