import { describe, expect, it } from "vitest";
import { normalise, type SkillCatalogEntry } from "./normalise";

const SAMPLE_CATALOG: SkillCatalogEntry[] = [
  {
    id: "skill-js",
    name: "JavaScript",
    slug: "javascript",
    aliases: ["js", "ecmascript", "es6"],
  },
  {
    id: "skill-react",
    name: "React",
    slug: "react",
    aliases: ["reactjs", "react.js"],
  },
  {
    id: "skill-pg",
    name: "PostgreSQL",
    slug: "postgresql",
    aliases: ["postgres", "psql"],
  },
  {
    id: "skill-tw",
    name: "Tailwind CSS",
    slug: "tailwind-css",
    aliases: ["tailwind", "tailwindcss"],
  },
  {
    id: "skill-node",
    name: "Node.js",
    slug: "nodejs",
    aliases: ["node", "nodejs", "node js"],
  },
];

describe("normalise", () => {
  it("matches an exact canonical skill name", () => {
    expect(normalise("JavaScript", SAMPLE_CATALOG)).toEqual({
      id: "skill-js",
      name: "JavaScript",
      slug: "javascript",
    });
  });

  it("matches canonical names regardless of capitalisation", () => {
    expect(normalise("jAvAsCrIpT", SAMPLE_CATALOG)).toEqual({
      id: "skill-js",
      name: "JavaScript",
      slug: "javascript",
    });
    expect(normalise("REACT", SAMPLE_CATALOG)).toEqual({
      id: "skill-react",
      name: "React",
      slug: "react",
    });
  });

  it("trims outer whitespace and collapses repeated internal spaces", () => {
    expect(normalise("   Tailwind    CSS   ", SAMPLE_CATALOG)).toEqual({
      id: "skill-tw",
      name: "Tailwind CSS",
      slug: "tailwind-css",
    });
    expect(normalise("  node   js ", SAMPLE_CATALOG)).toEqual({
      id: "skill-node",
      name: "Node.js",
      slug: "nodejs",
    });
  });

  it("resolves known aliases ('js' -> JavaScript, 'reactjs' -> React, 'postgres' -> PostgreSQL)", () => {
    expect(normalise("js", SAMPLE_CATALOG)).toEqual({
      id: "skill-js",
      name: "JavaScript",
      slug: "javascript",
    });
    expect(normalise("  JS ", SAMPLE_CATALOG)).toEqual({
      id: "skill-js",
      name: "JavaScript",
      slug: "javascript",
    });
    expect(normalise("reactjs", SAMPLE_CATALOG)).toEqual({
      id: "skill-react",
      name: "React",
      slug: "react",
    });
    expect(normalise("React.JS", SAMPLE_CATALOG)).toEqual({
      id: "skill-react",
      name: "React",
      slug: "react",
    });
    expect(normalise("postgres", SAMPLE_CATALOG)).toEqual({
      id: "skill-pg",
      name: "PostgreSQL",
      slug: "postgresql",
    });
  });

  it("returns null for unknown free text", () => {
    expect(normalise(" Cobol 85 ", SAMPLE_CATALOG)).toBeNull();
    expect(normalise("unknown-framework", SAMPLE_CATALOG)).toBeNull();
  });

  it("returns null for an empty or whitespace-only string", () => {
    expect(normalise("", SAMPLE_CATALOG)).toBeNull();
    expect(normalise("    \t  \n ", SAMPLE_CATALOG)).toBeNull();
  });
});
