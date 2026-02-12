/**
 * Build .docx from resume data (Option 2: docx package).
 * Spacing aligned to PDF (CSS rem -> twips: 0.85rem=204, 0.25rem=60, 0.5rem=120).
 * Supports: resumake-classic (heading + line), resumake-classic-single (shaded headers).
 */
const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType, Table, TableRow, TableCell, WidthType } = require("docx");

// PDF-aligned spacing (twips). 1pt=20 twips; 0.85rem~10pt=200, 0.25rem~3pt=60, 0.5rem~6pt=120
const SP = {
  sectionBefore: 204,   // .resumake-classic-section-header margin-top 0.85rem
  headingAfter: 0,     // margin-bottom 0.025rem ~ 0
  lineAfter: 60,       // ::after line margin-top 0.25rem
  nameAfter: 80,       // name margin-bottom 0.25rem
  contactAfter: 120,   // contact margin-bottom 0.5rem
  itemAfter: 60,       // between title/position lines
  blockAfter: 120,     // after description block (0.5rem)
  shadedBefore: 204,
  shadedAfter: 100,    // academic-shaded-header margin-bottom 0.5rem
};

// PDF font sizes (docx half-points): 2.5rem~30pt=60, 1.125rem~13.5pt=27, 0.875rem~10.5pt=21, 0.75rem=9pt=18, 1rem~12pt=24
const SZ = { nameClassic: 60, section: 27, body: 21, skillLevel: 18, nameSingle: 24 };
const C = { dark: "333333", med: "374151", light: "6b7280" };  // PDF #333, #374151, #6b7280
const FONT = { georgia: "Georgia", times: "Times New Roman" };

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
      children: [new TextRun({ text, bold: true, size: SZ.section, color: C.dark })],
      spacing: { before: SP.sectionBefore, after: SP.headingAfter },
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.dark } },
      spacing: { after: SP.lineAfter },
    }),
  ];
}

function shadedSectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: SZ.body, font: FONT.times })],
    shading: { fill: "F3F4F6" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    },
    spacing: { before: SP.shadedBefore, after: SP.shadedAfter },
  });
}

// PDF: .resumake-classic-skill-item = name (bold #333) + level (0.75rem #6b7280)
function skillsTable(skills, useTimesFont) {
  if (!skills || skills.length === 0) return [];
  const half = Math.ceil(skills.length / 2);
  const left = skills.slice(0, half);
  const right = skills.slice(half);
  const maxRows = Math.max(left.length, right.length);
  const rowSpacing = { after: 40 };
  const nameRun = (s) => new TextRun({ text: s.name, bold: true, size: SZ.body, color: C.dark, font: useTimesFont ? FONT.times : undefined });
  const levelRun = (s) => new TextRun({ text: s.level || "", size: SZ.skillLevel, color: C.light, font: useTimesFont ? FONT.times : undefined });
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    const l = left[i];
    const r = right[i];
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: l ? [nameRun(l), new TextRun({ text: "\t" }), levelRun(l)] : [new TextRun({ text: "" })],
                spacing: rowSpacing,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: r ? [nameRun(r), new TextRun({ text: "\t" }), levelRun(r)] : [new TextRun({ text: "" })],
                spacing: rowSpacing,
              }),
            ],
          }),
        ],
      })
    );
  }
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
      rows,
    }),
  ];
}

function buildResumakeClassic(data) {
  const children = [];
  const p = data.personalInfo;

  children.push(
    new Paragraph({
      children: [new TextRun({ text: p.fullName || "Your Name", size: SZ.nameClassic, font: FONT.georgia, color: C.dark })],
      alignment: AlignmentType.CENTER,
      spacing: { after: SP.nameAfter },
    })
  );
  const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);
  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join(" - "), size: SZ.body, color: C.med })],
        alignment: AlignmentType.CENTER,
        spacing: { after: SP.contactAfter },
      })
    );
  }

  if (p.summary) {
    children.push(...sectionHeadingWithLine("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: stripHtml(p.summary), size: SZ.body, color: C.med })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: SP.blockAfter },
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
            new TextRun({ text: `${exp.company}${exp.location ? ", " + exp.location : ""}`, bold: true, size: SZ.body, color: C.dark }),
            new TextRun({ text: `\t${dateStr}`, size: SZ.body, color: C.light }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.position, italics: true, size: SZ.body, color: C.med })],
          spacing: { after: SP.itemAfter },
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(exp.description), size: SZ.body, color: C.med })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
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
            new TextRun({ text: `${edu.school}${edu.location ? ", " + edu.location : ""}`, bold: true, size: SZ.body, color: C.dark }),
            new TextRun({ text: `\t${dateStr}`, size: SZ.body, color: C.light }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}${edu.gpa ? " • GPA: " + edu.gpa : ""}`,
              italics: true,
              size: SZ.body,
              color: C.med,
            }),
          ],
          spacing: { after: SP.blockAfter },
        })
      );
    });
  }

  if (data.skills && data.skills.length > 0) {
    children.push(...sectionHeadingWithLine("Skills"));
    children.push(...skillsTable(data.skills, false));
    children.push(new Paragraph({ text: "", spacing: { after: SP.blockAfter } }));
  }

  if (data.projects && data.projects.length > 0) {
    children.push(...sectionHeadingWithLine("Projects"));
    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: SZ.body, color: C.dark }),
            ...(proj.date ? [new TextRun({ text: `\t${formatDate(proj.date)}`, size: SZ.body, color: C.light })] : []),
          ],
          spacing: { after: 40 },
        })
      );
      if (proj.technologies) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: proj.technologies, italics: true, size: SZ.body, color: C.med })],
            spacing: { after: SP.itemAfter },
          })
        );
      }
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(proj.description), size: SZ.body, color: C.med })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
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
            new TextRun({ text: a.title, bold: true, size: SZ.body, color: C.dark }),
            ...(a.date ? [new TextRun({ text: `\t${formatDate(a.date)}`, size: SZ.body, color: C.light })] : []),
          ],
          spacing: { after: SP.itemAfter },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(a.description), size: SZ.body, color: C.med })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
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
            new TextRun({ text: a.title, bold: true, size: SZ.body, color: C.dark }),
            new TextRun({ text: `\t${formatDate(a.date)}`, size: SZ.body, color: C.light }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: a.issuer, italics: true, size: SZ.body, color: C.med })],
          spacing: { after: SP.itemAfter },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(a.description), size: SZ.body, color: C.med })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
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
            new TextRun({ text: c.name, bold: true, size: SZ.body, color: C.dark }),
            new TextRun({ text: `\t${formatDate(c.date)}`, size: SZ.body, color: C.light }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: c.issuer, italics: true, size: SZ.body, color: C.med })],
          spacing: { after: SP.itemAfter },
        })
      );
      if (c.credentialId) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Credential ID: " + c.credentialId, size: SZ.body, color: C.light })],
            spacing: { after: SP.blockAfter },
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
            new TextRun({ text: pub.title, bold: true, size: SZ.body, color: C.dark }),
            new TextRun({ text: `\t${formatDate(pub.date)}`, size: SZ.body, color: C.light }),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: pub.journal, italics: true, size: SZ.body, color: C.med })],
          spacing: { after: SP.itemAfter },
        })
      );
      if (pub.authors) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Authors: " + pub.authors, size: SZ.body, color: C.light })],
            spacing: { after: SP.blockAfter },
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
  const tr = (opts) => ({ ...opts, font: FONT.times });
  children.push(
    new Paragraph({
      children: [
        new TextRun(tr({ text: p.fullName || "Your Name", bold: true, size: SZ.nameSingle })),
        new TextRun(tr({ text: "\t\t\t" + (contactParts.join(" | ") || ""), size: SZ.body, color: C.med })),
      ],
      spacing: { after: SP.contactAfter },
    })
  );

  if (p.summary) {
    children.push(shadedSectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun(tr({ text: stripHtml(p.summary), size: SZ.body }))],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: SP.blockAfter },
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
            new TextRun(tr({ text: `${exp.company}${exp.location ? ", " + exp.location : ""}`, bold: true, size: SZ.body })),
            new TextRun(tr({ text: `\t${dateStr}`, size: SZ.body, color: C.light })),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun(tr({ text: exp.position, bold: true, size: SZ.body }))],
          spacing: { after: SP.itemAfter },
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: stripHtml(exp.description), size: SZ.body }))],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
          })
        );
      }
    });
  }

  if (data.skills && data.skills.length > 0) {
    children.push(shadedSectionHeading("Skills"));
    children.push(...skillsTable(data.skills, true));
    children.push(new Paragraph({ text: "", spacing: { after: SP.blockAfter } }));
  }

  if (data.projects && data.projects.length > 0) {
    children.push(shadedSectionHeading("Projects"));
    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun(tr({ text: proj.name, bold: true, size: SZ.body })),
            ...(proj.date ? [new TextRun(tr({ text: `\t${formatDate(proj.date)}`, size: SZ.body, color: C.light }))] : []),
          ],
          spacing: { after: SP.itemAfter },
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: stripHtml(proj.description), size: SZ.body }))],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
          })
        );
      }
      if (proj.technologies) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: "Skills: " + proj.technologies, size: SZ.body }))],
            spacing: { after: SP.blockAfter },
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
            new TextRun(tr({ text: `${edu.school}${edu.location ? ", " + edu.location : ""}`, bold: true, size: SZ.body })),
            new TextRun(tr({ text: `\t${dateStr}`, size: SZ.body, color: C.light })),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun(tr({
              text: `${edu.degree}${edu.field ? ", " + edu.field : ""}${edu.gpa ? ", GPA: " + edu.gpa : ""}`,
              italics: true,
              size: SZ.body,
            })),
          ],
          spacing: { after: SP.blockAfter },
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
            new TextRun(tr({ text: a.title, bold: true, size: SZ.body })),
            ...(a.date ? [new TextRun(tr({ text: `\t${formatDate(a.date)}`, size: SZ.body, color: C.light }))] : []),
          ],
          spacing: { after: SP.itemAfter },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: stripHtml(a.description), size: SZ.body }))],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
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
            new TextRun(tr({ text: a.title, bold: true, size: SZ.body })),
            new TextRun(tr({ text: `\t${formatDate(a.date)}`, size: SZ.body, color: C.light })),
          ],
          spacing: { after: 40 },
        })
      );
      if (a.description) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: stripHtml(a.description), size: SZ.body }))],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: SP.blockAfter },
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
            new TextRun(tr({ text: c.name, bold: true, size: SZ.body })),
            new TextRun(tr({ text: `\t${formatDate(c.date)}`, size: SZ.body, color: C.light })),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun(tr({ text: c.issuer, italics: true, size: SZ.body }))],
          spacing: { after: SP.itemAfter },
        })
      );
      if (c.credentialId) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: "Credential ID: " + c.credentialId, size: SZ.body, color: C.light }))],
            spacing: { after: SP.blockAfter },
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
            new TextRun(tr({ text: pub.title, bold: true, size: SZ.body })),
            new TextRun(tr({ text: `\t${formatDate(pub.date)}`, size: SZ.body, color: C.light })),
          ],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun(tr({ text: pub.journal, italics: true, size: SZ.body }))],
          spacing: { after: SP.itemAfter },
        })
      );
      if (pub.authors) {
        children.push(
          new Paragraph({
            children: [new TextRun(tr({ text: "Authors: " + pub.authors, size: SZ.body, color: C.light }))],
            spacing: { after: SP.blockAfter },
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
