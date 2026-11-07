/**
 * SkillBridge BD — demo seed. Run with `npm run db:seed`. Safe to run more than once.
 *
 * All people, companies and projects below are fictional.
 *
 * Admin account: email and password come from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
 *
 * Demo accounts (password = SEED_DEMO_PASSWORD, default "Demo@12345"):
 *   Employers:  employer.shapla@example.com   (Shapla Byte Studio)
 *               employer.padma@example.com    (Padma Grid Solutions)
 *   Candidates: candidate.nusrat@example.com
 *               candidate.tanvir@example.com
 */
import "dotenv/config";
import { hash } from "bcryptjs";
import type {
  ExperienceLevel,
  JobType,
  ProjectKind,
  Role,
  WorkArrangement,
} from "../src/generated/prisma/client";
import { prisma } from "../src/lib/db";

const BCRYPT_ROUNDS = 12;
const DEFAULT_DEMO_PASSWORD = "Demo@12345";

// ---------- Skills ----------

type SkillSeed = { name: string; slug: string; aliases: string[] };

const SKILLS: SkillSeed[] = [
  // Languages
  { name: "JavaScript", slug: "javascript", aliases: ["js", "ecmascript", "es6"] },
  { name: "TypeScript", slug: "typescript", aliases: ["ts"] },
  { name: "Python", slug: "python", aliases: ["py", "python3"] },
  { name: "Java", slug: "java", aliases: ["core java", "java se"] },
  { name: "C#", slug: "csharp", aliases: ["csharp", "c sharp"] },
  { name: "PHP", slug: "php", aliases: ["php8", "php 8"] },
  { name: "Go", slug: "go", aliases: ["golang"] },
  { name: "Kotlin", slug: "kotlin", aliases: ["kt"] },
  { name: "Dart", slug: "dart", aliases: ["dartlang"] },
  // Frontend
  { name: "HTML", slug: "html", aliases: ["html5"] },
  { name: "CSS", slug: "css", aliases: ["css3"] },
  { name: "React", slug: "react", aliases: ["reactjs", "react.js"] },
  { name: "Next.js", slug: "nextjs", aliases: ["nextjs", "next"] },
  { name: "Vue.js", slug: "vuejs", aliases: ["vue", "vuejs"] },
  { name: "Angular", slug: "angular", aliases: ["angularjs", "angular.js"] },
  { name: "Tailwind CSS", slug: "tailwind-css", aliases: ["tailwind", "tailwindcss"] },
  { name: "Bootstrap", slug: "bootstrap", aliases: ["bootstrap5", "bootstrap 5"] },
  { name: "Redux", slug: "redux", aliases: ["redux toolkit", "rtk"] },
  // Backend
  { name: "Node.js", slug: "nodejs", aliases: ["node", "nodejs"] },
  { name: "Express.js", slug: "expressjs", aliases: ["express", "expressjs"] },
  { name: "Django", slug: "django", aliases: ["django rest framework", "drf"] },
  { name: "Laravel", slug: "laravel", aliases: ["laravel framework"] },
  { name: "Spring Boot", slug: "spring-boot", aliases: ["springboot", "spring"] },
  { name: "ASP.NET Core", slug: "aspnet-core", aliases: ["asp.net", ".net core", "dotnet"] },
  { name: "REST APIs", slug: "rest-apis", aliases: ["rest", "rest api", "restful api"] },
  { name: "GraphQL", slug: "graphql", aliases: ["gql"] },
  // Databases
  { name: "SQL", slug: "sql", aliases: ["structured query language"] },
  { name: "PostgreSQL", slug: "postgresql", aliases: ["postgres", "psql"] },
  { name: "MySQL", slug: "mysql", aliases: ["my sql"] },
  { name: "MongoDB", slug: "mongodb", aliases: ["mongo"] },
  { name: "Redis", slug: "redis", aliases: ["redis cache"] },
  { name: "Prisma", slug: "prisma", aliases: ["prisma orm"] },
  // DevOps and tools
  { name: "Git", slug: "git", aliases: ["git scm", "version control"] },
  { name: "GitHub", slug: "github", aliases: ["gh"] },
  { name: "Docker", slug: "docker", aliases: ["dockerfile", "containers"] },
  { name: "Kubernetes", slug: "kubernetes", aliases: ["k8s", "kube"] },
  { name: "AWS", slug: "aws", aliases: ["amazon web services"] },
  { name: "Linux", slug: "linux", aliases: ["ubuntu", "unix"] },
  { name: "CI/CD", slug: "ci-cd", aliases: ["cicd", "continuous integration"] },
  { name: "Jest", slug: "jest", aliases: ["jestjs"] },
  { name: "Playwright", slug: "playwright", aliases: ["playwright test"] },
  // Mobile
  { name: "Flutter", slug: "flutter", aliases: ["flutter sdk"] },
  { name: "React Native", slug: "react-native", aliases: ["rn", "reactnative"] },
  { name: "Android Development", slug: "android-development", aliases: ["android", "android sdk"] },
  // Data
  { name: "Pandas", slug: "pandas", aliases: ["python pandas"] },
  { name: "Power BI", slug: "power-bi", aliases: ["powerbi", "microsoft power bi"] },
  { name: "Data Analysis", slug: "data-analysis", aliases: ["data analytics", "analytics"] },
  { name: "Machine Learning", slug: "machine-learning", aliases: ["ml"] },
  { name: "Excel", slug: "excel", aliases: ["ms excel", "microsoft excel", "spreadsheets"] },
  { name: "Google Sheets", slug: "google-sheets", aliases: ["gsheets", "sheets"] },
  // Design
  { name: "Figma", slug: "figma", aliases: ["figma design"] },
  { name: "UI/UX Design", slug: "ui-ux-design", aliases: ["ui design", "ux design", "ui/ux"] },
  { name: "Adobe Photoshop", slug: "adobe-photoshop", aliases: ["photoshop"] },
  { name: "Adobe Illustrator", slug: "adobe-illustrator", aliases: ["illustrator"] },
  { name: "Graphic Design", slug: "graphic-design", aliases: ["graphics design", "visual design"] },
  // Marketing and content
  { name: "SEO", slug: "seo", aliases: ["search engine optimization", "search engine optimisation"] },
  { name: "Digital Marketing", slug: "digital-marketing", aliases: ["online marketing", "internet marketing"] },
  { name: "Social Media Marketing", slug: "social-media-marketing", aliases: ["smm", "social media"] },
  { name: "Content Writing", slug: "content-writing", aliases: ["copywriting", "blog writing"] },
  { name: "Google Analytics", slug: "google-analytics", aliases: ["ga4", "ga"] },
  { name: "Email Marketing", slug: "email-marketing", aliases: ["email campaigns"] },
  // Professional
  { name: "Communication", slug: "communication", aliases: ["communication skills"] },
  { name: "Project Management", slug: "project-management", aliases: ["pm"] },
  { name: "Agile/Scrum", slug: "agile-scrum", aliases: ["agile", "scrum"] },
  { name: "Customer Support", slug: "customer-support", aliases: ["customer service"] },
];

// ---------- Employers and jobs ----------

type JobSeed = {
  title: string;
  description: string;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  workArrangement: WorkArrangement;
  location: string;
  deadlineInDays: number | null;
  skills: string[]; // skill slugs
};

type EmployerSeed = {
  email: string;
  name: string;
  organization: { name: string; description: string; website: string | null; location: string };
  jobs: JobSeed[];
};

const EMPLOYERS: EmployerSeed[] = [
  {
    email: "employer.shapla@example.com",
    name: "Farhana Akter",
    organization: {
      name: "Shapla Byte Studio",
      description:
        "A fictional software studio building web products for local businesses and NGOs.",
      website: "https://shapla-byte.example.com",
      location: "Dhaka",
    },
    jobs: [
      {
        title: "Junior Frontend Developer",
        description:
          "Build responsive React interfaces with our product team. You will turn designs into accessible components and fix UI bugs.",
        experienceLevel: "JUNIOR",
        jobType: "FULL_TIME",
        workArrangement: "ONSITE",
        location: "Dhaka",
        deadlineInDays: 30,
        skills: ["javascript", "typescript", "react", "tailwind-css", "git"],
      },
      {
        title: "Backend Developer (Node.js)",
        description:
          "Design and maintain REST APIs in Node.js and TypeScript backed by PostgreSQL. Work with Docker-based deployments.",
        experienceLevel: "MID",
        jobType: "FULL_TIME",
        workArrangement: "HYBRID",
        location: "Dhaka",
        deadlineInDays: 45,
        skills: ["nodejs", "typescript", "postgresql", "rest-apis", "docker", "git"],
      },
      {
        title: "Software Engineering Intern",
        description:
          "A three-month internship for students and recent graduates. Learn our workflow by shipping small web features with mentors.",
        experienceLevel: "INTERN",
        jobType: "INTERNSHIP",
        workArrangement: "ONSITE",
        location: "Chattogram",
        deadlineInDays: 21,
        skills: ["javascript", "html", "css", "git"],
      },
      {
        title: "Senior Full-Stack Engineer",
        description:
          "Lead features end to end across our Next.js frontend and Node.js services, review code and mentor junior developers.",
        experienceLevel: "SENIOR",
        jobType: "FULL_TIME",
        workArrangement: "REMOTE",
        location: "Remote",
        deadlineInDays: null,
        skills: ["typescript", "react", "nextjs", "nodejs", "postgresql", "aws"],
      },
      {
        title: "QA Automation Engineer",
        description:
          "Write and maintain automated end-to-end and unit tests for client projects on a six-month contract.",
        experienceLevel: "ENTRY",
        jobType: "CONTRACT",
        workArrangement: "HYBRID",
        location: "Sylhet",
        deadlineInDays: null,
        skills: ["javascript", "playwright", "jest", "git"],
      },
    ],
  },
  {
    email: "employer.padma@example.com",
    name: "Imran Chowdhury",
    organization: {
      name: "Padma Grid Solutions",
      description:
        "A fictional digital agency offering data reporting, marketing and design services.",
      website: null,
      location: "Chattogram",
    },
    jobs: [
      {
        title: "Junior Data Analyst",
        description:
          "Clean sales data, write SQL queries and build weekly Power BI reports for agency clients.",
        experienceLevel: "JUNIOR",
        jobType: "FULL_TIME",
        workArrangement: "ONSITE",
        location: "Cumilla",
        deadlineInDays: 30,
        skills: ["sql", "excel", "power-bi", "data-analysis"],
      },
      {
        title: "Digital Marketing Executive",
        description:
          "Plan and run social media and search campaigns, then report results using Google Analytics.",
        experienceLevel: "ENTRY",
        jobType: "FULL_TIME",
        workArrangement: "ONSITE",
        location: "Chattogram",
        deadlineInDays: null,
        skills: ["digital-marketing", "seo", "social-media-marketing", "google-analytics"],
      },
      {
        title: "Content Writer (Part-time)",
        description:
          "Write clear, search-friendly blog posts and website copy in English for client websites.",
        experienceLevel: "ENTRY",
        jobType: "PART_TIME",
        workArrangement: "REMOTE",
        location: "Remote",
        deadlineInDays: null,
        skills: ["content-writing", "seo", "google-sheets"],
      },
      {
        title: "UI/UX Design Intern",
        description:
          "Support our designers with wireframes, prototypes and simple marketing graphics in Figma.",
        experienceLevel: "INTERN",
        jobType: "INTERNSHIP",
        workArrangement: "HYBRID",
        location: "Dhaka",
        deadlineInDays: 14,
        skills: ["figma", "ui-ux-design", "graphic-design"],
      },
      {
        title: "Graphic Designer",
        description:
          "Create brand assets, social media creatives and print materials for clients on a contract basis.",
        experienceLevel: "MID",
        jobType: "CONTRACT",
        workArrangement: "ONSITE",
        location: "Sylhet",
        deadlineInDays: null,
        skills: ["graphic-design", "adobe-photoshop", "adobe-illustrator", "figma"],
      },
    ],
  },
];

// ---------- Candidates ----------

type ProjectSeed = {
  title: string;
  description: string;
  url: string | null;
  kind: ProjectKind;
  evidenceFor: string[]; // skill slugs this project backs up (must be in the candidate's skills)
};

type CandidateSeed = {
  email: string;
  name: string;
  profile: { headline: string; bio: string; location: string; links: string[] };
  skills: string[]; // skill slugs
  projects: ProjectSeed[];
};

const CANDIDATES: CandidateSeed[] = [
  {
    email: "candidate.nusrat@example.com",
    name: "Nusrat Jahan",
    profile: {
      headline: "Aspiring frontend developer",
      bio: "Recent CSE graduate who enjoys building accessible, mobile-first web interfaces.",
      location: "Dhaka",
      links: ["https://nusrat.example.com"],
    },
    skills: ["javascript", "typescript", "react", "tailwind-css", "git"],
    projects: [
      {
        title: "Dhaka Bus Route Finder",
        description: "A React app that helps commuters find bus routes between two areas of the city.",
        url: "https://nusrat.example.com/bus-routes",
        kind: "PROJECT",
        evidenceFor: ["javascript", "react"],
      },
      {
        title: "Personal Portfolio Site",
        description: "A responsive portfolio site built with React and Tailwind CSS.",
        url: "https://nusrat.example.com",
        kind: "PORTFOLIO",
        evidenceFor: ["react", "tailwind-css"],
      },
    ],
  },
  {
    email: "candidate.tanvir@example.com",
    name: "Tanvir Hasan",
    profile: {
      headline: "Junior data analyst",
      bio: "Statistics graduate who likes turning messy spreadsheets into clear reports.",
      location: "Chattogram",
      links: ["https://tanvir.example.com"],
    },
    skills: ["sql", "excel", "python", "pandas", "power-bi", "data-analysis"],
    projects: [
      {
        title: "Retail Sales Dashboard",
        description: "A Power BI dashboard built on SQL queries over a sample retail sales dataset.",
        url: null,
        kind: "PROJECT",
        evidenceFor: ["sql", "power-bi", "data-analysis"],
      },
      {
        title: "Rainfall Data Notebook",
        description: "A Python notebook that cleans and charts public-style sample rainfall data.",
        url: "https://tanvir.example.com/rainfall",
        kind: "PORTFOLIO",
        evidenceFor: ["python", "pandas"],
      },
    ],
  },
];

// ---------- Helpers ----------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function upsertUser(email: string, name: string, role: Role, passwordHash: string) {
  return prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash },
    create: { email, name, role, passwordHash },
    select: { id: true },
  });
}

// ---------- Seed steps ----------

async function seedSkills(): Promise<Map<string, string>> {
  const skillIdBySlug = new Map<string, string>();

  for (const skill of SKILLS) {
    const saved = await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: { name: skill.name },
      create: { name: skill.name, slug: skill.slug },
      select: { id: true },
    });
    skillIdBySlug.set(skill.slug, saved.id);

    for (const rawAlias of skill.aliases) {
      const alias = rawAlias.trim().toLowerCase();
      await prisma.skillAlias.upsert({
        where: { alias },
        update: { skillId: saved.id },
        create: { alias, skillId: saved.id },
      });
    }
  }

  return skillIdBySlug;
}

function skillId(skillIdBySlug: Map<string, string>, slug: string): string {
  const id = skillIdBySlug.get(slug);
  if (!id) {
    throw new Error(`Seed data references unknown skill slug: ${slug}`);
  }
  return id;
}

async function seedAdmin() {
  const email = requireEnv("ADMIN_EMAIL").trim().toLowerCase();
  const passwordHash = await hash(requireEnv("ADMIN_PASSWORD"), BCRYPT_ROUNDS);
  await upsertUser(email, "Platform Admin", "ADMIN", passwordHash);
}

async function seedEmployers(skillIdBySlug: Map<string, string>, demoPasswordHash: string) {
  for (const employer of EMPLOYERS) {
    const user = await upsertUser(employer.email, employer.name, "EMPLOYER", demoPasswordHash);

    const organization = await prisma.organization.upsert({
      where: { ownerUserId: user.id },
      update: employer.organization,
      create: { ...employer.organization, ownerUserId: user.id },
      select: { id: true },
    });

    for (const { skills, deadlineInDays, ...job } of employer.jobs) {
      const existing = await prisma.job.findFirst({
        where: { organizationId: organization.id, title: job.title },
        select: { id: true },
      });

      const saved = existing
        ? await prisma.job.update({
            where: { id: existing.id },
            data: { ...job, status: "PUBLISHED" },
            select: { id: true },
          })
        : await prisma.job.create({
            data: {
              ...job,
              status: "PUBLISHED",
              deadline: deadlineInDays === null ? null : daysFromNow(deadlineInDays),
              organizationId: organization.id,
            },
            select: { id: true },
          });

      for (const slug of skills) {
        const id = skillId(skillIdBySlug, slug);
        await prisma.jobSkill.upsert({
          where: { jobId_skillId: { jobId: saved.id, skillId: id } },
          update: {},
          create: { jobId: saved.id, skillId: id },
        });
      }
    }
  }
}

async function seedCandidates(skillIdBySlug: Map<string, string>, demoPasswordHash: string) {
  for (const candidate of CANDIDATES) {
    const user = await upsertUser(candidate.email, candidate.name, "CANDIDATE", demoPasswordHash);

    const profile = await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      update: candidate.profile,
      create: { ...candidate.profile, userId: user.id },
      select: { id: true },
    });

    const candidateSkillIdBySlug = new Map<string, string>();
    for (const slug of candidate.skills) {
      const id = skillId(skillIdBySlug, slug);
      const saved = await prisma.candidateSkill.upsert({
        where: { candidateProfileId_skillId: { candidateProfileId: profile.id, skillId: id } },
        update: {},
        create: { candidateProfileId: profile.id, skillId: id },
        select: { id: true },
      });
      candidateSkillIdBySlug.set(slug, saved.id);
    }

    for (const { evidenceFor, ...project } of candidate.projects) {
      const existing = await prisma.project.findFirst({
        where: { candidateProfileId: profile.id, title: project.title },
        select: { id: true },
      });

      const saved = existing
        ? await prisma.project.update({
            where: { id: existing.id },
            data: project,
            select: { id: true },
          })
        : await prisma.project.create({
            data: { ...project, candidateProfileId: profile.id },
            select: { id: true },
          });

      for (const slug of evidenceFor) {
        const candidateSkillId = candidateSkillIdBySlug.get(slug);
        if (!candidateSkillId) {
          throw new Error(`Evidence references a skill the candidate does not have: ${slug}`);
        }
        await prisma.skillEvidence.upsert({
          where: { candidateSkillId_projectId: { candidateSkillId, projectId: saved.id } },
          update: {},
          create: { candidateSkillId, projectId: saved.id },
        });
      }
    }
  }
}

async function main() {
  const demoPassword = process.env.SEED_DEMO_PASSWORD || DEFAULT_DEMO_PASSWORD;
  const demoPasswordHash = await hash(demoPassword, BCRYPT_ROUNDS);

  const skillIdBySlug = await seedSkills();
  await seedAdmin();
  await seedEmployers(skillIdBySlug, demoPasswordHash);
  await seedCandidates(skillIdBySlug, demoPasswordHash);

  const [users, skills, aliases, organizations, jobs, jobSkills, profiles, candidateSkills, projects, evidence] =
    await Promise.all([
      prisma.user.count(),
      prisma.skill.count(),
      prisma.skillAlias.count(),
      prisma.organization.count(),
      prisma.job.count(),
      prisma.jobSkill.count(),
      prisma.candidateProfile.count(),
      prisma.candidateSkill.count(),
      prisma.project.count(),
      prisma.skillEvidence.count(),
    ]);

  console.log("Seed complete. Row counts:", {
    users,
    skills,
    aliases,
    organizations,
    jobs,
    jobSkills,
    profiles,
    candidateSkills,
    projects,
    evidence,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

