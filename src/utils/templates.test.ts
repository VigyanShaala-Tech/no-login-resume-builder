import { describe, expect, it } from "vitest";
import {
  PHOTO_TEMPLATE_IDS,
  TEMPLATE_IDS,
  isTemplateId,
  templateSupportsPhoto,
} from "./templates";

describe("TEMPLATE_IDS", () => {
  it("lists every live template once, including Sidebar", () => {
    expect([...TEMPLATE_IDS]).toEqual([
      "resumake-classic",
      "resumake-classic-single",
      "modern",
      "classic",
      "minimal",
      "professional",
      "creative",
      "executive",
      "sidebar",
    ]);
    expect(new Set(TEMPLATE_IDS).size).toBe(TEMPLATE_IDS.length);
  });

  it("accepts only known template query values", () => {
    expect(isTemplateId("sidebar")).toBe(true);
    expect(isTemplateId("resumake-classic")).toBe(true);
    expect(isTemplateId("unknown")).toBe(false);
    expect(isTemplateId("")).toBe(false);
  });

  it("treats photo templates as a subset of live templates", () => {
    expect([...PHOTO_TEMPLATE_IDS]).toEqual(["modern", "classic", "creative", "executive", "sidebar"]);
    for (const id of PHOTO_TEMPLATE_IDS) {
      expect(isTemplateId(id)).toBe(true);
      expect(templateSupportsPhoto(id)).toBe(true);
    }
    expect(templateSupportsPhoto("resumake-classic")).toBe(false);
    expect(templateSupportsPhoto("minimal")).toBe(false);
  });
});
