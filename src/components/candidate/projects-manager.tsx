import { ProjectCard } from "@/components/candidate/project-card";
import { ProjectForm } from "@/components/candidate/project-form";
import type { OwnCandidateProject } from "@/lib/candidate/projects";
import { MAX_CANDIDATE_PROJECTS } from "@/lib/validation/project";

type ProjectsManagerProps = {
  projects: OwnCandidateProject[];
};

export function ProjectsManager({ projects }: ProjectsManagerProps) {
  const count = projects.length;
  const limitReached = count >= MAX_CANDIDATE_PROJECTS;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      {/* Left/Main Column: Projects List */}
      <section
        aria-labelledby="projects-list-heading"
        className="space-y-4 lg:col-span-7"
      >
        <div className="flex items-center justify-between">
          <h2 id="projects-list-heading" className="text-lg font-bold text-slate-900">
            Your projects &amp; portfolio items
          </h2>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {count} / {MAX_CANDIDATE_PROJECTS}
          </span>
        </div>

        {count === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
            <h3 className="text-base font-bold text-slate-900">No projects yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Add your projects or portfolio items using the form. You can link them as evidence for
              your skills.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Right Column: Add Project Form */}
      <section
        aria-labelledby="add-project-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-5"
      >
        <h2 id="add-project-heading" className="text-lg font-bold text-slate-900">
          Add project
        </h2>
        <p className="mt-1 mb-5 text-sm text-slate-600">
          Share a project repository, live demo, or portfolio entry.
        </p>

        {limitReached && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900"
          >
            You have reached the maximum of {MAX_CANDIDATE_PROJECTS} projects. Delete an existing
            project to add a new one.
          </div>
        )}

        <ProjectForm mode="create" disabled={limitReached} />
      </section>
    </div>
  );
}
