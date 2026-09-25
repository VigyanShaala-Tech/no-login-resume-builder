export type ScoreType = "percentage" | "gpa";
export type ExperienceType = "internship" | "job";
export type ChecklistAnswer = "yes" | "na" | "no" | "";

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
    photo?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    experienceType?: ExperienceType;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    gpa?: string;
    scoreType?: ScoreType;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    date?: string;
  }>;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    date?: string;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  publications?: Array<{
    id: string;
    title: string;
    journal: string;
    date: string;
    authors?: string;
    link?: string;
  }>;
}

export const DOWNLOAD_CHECKLIST = [
  "Have you filled Full Name (Title Case), Email, Phone, Location, and Professional Summary?",
  "If you are pursuing a Bachelor's Degree, have you added your 10th and 12th Education Details?",
  "For every Education row, have you chosen Percentage or GPA (out of 10) and entered the score correctly?",
  "Have you added at least 2 skills, one skill per box, with proficiency marked?",
  "If you added Job experience, do the dates not overlap with your education years? (NA if internship only or no experience)",
  "Have you avoided any future dates in Experience? (NA if no experience)",
  "If you added Awards, have you filled Title, Issuer, Date, and Description? (NA if no awards)",
] as const;

export function toTitleCase(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
        .join("-")
    )
    .join(" ");
}

export function isTitleCase(name: string): boolean {
  const normalized = name.trim().replace(/\s+/g, " ");
  return normalized.length > 0 && toTitleCase(normalized) === normalized;
}

export function isRichTextEmpty(html: string | undefined): boolean {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim() === "";
}

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatEducationScore(edu: { gpa?: string; scoreType?: ScoreType }): string {
  const value = edu.gpa?.trim();
  if (!value) return "";
  if (edu.scoreType === "percentage") {
    const withPct = value.endsWith("%") ? value : `${value}%`;
    return `Percentage: ${withPct}`;
  }
  const stripped = value.replace(/\/\s*10$/i, "").trim();
  return `GPA: ${stripped}/10`;
}

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isFutureDate(value: string): boolean {
  const d = parseIsoDate(value);
  if (!d) return false;
  return value > todayIsoDate();
}

function dateRange(start: string, end: string, current?: boolean): { start: Date; end: Date } | null {
  const s = parseIsoDate(start);
  if (!s) return null;
  const e = current || !end ? parseIsoDate(todayIsoDate()) : parseIsoDate(end);
  if (!e) return null;
  return { start: s, end: e };
}

function rangesOverlap(a: { start: Date; end: Date }, b: { start: Date; end: Date }): boolean {
  return a.start.getTime() <= b.end.getTime() && b.start.getTime() <= a.end.getTime();
}

function parseScoreNumber(raw: string): number | null {
  const cleaned = raw.replace(/%/g, "").replace(/\/\s*10$/i, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function applyTitleCaseName(data: ResumeData): ResumeData {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      fullName: toTitleCase(data.personalInfo.fullName),
    },
  };
}

export function isChecklistComplete(answers: ChecklistAnswer[]): boolean {
  return (
    answers.length === DOWNLOAD_CHECKLIST.length &&
    answers.every((answer) => answer === "yes" || answer === "na")
  );
}

export function validateResumeData(data: ResumeData): { valid: boolean; message?: string } {
  const p = data.personalInfo;
  if (!p.fullName?.trim()) return { valid: false, message: "Please add your name before downloading." };
  if (!isTitleCase(p.fullName)) {
    return { valid: false, message: "Full Name must be in Title Case (e.g. John Doe)." };
  }
  if (!p.email?.trim()) return { valid: false, message: "Please add your email address before downloading." };
  if (!p.phone?.trim()) return { valid: false, message: "Please add your phone number before downloading." };
  if (!p.location?.trim()) return { valid: false, message: "Please add your location before downloading." };
  if (isRichTextEmpty(p.summary)) {
    return { valid: false, message: "Please add your Professional Summary before downloading." };
  }

  for (let i = 0; i < data.education.length; i++) {
    const edu = data.education[i];
    const n = i + 1;
    if (!edu.school?.trim()) return { valid: false, message: `Education ${n}: School/University is required.` };
    if (!edu.degree?.trim()) return { valid: false, message: `Education ${n}: Degree is required.` };
    if (!edu.field?.trim()) return { valid: false, message: `Education ${n}: Field of study is required.` };
    if (!edu.location?.trim()) return { valid: false, message: `Education ${n}: Location is required.` };
    if (!edu.startDate) return { valid: false, message: `Education ${n}: Start date is required.` };
    if (!edu.current && !edu.endDate) {
      return { valid: false, message: `Education ${n}: End date is required (or mark as ongoing).` };
    }
    const score = edu.gpa?.trim() || "";
    if (score && !edu.scoreType) {
      return { valid: false, message: `Education ${n}: Select Percentage or GPA (out of 10).` };
    }
    if (edu.scoreType && !score) {
      return { valid: false, message: `Education ${n}: Enter your ${edu.scoreType === "percentage" ? "percentage" : "GPA (out of 10)"}.` };
    }
    if (score) {
      const num = parseScoreNumber(score);
      if (num === null) return { valid: false, message: `Education ${n}: Score must be a number.` };
      if (edu.scoreType === "gpa" && (num <= 0 || num > 10)) {
        return { valid: false, message: `Education ${n}: GPA must be a number greater than 0 and at most 10.` };
      }
      if (edu.scoreType === "percentage" && (num < 0 || num > 100)) {
        return { valid: false, message: `Education ${n}: Percentage must be between 0 and 100.` };
      }
    }
  }

  const namedSkills = data.skills.filter((skill) => skill.name?.trim());
  if (namedSkills.length < 2) {
    return { valid: false, message: "Please add at least 2 skills (one skill per box) before downloading." };
  }
  for (let i = 0; i < data.skills.length; i++) {
    const skill = data.skills[i];
    if (!skill.name?.trim() && data.skills.length > 0 && namedSkills.length < data.skills.length) {
      return { valid: false, message: `Skill ${i + 1}: Enter a skill name, or remove the empty box.` };
    }
  }

  for (let i = 0; i < data.experience.length; i++) {
    const exp = data.experience[i];
    const n = i + 1;
    if (!exp.experienceType) {
      return { valid: false, message: `Experience ${n}: Choose Internship or Job.` };
    }
    if (!exp.company?.trim()) return { valid: false, message: `Experience ${n}: Company is required.` };
    if (!exp.position?.trim()) return { valid: false, message: `Experience ${n}: Position is required.` };
    if (!exp.location?.trim()) return { valid: false, message: `Experience ${n}: Location is required.` };
    if (!exp.startDate) return { valid: false, message: `Experience ${n}: Start date is required.` };
    if (!exp.current && !exp.endDate) {
      return { valid: false, message: `Experience ${n}: End date is required (or mark as currently working).` };
    }
    if (isFutureDate(exp.startDate)) {
      return { valid: false, message: `Experience ${n}: Start date cannot be in the future.` };
    }
    if (exp.endDate && isFutureDate(exp.endDate)) {
      return { valid: false, message: `Experience ${n}: End date cannot be in the future.` };
    }
    if (exp.experienceType === "job") {
      const jobRange = dateRange(exp.startDate, exp.endDate, exp.current);
      if (jobRange) {
        for (let j = 0; j < data.education.length; j++) {
          const edu = data.education[j];
          const eduRange = dateRange(edu.startDate, edu.endDate, edu.current);
          if (eduRange && rangesOverlap(jobRange, eduRange)) {
            return {
              valid: false,
              message: `Experience ${n}: Job dates overlap with Education ${j + 1}. Use Internship if this was during studies, or correct the dates.`,
            };
          }
        }
      }
    }
  }

  const awards = data.awards ?? [];
  for (let i = 0; i < awards.length; i++) {
    const award = awards[i];
    const n = i + 1;
    if (!award.title?.trim()) return { valid: false, message: `Award ${n}: Title is required.` };
    if (!award.issuer?.trim()) return { valid: false, message: `Award ${n}: Issuer is required.` };
    if (!award.date) return { valid: false, message: `Award ${n}: Date is required.` };
    if (isRichTextEmpty(award.description)) {
      return { valid: false, message: `Award ${n}: Description is required.` };
    }
  }

  const certs = data.certifications ?? [];
  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (!cert.name?.trim()) return { valid: false, message: `Certification ${i + 1}: Name is required.` };
    if (!cert.issuer?.trim()) return { valid: false, message: `Certification ${i + 1}: Issuer is required.` };
    if (!cert.date) return { valid: false, message: `Certification ${i + 1}: Issue date is required.` };
  }

  return { valid: true };
}
