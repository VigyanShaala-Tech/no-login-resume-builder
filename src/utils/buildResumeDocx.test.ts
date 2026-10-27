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

  it("puts the education date and GPA in the right column", async () => {
    const data = {
      ...resume,
      education: [{
        id: "edu-1",
        school: "Sri Chaitanya Junior College",
        location: "Hyderabad, Telangana",
        degree: "Intermediate (MPC/BiPC)",
        field: "Science",
        gpa: "9.2",
        scoreType: "gpa",
        startDate: "2020-06-01",
        endDate: "2022-03-01",
        current: false,
      }],
    };
    const { documentXml, text } = await wordParts("modern", data);
    expect(text).toContain("Intermediate (MPC/BiPC)");
    expect(text).toContain("Sri Chaitanya Junior College, Hyderabad, Telangana");
    expect(text).toContain("Science");
    expect(text).toContain("GPA: 9.2/10");
    expect(text).toContain("Jun 2020 - Mar 2022");
    expect(documentXml).toContain("<w:tbl>");
    const cells = documentXml.split("<w:tc>");
    const rightCell = cells[cells.length - 1];
    expect(rightCell).toContain("Jun 2020 - Mar 2022");
    expect(rightCell).toContain("GPA: 9.2/10");
    expect(rightCell).not.toContain("Sri Chaitanya");
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

describe("Word certification description", () => {
  const data = {
    ...resume,
    certifications: [{
      id: "cert-1",
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-04-01",
      credentialId: "AWS-SAA-8821",
      description: "<p>Covers VPC design and IAM.</p><ul><li>Cost controls</li></ul>",
    }],
  };

  it.each(["resumake-classic", "resumake-classic-single", "modern", "sidebar"])(
    "%s keeps the credential id and the description text",
    async (template) => {
      const { text } = await wordParts(template, data);
      expect(text).toContain("Credential ID: AWS-SAA-8821");
      expect(text).toContain("Covers VPC design and IAM.");
      expect(text).toContain("Cost controls");
    }
  );

  it("omits an empty description and an empty expiry", async () => {
    const empty = {
      ...resume,
      certifications: [{
        id: "cert-1",
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-04-01",
        credentialId: "AWS-SAA-8821",
        description: "<p><br></p>",
      }],
    };
    const { text } = await wordParts("resumake-classic", empty);
    expect(text).toContain("Credential ID: AWS-SAA-8821");
    expect(text).not.toContain("Covers VPC");
    expect(text).not.toContain("Expires");
  });
});

describe("Word certification expiry and publication links", () => {
  const data = {
    ...resume,
    certifications: [{
      id: "cert-1",
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-04-01",
      expiryDate: "2026-04",
      credentialId: "AWS-SAA-8821",
      description: "<p>Covers VPC design.</p>",
    }],
    publications: [{
      id: "pub-1",
      title: "Layout systems",
      journal: "Engineering Practice Review",
      date: "2024-02-01",
      authors: "Jordan Hale",
      link: "https://jordanhale.dev/layout-systems",
    }],
  };

  it.each(["resumake-classic", "resumake-classic-single", "modern", "sidebar"])(
    "%s prints Expires with the formatted date and a real publication hyperlink",
    async (template) => {
      const { text, rels, documentXml } = await wordParts(template, data);
      expect(text).toContain("Expires");
      expect(text).toContain("Apr 2026");
      expect(text).toContain("Authors: Jordan Hale");
      expect(rels).toContain("https://jordanhale.dev/layout-systems");
      expect(documentXml).toContain('w:val="single"');
      expect(text).toContain("https://jordanhale.dev/layout-systems");
    }
  );

  it.each(["resumake-classic", "resumake-classic-single", "modern", "sidebar"])(
    "%s omits Expires when expiryDate is empty and hides an empty publication link",
    async (template) => {
      const empty = {
        ...resume,
        certifications: [{
          id: "cert-1",
          name: "AWS Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023-04-01",
          expiryDate: "",
          credentialId: "AWS-SAA-8821",
        }],
        publications: [{
          id: "pub-1",
          title: "Layout systems",
          journal: "Engineering Practice Review",
          date: "2024-02-01",
          authors: "Jordan Hale",
          link: "",
        }],
      };
      const { text, rels } = await wordParts(template, empty);
      expect(text).toContain("Authors: Jordan Hale");
      expect(text).not.toContain("Expires");
      expect(rels).not.toContain("layout-systems");
    }
  );

  it("does not label a score as GPA when the type is missing", async () => {
    const unscored = {
      ...resume,
      education: [{
        id: "edu-1",
        school: "Sri Chaitanya Junior College",
        degree: "Intermediate",
        gpa: "8.6",
        startDate: "2020-06-01",
        endDate: "2022-03-01",
      }],
    };
    const { text } = await wordParts("modern", unscored);
    expect(text).not.toContain("GPA");
    expect(text).not.toContain("8.6");
  });
});
