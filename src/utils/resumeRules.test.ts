import { describe, expect, it } from "vitest";
import {
  DOWNLOAD_CHECKLIST,
  applyTitleCaseName,
  formatEducationScore,
  isChecklistComplete,
  isRichTextEmpty,
  isTitleCase,
  toTitleCase,
  validateResumeData,
  type ResumeData,
} from "./resumeRules";

function validResume(overrides: Partial<ResumeData> = {}): ResumeData {
  return {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      location: "Bengaluru",
      website: "",
      linkedin: "",
      summary: "<p>Computer science student seeking internships.</p>",
      photo: "",
      ...overrides.personalInfo,
    },
    experience: overrides.experience ?? [],
    education: overrides.education ?? [],
    skills: overrides.skills ?? [
      { id: "1", name: "Python", level: "Intermediate" },
      { id: "2", name: "Java", level: "Intermediate" },
    ],
    projects: overrides.projects ?? [],
    achievements: overrides.achievements ?? [],
    awards: overrides.awards ?? [],
    certifications: overrides.certifications ?? [],
    publications: overrides.publications ?? [],
  };
}

function education(overrides = {}) {
  return {
    id: "edu-1",
    school: "ABC Public School",
    degree: "Class 12",
    field: "Science",
    location: "Bengaluru",
    startDate: "2020-06-01",
    endDate: "2022-05-01",
    current: false,
    gpa: "8.5",
    scoreType: "gpa" as const,
    ...overrides,
  };
}

function job(overrides = {}) {
  return {
    id: "exp-1",
    company: "Acme",
    position: "Engineer",
    location: "Bengaluru",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    current: false,
    description: "<p>Built things</p>",
    experienceType: "job" as const,
    ...overrides,
  };
}

describe("toTitleCase / isTitleCase", () => {
  it("converts jane doe to Jane Doe", () => {
    expect(toTitleCase("jane doe")).toBe("Jane Doe");
    expect(isTitleCase("Jane Doe")).toBe(true);
    expect(isTitleCase("jane doe")).toBe(false);
    expect(isTitleCase("JOHN DOE")).toBe(false);
  });

  it("applyTitleCaseName updates fullName only", () => {
    const data = validResume({ personalInfo: { ...validResume().personalInfo, fullName: "jane doe" } });
    expect(applyTitleCaseName(data).personalInfo.fullName).toBe("Jane Doe");
  });
});

describe("isRichTextEmpty", () => {
  it("treats empty Quill HTML as empty", () => {
    expect(isRichTextEmpty("")).toBe(true);
    expect(isRichTextEmpty("<p><br></p>")).toBe(true);
    expect(isRichTextEmpty("<p>&nbsp;</p>")).toBe(true);
    expect(isRichTextEmpty("<p>Hello</p>")).toBe(false);
  });
});

describe("formatEducationScore", () => {
  it("shows Percentage with a % sign", () => {
    expect(formatEducationScore({ gpa: "85", scoreType: "percentage" })).toBe("Percentage: 85%");
    expect(formatEducationScore({ gpa: "85%", scoreType: "percentage" })).toBe("Percentage: 85%");
  });

  it("shows GPA out of 10", () => {
    expect(formatEducationScore({ gpa: "8.5", scoreType: "gpa" })).toBe("GPA: 8.5/10");
    expect(formatEducationScore({ gpa: "8.5/10", scoreType: "gpa" })).toBe("GPA: 8.5/10");
  });

  it("returns empty when there is no score", () => {
    expect(formatEducationScore({ gpa: "", scoreType: "gpa" })).toBe("");
  });
});

describe("isChecklistComplete", () => {
  it("is complete only when every answer is yes or na", () => {
    expect(isChecklistComplete(Array(DOWNLOAD_CHECKLIST.length).fill("yes"))).toBe(true);
    expect(isChecklistComplete(["yes", "na", "yes", "yes", "na", "na", "na"])).toBe(true);
    expect(isChecklistComplete(["yes", "yes", "yes", "yes", "yes", "yes", "no"])).toBe(false);
    expect(isChecklistComplete(["yes", "yes", "yes", "yes", "yes", "yes", ""])).toBe(false);
    expect(isChecklistComplete(["yes"])).toBe(false);
  });
});

describe("validateResumeData — personal", () => {
  it("accepts a valid resume with no education, experience, or awards", () => {
    expect(validateResumeData(validResume())).toEqual({ valid: true });
  });

  it("allows empty website and LinkedIn", () => {
    const data = validResume();
    data.personalInfo.website = "";
    data.personalInfo.linkedin = "";
    expect(validateResumeData(data).valid).toBe(true);
  });

  it("requires name, email, phone, location, and summary", () => {
    expect(validateResumeData(validResume({ personalInfo: { ...validResume().personalInfo, fullName: "" } })).message).toMatch(/name/i);
    expect(validateResumeData(validResume({ personalInfo: { ...validResume().personalInfo, email: "" } })).message).toMatch(/email/i);
    expect(validateResumeData(validResume({ personalInfo: { ...validResume().personalInfo, phone: "" } })).message).toMatch(/phone/i);
    expect(validateResumeData(validResume({ personalInfo: { ...validResume().personalInfo, location: "" } })).message).toMatch(/location/i);
    expect(validateResumeData(validResume({ personalInfo: { ...validResume().personalInfo, summary: "<p><br></p>" } })).message).toMatch(/summary/i);
  });

  it("rejects a name that is not title case", () => {
    const data = validResume({ personalInfo: { ...validResume().personalInfo, fullName: "jane doe" } });
    expect(validateResumeData(data).valid).toBe(false);
    expect(validateResumeData(data).message).toMatch(/Title Case/i);
  });
});

describe("validateResumeData — education", () => {
  it("does not require 10th or 12th when there are no education rows", () => {
    expect(validateResumeData(validResume({ education: [] })).valid).toBe(true);
  });

  it("requires a complete education row when one is added", () => {
    const incomplete = validResume({
      education: [{ ...education(), school: "" }],
    });
    expect(validateResumeData(incomplete).valid).toBe(false);
    expect(validateResumeData(incomplete).message).toMatch(/School/i);
  });

  it("rejects GPA above 10 and accepts 8.5", () => {
    expect(validateResumeData(validResume({ education: [education({ gpa: "11", scoreType: "gpa" })] })).valid).toBe(false);
    expect(validateResumeData(validResume({ education: [education({ gpa: "8.5", scoreType: "gpa" })] })).valid).toBe(true);
  });

  it("rejects percentage above 100 and accepts 85", () => {
    expect(validateResumeData(validResume({ education: [education({ gpa: "101", scoreType: "percentage" })] })).valid).toBe(false);
    expect(validateResumeData(validResume({ education: [education({ gpa: "85", scoreType: "percentage" })] })).valid).toBe(true);
  });

  it("requires score type when a score is entered, and a score when type is selected", () => {
    expect(validateResumeData(validResume({ education: [education({ gpa: "8.5", scoreType: undefined })] })).message).toMatch(/Percentage or GPA/i);
    expect(validateResumeData(validResume({ education: [education({ gpa: "", scoreType: "gpa" })] })).message).toMatch(/GPA/i);
  });
});

describe("validateResumeData — skills", () => {
  it("requires at least two named skills", () => {
    expect(validateResumeData(validResume({ skills: [] })).message).toMatch(/2 skills/i);
    expect(
      validateResumeData(validResume({ skills: [{ id: "1", name: "Python", level: "Intermediate" }] })).message
    ).toMatch(/2 skills/i);
    expect(validateResumeData(validResume()).valid).toBe(true);
  });

  it("rejects an extra empty skill box", () => {
    const data = validResume({
      skills: [
        { id: "1", name: "Python", level: "Intermediate" },
        { id: "2", name: "Java", level: "Intermediate" },
        { id: "3", name: "", level: "Intermediate" },
      ],
    });
    expect(validateResumeData(data).valid).toBe(false);
    expect(validateResumeData(data).message).toMatch(/empty box/i);
  });
});

describe("validateResumeData — experience", () => {
  it("requires internship or job when a row exists", () => {
    const data = validResume({
      experience: [{ ...job(), experienceType: undefined }],
    });
    expect(validateResumeData(data).message).toMatch(/Internship or Job/i);
  });

  it("rejects a job that overlaps education dates", () => {
    const data = validResume({
      education: [education()],
      experience: [job({ startDate: "2021-01-01", endDate: "2021-06-01", experienceType: "job" })],
    });
    expect(validateResumeData(data).valid).toBe(false);
    expect(validateResumeData(data).message).toMatch(/overlap/i);
  });

  it("allows an internship that overlaps education dates", () => {
    const data = validResume({
      education: [education()],
      experience: [job({ startDate: "2021-01-01", endDate: "2021-06-01", experienceType: "internship" })],
    });
    expect(validateResumeData(data).valid).toBe(true);
  });

  it("rejects a future start date", () => {
    const data = validResume({
      experience: [job({ startDate: "2099-01-01", endDate: "2099-06-01" })],
    });
    expect(validateResumeData(data).valid).toBe(false);
    expect(validateResumeData(data).message).toMatch(/future/i);
  });
});

describe("validateResumeData — awards", () => {
  it("passes when there are no awards", () => {
    expect(validateResumeData(validResume({ awards: [] })).valid).toBe(true);
  });

  it("requires title, issuer, date, and description when an award is added", () => {
    const missingDescription = validResume({
      awards: [{ id: "a1", title: "Best Project", issuer: "School", date: "2022-01-01", description: "<p><br></p>" }],
    });
    expect(validateResumeData(missingDescription).message).toMatch(/Description/i);

    const complete = validResume({
      awards: [{ id: "a1", title: "Best Project", issuer: "School", date: "2022-01-01", description: "<p>Won award</p>" }],
    });
    expect(validateResumeData(complete).valid).toBe(true);
  });
});
