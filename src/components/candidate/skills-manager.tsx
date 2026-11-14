import { SkillAddForm } from "@/components/candidate/skill-add-form";
import { SkillCard } from "@/components/candidate/skill-card";
import type { OwnCandidateSkill } from "@/lib/candidate/skills";
import type { SkillCatalogEntry } from "@/lib/skills/normalise";
import { MAX_CANDIDATE_SKILLS } from "@/lib/validation/skill";

type SkillsManagerProps = {
  skills: OwnCandidateSkill[];
  catalog: SkillCatalogEntry[];
};

export function SkillsManager({ skills, catalog }: SkillsManagerProps) {
  const count = skills.length;
  const limitReached = count >= MAX_CANDIDATE_SKILLS;
  const existingSkillIds = skills.map((item) => item.skill.id);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      {/* Left/Main Column: Candidate's Skills List */}
      <section
        aria-labelledby="candidate-skills-heading"
        className="space-y-4 lg:col-span-7"
      >
        <div className="flex items-center justify-between">
          <h2 id="candidate-skills-heading" className="text-lg font-bold text-slate-900">
            Your skills
          </h2>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {count} / {MAX_CANDIDATE_SKILLS}
          </span>
        </div>

        {count === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
            <h3 className="text-base font-bold text-slate-900">No skills yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Search the controlled skill list to add skills to your profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {skills.map((item) => (
              <SkillCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Right Column: Add Skill Control */}
      <section
        aria-labelledby="add-skill-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-5"
      >
        <h2 id="add-skill-heading" className="text-lg font-bold text-slate-900">
          Add a skill
        </h2>
        <p className="mt-1 mb-5 text-sm text-slate-600">
          Choose from our controlled skill catalog. Common aliases like &ldquo;js&rdquo;,
          &ldquo;reactjs&rdquo;, or &ldquo;postgres&rdquo; automatically match their canonical skill.
        </p>

        {limitReached && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900"
          >
            You have reached the maximum of {MAX_CANDIDATE_SKILLS} skills. Remove an existing skill
            to add another.
          </div>
        )}

        <SkillAddForm
          catalog={catalog}
          existingSkillIds={existingSkillIds}
          disabled={limitReached}
        />
      </section>
    </div>
  );
}
