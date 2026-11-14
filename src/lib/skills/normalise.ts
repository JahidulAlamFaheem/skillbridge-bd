export type CanonicalSkill = {
  id: string;
  name: string;
  slug: string;
};

export type SkillCatalogEntry = CanonicalSkill & {
  aliases: string[];
};

export type SkillSuggestion = CanonicalSkill & {
  matchedAlias: string | null;
};

/**
 * Trims leading/trailing whitespace, converts to lowercase, and collapses repeated spaces.
 */
export function normaliseSkillText(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Pure function (no database access) that resolves a text input against a controlled
 * list of canonical skills and their aliases. Returns the canonical skill or null.
 */
export function normalise(
  input: string,
  catalog: readonly SkillCatalogEntry[],
): CanonicalSkill | null {
  if (typeof input !== "string") {
    return null;
  }

  const normalizedInput = normaliseSkillText(input);
  if (normalizedInput === "") {
    return null;
  }

  // First check exact canonical name match
  for (const entry of catalog) {
    if (normaliseSkillText(entry.name) === normalizedInput) {
      return { id: entry.id, name: entry.name, slug: entry.slug };
    }
  }

  // Next check exact alias match
  for (const entry of catalog) {
    for (const alias of entry.aliases) {
      if (normaliseSkillText(alias) === normalizedInput) {
        return { id: entry.id, name: entry.name, slug: entry.slug };
      }
    }
  }

  return null;
}

/**
 * Pure helper to filter controlled skills for the browser search box.
 * Prioritises exact canonical/alias matches, then prefix matches, then substring matches.
 */
export function filterSkillSuggestions(
  query: string,
  catalog: readonly SkillCatalogEntry[],
  excludedSkillIds: ReadonlySet<string> = new Set(),
  limit = 10,
): SkillSuggestion[] {
  const normalizedQuery = normaliseSkillText(query);

  if (normalizedQuery === "") {
    const initial: SkillSuggestion[] = [];
    for (const entry of catalog) {
      if (excludedSkillIds.has(entry.id)) {
        continue;
      }
      initial.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: null,
      });
      if (initial.length >= limit) {
        break;
      }
    }
    return initial;
  }

  const exactMatches: SkillSuggestion[] = [];
  const prefixMatches: SkillSuggestion[] = [];
  const substringMatches: SkillSuggestion[] = [];

  for (const entry of catalog) {
    if (excludedSkillIds.has(entry.id)) {
      continue;
    }

    const normalizedName = normaliseSkillText(entry.name);
    const normalizedAliases = entry.aliases.map((alias) => ({
      raw: alias,
      normalized: normaliseSkillText(alias),
    }));

    if (normalizedName === normalizedQuery) {
      exactMatches.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: null,
      });
      continue;
    }

    const exactAlias = normalizedAliases.find((a) => a.normalized === normalizedQuery);
    if (exactAlias) {
      exactMatches.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: exactAlias.raw,
      });
      continue;
    }

    if (normalizedName.startsWith(normalizedQuery)) {
      prefixMatches.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: null,
      });
      continue;
    }

    const prefixAlias = normalizedAliases.find((a) => a.normalized.startsWith(normalizedQuery));
    if (prefixAlias) {
      prefixMatches.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: prefixAlias.raw,
      });
      continue;
    }

    if (normalizedName.includes(normalizedQuery)) {
      substringMatches.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: null,
      });
      continue;
    }

    const substringAlias = normalizedAliases.find((a) => a.normalized.includes(normalizedQuery));
    if (substringAlias) {
      substringMatches.push({
        id: entry.id,
        name: entry.name,
        slug: entry.slug,
        matchedAlias: substringAlias.raw,
      });
    }
  }

  return [...exactMatches, ...prefixMatches, ...substringMatches].slice(0, limit);
}
