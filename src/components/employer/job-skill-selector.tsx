"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import {
  filterSkillSuggestions,
  normalise,
  type SkillCatalogEntry,
  type SkillSuggestion,
} from "@/lib/skills/normalise";
import { MAX_JOB_SKILLS } from "@/lib/validation/job";

type JobSkillSelectorProps = {
  catalog: SkillCatalogEntry[];
  initialSkillIds: string[];
  disabled?: boolean;
  errorMessages?: string[];
};

export function JobSkillSelector({
  catalog,
  initialSkillIds,
  disabled = false,
  errorMessages,
}: JobSkillSelectorProps) {
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(initialSkillIds);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [localHintError, setLocalHintError] = useState<string | null>(null);

  const catalogById = useMemo(() => {
    const map = new Map<string, SkillCatalogEntry>();
    for (const item of catalog) {
      map.set(item.id, item);
    }
    return map;
  }, [catalog]);

  const selectedSet = useMemo(() => new Set(selectedSkillIds), [selectedSkillIds]);

  const suggestions = useMemo(
    () => filterSkillSuggestions(query, catalog, selectedSet, 8),
    [query, catalog, selectedSet],
  );

  const selectedSkills = useMemo(
    () =>
      selectedSkillIds
        .map((id) => catalogById.get(id))
        .filter((entry): entry is SkillCatalogEntry => Boolean(entry)),
    [selectedSkillIds, catalogById],
  );

  const limitReached = selectedSkillIds.length >= MAX_JOB_SKILLS;
  const isInputDisabled = disabled || limitReached;

  function addSkillById(skillId: string) {
    if (selectedSet.has(skillId)) {
      setLocalHintError("That skill is already selected.");
      return;
    }
    if (selectedSkillIds.length >= MAX_JOB_SKILLS) {
      setLocalHintError(`You can select at most ${MAX_JOB_SKILLS} skills.`);
      return;
    }
    setSelectedSkillIds((prev) => [...prev, skillId]);
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    setLocalHintError(null);
  }

  function addFromTypedQuery() {
    if (query.trim() === "") {
      return;
    }
    const resolved = normalise(query, catalog);
    if (!resolved) {
      setLocalHintError("Choose a skill from the controlled list.");
      return;
    }
    addSkillById(resolved.id);
  }

  function removeSkillById(skillId: string) {
    if (disabled) {
      return;
    }
    setSelectedSkillIds((prev) => prev.filter((id) => id !== skillId));
    setLocalHintError(null);
  }

  function handleSelectSuggestion(suggestion: SkillSuggestion) {
    addSkillById(suggestion.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setActiveIndex((prev) =>
        suggestions.length === 0 ? -1 : (prev + 1) % suggestions.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      setActiveIndex((prev) =>
        suggestions.length === 0
          ? -1
          : (prev - 1 + suggestions.length) % suggestions.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectSuggestion(suggestions[activeIndex]);
        return;
      }
      addFromTypedQuery();
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = isOpen && !isInputDisabled && suggestions.length > 0;
  const activeOptionId =
    showDropdown && activeIndex >= 0 && suggestions[activeIndex]
      ? `job-skill-option-${suggestions[activeIndex].id}`
      : undefined;

  const hasError = Boolean(errorMessages?.length) || Boolean(localHintError);

  return (
    <div className="space-y-4">
      {selectedSkillIds.map((skillId) => (
        <input key={skillId} type="hidden" name="skillIds" value={skillId} />
      ))}

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="job-skill-search"
            className="block text-sm font-semibold text-slate-900"
          >
            Search and add required skills <span className="text-red-600">*</span>
          </label>
          <span className="text-xs font-semibold text-slate-500">
            {selectedSkillIds.length} / {MAX_JOB_SKILLS} selected
          </span>
        </div>

        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <input
              id="job-skill-search"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showDropdown}
              aria-controls="job-skill-suggestions-listbox"
              aria-activedescendant={activeOptionId}
              aria-invalid={hasError}
              aria-describedby="job-skill-hint job-skill-error"
              autoComplete="off"
              value={query}
              disabled={isInputDisabled}
              placeholder={
                limitReached
                  ? `Maximum of ${MAX_JOB_SKILLS} skills reached`
                  : "Search skills or aliases (e.g. js, reactjs, postgres)..."
              }
              onFocus={() => setIsOpen(true)}
              onBlur={() => {
                setIsOpen(false);
                setActiveIndex(-1);
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
                setLocalHintError(null);
              }}
              onKeyDown={handleKeyDown}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
            />

            {showDropdown && (
              <ul
                id="job-skill-suggestions-listbox"
                role="listbox"
                aria-label="Controlled skill suggestions"
                className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              >
                {suggestions.map((suggestion, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={suggestion.id}
                      id={`job-skill-option-${suggestion.id}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleSelectSuggestion(suggestion);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex cursor-pointer items-center justify-between px-3.5 py-2 text-sm ${
                        isActive
                          ? "bg-brand-blue-light font-semibold text-brand-blue"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <span>{suggestion.name}</span>
                      {suggestion.matchedAlias && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          alias: {suggestion.matchedAlias}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={addFromTypedQuery}
            disabled={isInputDisabled || query.trim() === ""}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Add skill
          </button>
        </div>

        <p id="job-skill-hint" className="mt-1 text-xs text-slate-500">
          Select 1 to {MAX_JOB_SKILLS} skills from the controlled catalog. Click a suggestion or
          type a skill/alias and press Enter.
        </p>

        {(errorMessages?.[0] || localHintError) && (
          <p id="job-skill-error" className="mt-1 text-xs text-red-700">
            {localHintError ?? errorMessages?.[0]}
          </p>
        )}
      </div>

      {/* Selected Skills List */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Selected required skills ({selectedSkills.length})
        </p>

        {selectedSkills.length === 0 ? (
          <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-600">
            No required skills selected yet. Add at least 1 skill above.
          </div>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <li
                key={skill.id}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-slate-900"
              >
                <span>{skill.name}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeSkillById(skill.id)}
                    aria-label={`Remove ${skill.name}`}
                    className="rounded p-0.5 text-slate-500 hover:bg-blue-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    &times;
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
