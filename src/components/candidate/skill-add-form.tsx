"use client";

import { useActionState, useMemo, useState, type KeyboardEvent } from "react";
import {
  addSkillAction,
  type AddSkillActionState,
} from "@/lib/candidate/skill-actions";
import {
  filterSkillSuggestions,
  normalise,
  type SkillCatalogEntry,
  type SkillSuggestion,
} from "@/lib/skills/normalise";

type SkillAddFormProps = {
  catalog: SkillCatalogEntry[];
  existingSkillIds: string[];
  disabled?: boolean;
};

type SkillComboboxProps = {
  catalog: SkillCatalogEntry[];
  existingSkillIds: string[];
  initialQuery: string;
  disabled: boolean;
  isPending: boolean;
  hasError: boolean;
};

const initialState: AddSkillActionState = {
  status: "idle",
  query: "",
};

function SkillCombobox({
  catalog,
  existingSkillIds,
  initialQuery,
  disabled,
  isPending,
  hasError,
}: SkillComboboxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const excludedSet = useMemo(() => new Set(existingSkillIds), [existingSkillIds]);

  const suggestions = useMemo(
    () => filterSkillSuggestions(query, catalog, excludedSet, 8),
    [query, catalog, excludedSet],
  );

  const resolvedPreview = useMemo(() => {
    if (selectedSkillId) {
      return catalog.find((item) => item.id === selectedSkillId) ?? null;
    }
    return normalise(query, catalog);
  }, [selectedSkillId, query, catalog]);

  function selectSuggestion(suggestion: SkillSuggestion) {
    setQuery(suggestion.name);
    setSelectedSkillId(suggestion.id);
    setIsOpen(false);
    setActiveIndex(-1);
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

    if (event.key === "Enter" && isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = isOpen && !disabled && suggestions.length > 0;
  const activeOptionId =
    showDropdown && activeIndex >= 0 && suggestions[activeIndex]
      ? `skill-suggestion-${suggestions[activeIndex].id}`
      : undefined;

  return (
    <div className="space-y-4">
      <input type="hidden" name="skillId" value={selectedSkillId} />

      <div className="relative">
        <label
          htmlFor="skill-search-input"
          className="block text-sm font-semibold text-slate-900"
        >
          Search controlled skill list
        </label>
        <input
          id="skill-search-input"
          name="query"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="skill-suggestions-listbox"
          aria-activedescendant={activeOptionId}
          aria-invalid={hasError}
          aria-describedby="skill-search-hint"
          autoComplete="off"
          value={query}
          disabled={disabled}
          placeholder="Type a skill or alias (e.g. js, reactjs, postgres)..."
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setIsOpen(false);
            setActiveIndex(-1);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedSkillId("");
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
        />

        {showDropdown && (
          <ul
            id="skill-suggestions-listbox"
            role="listbox"
            aria-label="Skill suggestions"
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {suggestions.map((suggestion, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={suggestion.id}
                  id={`skill-suggestion-${suggestion.id}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectSuggestion(suggestion);
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

      <p id="skill-search-hint" className="text-xs text-slate-500">
        {resolvedPreview ? (
          <span>
            Will add canonical skill:{" "}
            <strong className="font-semibold text-slate-800">
              {resolvedPreview.name}
            </strong>
          </span>
        ) : (
          "Pick a suggestion or type an exact skill name or alias (such as 'js' for JavaScript)."
        )}
      </p>

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Adding skill..." : "Add skill"}
      </button>
    </div>
  );
}

export function SkillAddForm({
  catalog,
  existingSkillIds,
  disabled = false,
}: SkillAddFormProps) {
  const [state, formAction, isPending] = useActionState(addSkillAction, initialState);

  return (
    <form action={formAction} noValidate className="space-y-4">
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      )}

      {state.status === "success" && state.message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          {state.message}
        </div>
      )}

      <SkillCombobox
        key={state.nonce ?? 0}
        catalog={catalog}
        existingSkillIds={existingSkillIds}
        initialQuery={state.query ?? ""}
        disabled={disabled || isPending}
        isPending={isPending}
        hasError={state.status === "error"}
      />
    </form>
  );
}
