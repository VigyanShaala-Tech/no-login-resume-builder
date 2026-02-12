/**
 * Build .docx from resume data (Option 2: docx package).
 * Supports: resumake-classic (heading + line), resumake-classic-single (shaded headers).
 */
const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } = require("docx");

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function sectionHeadingWithLine(text) {
  return [
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 22 })],
      spacing: { before: 240, after: 60 },
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333" } },
      spacing: { after: 120 },
    }),
  ];
}

function shadedSectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 18 })],
    shading: { fill: "F3F4F6" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    },
    spacing: { before: 200, after: 100 },
  });
}

function buildResumakeClassic(data) {
  const children = [];
  const p = data.personalInfo;

  children.push(
    new Paragraph({
      children: [new TextRun({ text: p.fullName || "Your Name", size: 32 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );
  const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);
  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join(" - "), size: 20 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  if (p.summary) {
    children.push(...sectionHeadingWithLine("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: stripHtml(p.summary), size: 22 })],
        spacing: { after: 120 },
      })
    );
  }

  if (data.experience && data.experience.length > 0) {
    children.push(...sectionHeadingWithLine("Professional Experience"));
    data.experience.forEach((exp) => {
      const dateStr = `${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.company}${exp.location ? ", " + exp.location : ""}`, bold: true }),
            new TextRun({ text: `\t${dateStr}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.position, italics: true })],
          spacing: { after: 60 },
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(exp.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.education && data.education.length > 0) {
    children.push(...sectionHeadingWithLine("Education"));
    data.education.forEach((edu) => {
      const dateStr = `${formatDate(edu.startDate)} - ${edu.current ? "Present" : formatDate(edu.endDate)}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.school}${edu.location ? ", " + edu.location : ""}`, bold: true }),
            new TextRun({ text: `\t${dateStr}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}${edu.gpa ? " • GPA: " + edu.gpa : ""}`,
              italics: true,
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });
  }

  if (data.skills && data.skills.length > 0) {
    children.push(...sectionHeadingWithLine("Skills"));
    data.skills.forEach((skill) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: skill.name, bold: true }),
            new TextRun({ text: `\t${skill.level}`, size: 18 }),
          ],
          spacing: { after: 40 },
        })
      );
    });
    children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
  }

  if (data.projects && data.projects.length > 0) {
    children.push(...sectionHeadingWithLine("Projects"));
    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
            ...(proj.date ? [new TextRun({ text: `\t${formatDate(proj.date)}` })] : []),
          ],
          spacing: { after: 40 },
        })
      );
      if (proj.technologies) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: proj.technologies, italics: true })],
            spacing: { after: 60 },
          })
        );
      }
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(proj.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.achievements && data.achievements.length > 0) {
    children.push(...sectionHeadingWithLine("Achievements"));
    data.achievements.forEach((a) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: a.title, bold: true }),
            ...(a.date ? [new TextRun({ text: `\t${formatDate(a.date)}` })] : []),
          ],
          spacing: { after: 60 },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(a.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.awards && data.awards.length > 0) {
    children.push(...sectionHeadingWithLine("Awards"));
    data.awards.forEach((a) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: a.title, bold: true }),
            new TextRun({ text: `\t${formatDate(a.date)}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: a.issuer, italics: true })],
          spacing: { after: 60 },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(a.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.certifications && data.certifications.length > 0) {
    children.push(...sectionHeadingWithLine("Certifications"));
    data.certifications.forEach((c) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: c.name, bold: true }),
            new TextRun({ text: `\t${formatDate(c.date)}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: c.issuer, italics: true })],
          spacing: { after: 60 },
        })
      );
      if (c.credentialId) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Credential ID: " + c.credentialId, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.publications && data.publications.length > 0) {
    children.push(...sectionHeadingWithLine("Publications"));
    data.publications.forEach((pub) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: pub.title, bold: true }),
            new TextRun({ text: `\t${formatDate(pub.date)}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: pub.journal, italics: true })],
          spacing: { after: 60 },
        })
      );
      if (pub.authors) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Authors: " + pub.authors, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  return new Document({
    sections: [{ properties: {}, children }],
  });
}

function buildResumakeClassicSingle(data) {
  const children = [];
  const p = data.personalInfo;

  const contactParts = [p.email, p.phone, p.linkedin, p.location].filter(Boolean);
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: p.fullName || "Your Name", bold: true, size: 28 }),
        new TextRun({ text: "\t\t\t" + (contactParts.join(" | ") || ""), size: 20 }),
      ],
      spacing: { after: 200 },
    })
  );

  if (p.summary) {
    children.push(shadedSectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: stripHtml(p.summary), size: 22 })],
        spacing: { after: 200 },
      })
    );
  }

  if (data.experience && data.experience.length > 0) {
    children.push(shadedSectionHeading("Experience"));
    data.experience.forEach((exp) => {
      const dateStr = `${formatDate(exp.startDate)} | ${exp.current ? "Present" : formatDate(exp.endDate)}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.company}${exp.location ? ", " + exp.location : ""}`, bold: true }),
            new TextRun({ text: `\t${dateStr}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.position, bold: true })],
          spacing: { after: 60 },
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(exp.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.skills && data.skills.length > 0) {
    children.push(shadedSectionHeading("Skills"));
    data.skills.forEach((skill) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: skill.name }),
            new TextRun({ text: `\t${skill.level}` }),
          ],
          spacing: { after: 40 },
        })
      );
    });
    children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
  }

  if (data.projects && data.projects.length > 0) {
    children.push(shadedSectionHeading("Projects"));
    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true }),
            ...(proj.date ? [new TextRun({ text: `\t${formatDate(proj.date)}` })] : []),
          ],
          spacing: { after: 60 },
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(proj.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
      if (proj.technologies) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Skills: " + proj.technologies, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.education && data.education.length > 0) {
    children.push(shadedSectionHeading("Education"));
    data.education.forEach((edu) => {
      const dateStr = `${formatDate(edu.startDate)} | ${edu.current ? "Present" : formatDate(edu.endDate)}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.school}${edu.location ? ", " + edu.location : ""}`, bold: true }),
            new TextRun({ text: `\t${dateStr}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree}${edu.field ? ", " + edu.field : ""}${edu.gpa ? ", GPA: " + edu.gpa : ""}`,
              italics: true,
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });
  }

  if (data.achievements && data.achievements.length > 0) {
    children.push(shadedSectionHeading("Achievements"));
    data.achievements.forEach((a) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: a.title, bold: true }),
            ...(a.date ? [new TextRun({ text: `\t${formatDate(a.date)}` })] : []),
          ],
          spacing: { after: 60 },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(a.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.awards && data.awards.length > 0) {
    children.push(shadedSectionHeading("Awards"));
    data.awards.forEach((a) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: a.title, bold: true }),
            new TextRun({ text: `\t${formatDate(a.date)}` }),
          ],
          spacing: { after: 40 },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(a.description), size: 22 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.certifications && data.certifications.length > 0) {
    children.push(shadedSectionHeading("Certifications"));
    data.certifications.forEach((c) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: c.name, bold: true }),
            new TextRun({ text: `\t${formatDate(c.date)}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: c.issuer, italics: true })],
          spacing: { after: 60 },
        })
      );
      if (c.credentialId) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Credential ID: " + c.credentialId, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  if (data.publications && data.publications.length > 0) {
    children.push(shadedSectionHeading("Publications"));
    data.publications.forEach((pub) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: pub.title, bold: true }),
            new TextRun({ text: `\t${formatDate(pub.date)}` }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: pub.journal, italics: true })],
          spacing: { after: 60 },
        })
      );
      if (pub.authors) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Authors: " + pub.authors, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    });
  }

  return new Document({
    sections: [{ properties: {}, children }],
  });
}

async function buildDocx(resumeData, templateId) {
  const doc =
    templateId === "resumake-classic-single"
      ? buildResumakeClassicSingle(resumeData)
      : buildResumakeClassic(resumeData);
  return Packer.toBuffer(doc);
}

module.exports = { buildDocx };
