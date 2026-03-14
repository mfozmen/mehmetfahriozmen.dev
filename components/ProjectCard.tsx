import { Project } from "@/data/projects";

export default function ProjectCard(props: Readonly<Project>) {
  const { name, description, url, importance } = props;
  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-transform duration-200 hover:-translate-y-1">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {importance}
        </span>
        <h3 className="mt-1 text-lg font-semibold text-white">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          {description}
        </p>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-neutral-800 px-4 py-2 text-center text-sm text-neutral-300 transition-colors hover:bg-neutral-700"
        >
          View Project
        </a>
      )}
    </div>
  );
}
