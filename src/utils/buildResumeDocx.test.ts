import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import JSZip from "jszip";

const require = createRequire(import.meta.url);
const { buildDocx } = require("../../buildResumeDocx.cjs");

const resume = {
  personalInfo: {
    fullName: "Jordan Hale",
    email: "jordan.hale@email.com",
    phone: "555-014-8821",
    location: "Austin, TX",
    website: "jordanhale.dev",
    linkedin: "linkedin.com/in/jordanhale",
    summary: "Builds tools.",
  },
  experience: [],
  education: [],
  skills: [],
};

async function wordParts(template: string, data = resume) {
  const buffer = await buildDocx(data, template);
  const zip = await JSZip.loadAsync(buffer);
  const documentXml = await zip.file("word/document.xml")!.async("string");
  const rels = await zip.file("word/_rels/document.xml.rels")!.async("string");
  const text = [...documentXml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((match) => match[1]).join(" ");
  return { documentXml, rels, text };
}

describe("Word contact links", () => {
  it.each(["resumake-classic", "resumake-classic-single", "modern", "classic", "sidebar", "creative"])(
    "%s shows Website and LinkedIn labels and hides the address",
    async (template) => {
      const { text, rels, documentXml } = await wordParts(template);
      expect(text).toContain("Website");
      expect(text).toContain("LinkedIn");
      expect(text).not.toContain("jordanhale.dev");
      expect(text).not.toContain("linkedin.com");
      expect(rels).toContain("https://jordanhale.dev");
      expect(rels).toContain("https://linkedin.com/in/jordanhale");
      expect(documentXml).toContain('w:val="single"');
    }
  );

  it("uses blue for Classic and violet for Creative", async () => {
    const classic = await wordParts("resumake-classic");
    const creative = await wordParts("creative");
    expect(classic.documentXml).toContain('w:val="1D4ED8"');
    expect(creative.documentXml).toContain('w:val="6D28D9"');
  });

  it("uses a light link color on the Sidebar rail", async () => {
    const sidebar = await wordParts("sidebar");
    expect(sidebar.documentXml).toContain('w:val="7DD3FC"');
  });

  it("omits Website when that field is empty", async () => {
    const data = {
      ...resume,
      personalInfo: { ...resume.personalInfo, website: "", linkedin: "" },
    };
    const { text, rels } = await wordParts("modern", data);
    expect(text).not.toContain("Website");
    expect(text).not.toContain("LinkedIn");
    expect(rels).not.toContain("jordanhale.dev");
  });
});
