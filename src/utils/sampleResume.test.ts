import { describe, expect, it } from "vitest";
import { formatContactLine, validateResumeData } from "./resumeRules";
import { SAMPLE_RESUME } from "./sampleResume";

describe("SAMPLE_RESUME", () => {
  it("fills Classic and Shaded contact lines without a trailing separator", () => {
    expect(formatContactLine(SAMPLE_RESUME.personalInfo, "classic")).toBe(
      "jordan.hale@email.com - 555-014-8821 - Austin, TX - jordanhale.dev - linkedin.com/in/jordanhale"
    );
    expect(formatContactLine(SAMPLE_RESUME.personalInfo, "shaded")).toBe(
      "jordan.hale@email.com | 555-014-8821 | linkedin.com/in/jordanhale | Austin, TX"
    );
  });

  it("has named skills and a full name for layout screenshots", () => {
    expect(SAMPLE_RESUME.personalInfo.fullName).toBe("Jordan Hale");
    expect(SAMPLE_RESUME.skills.filter((skill) => skill.name.trim()).length).toBeGreaterThanOrEqual(2);
  });

  it("is not download-valid: a job overlaps education years", () => {
    const overlapping = {
      ...SAMPLE_RESUME,
      education: SAMPLE_RESUME.education.map((edu) => ({
        ...edu,
        startDate: "2015-08-01",
        endDate: "2019-05-01",
      })),
      experience: SAMPLE_RESUME.experience.map((exp) =>
        exp.id === "exp-3"
          ? { ...exp, startDate: "2017-01-01", endDate: "2019-05-01" }
          : { ...exp, startDate: "2022-03-01", endDate: exp.current ? "" : "2022-02-01" }
      ),
    };
    const result = validateResumeData(overlapping);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/overlap/i);
  });
});
