import { describe, expect, it } from "vitest";
import { createBlankResume, isResumeBlank, needsSavePrompt, resumeSnapshot, resumeTitle } from "./resumeAccount";
import type { ResumeData } from "./resumeRules";

function namedResume(): ResumeData {
  const data = createBlankResume();
  data.personalInfo.fullName = "Jane Doe";
  return data;
}

describe("resume account save prompt", () => {
  it("treats the empty form as blank", () => {
    expect(isResumeBlank(createBlankResume())).toBe(true);
    expect(needsSavePrompt(createBlankResume(), "resumake-classic", null)).toBe(false);
  });

  it("asks to save after the form changes", () => {
    const data = namedResume();
    expect(needsSavePrompt(data, "resumake-classic", null)).toBe(true);
    const saved = resumeSnapshot(data, "resumake-classic");
    expect(needsSavePrompt(data, "resumake-classic", saved)).toBe(false);
    expect(needsSavePrompt(data, "modern", saved)).toBe(true);
  });

  it("uses the name as the CV title", () => {
    expect(resumeTitle(createBlankResume())).toBe("Untitled CV");
    expect(resumeTitle(namedResume())).toBe("Jane Doe");
  });
});
