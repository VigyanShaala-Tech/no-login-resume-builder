/**
 * Build .docx from resume data (Option 2: docx package).
 * Spacing aligned to PDF (CSS rem -> twips: 0.85rem=204, 0.25rem=60, 0.5rem=120).
 * Supports: resumake-classic (heading + line), resumake-classic-single (shaded headers).
 */
const { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType, Table, TableRow, TableCell, WidthType, TabStopType } = require("docx");

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

function joinFilled(parts, separator) {
  return parts.map((part) => (part && String(part).trim()) || "").filter(Boolean).join(separator);
}

function formatEducationScore(edu) {
  const value = edu && edu.gpa ? String(edu.gpa).trim() : "";
  if (!value) return "";
  if (edu.scoreType === "percentage") {
    const withPct = value.endsWith("%") ? value : value + "%";
    return "Percentage: " + withPct;
  }
  const stripped = value.replace(/\/\s*10$/i, "").trim();
  return "GPA: " + stripped + "/10";
}

const EDUCATION_RIGHT_TAB = 9360;

function educationParagraphs(edu, dateStr, useTimes) {
  const place = [edu.school, edu.location].filter((part) => part && String(part).trim()).join(", ");
  const field = edu.field ? String(edu.field).trim() : "";
  const score = formatEducationScore(edu);
  const run = (opts) => new TextRun(useTimes ? { ...opts, font: FONT.times } : opts);
  const tabStops = [{ type: TabStopType.RIGHT, position: EDUCATION_RIGHT_TAB }];
  const paragraphs = [
    new Paragraph({
      tabStops,
      children: [
        run({ text: edu.degree ? String(edu.degree).trim() : "", bold: true, size: SZ.body, color: C.dark }),
        ...(place ? [run({ text: (edu.degree && String(edu.degree).trim() ? ", " : "") + place, size: SZ.body, color: C.dark })] : []),
        run({ text: "\t" + dateStr, size: SZ.body, color: C.light }),
      ],
      spacing: { after: field || score ? 40 : SP.blockAfter },
    }),
  ];
  if (field || score) {
    paragraphs.push(
      new Paragraph({
        tabStops,
        children: [
          ...(field ? [run({ text: field, italics: true, size: SZ.skillLevel, color: C.med })] : []),
          ...(score ? [run({ text: "\t" + score, size: SZ.skillLevel, color: C.light })] : []),
        ],
        spacing: { after: SP.blockAfter },
      })
    );
  }
  return paragraphs;
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

function namedSkills(skills) {
  return (skills || []).filter((skill) => skill && String(skill.name || "").trim());
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
  const contactParts = joinFilled([p.email, p.phone, p.location, p.website, p.linkedin], " - ");
  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts, size: SZ.body, color: C.med })],
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
      children.push(...educationParagraphs(edu, dateStr, false));
    });
  }

  const classicSkills = namedSkills(data.skills);
  if (classicSkills.length > 0) {
    children.push(...sectionHeadingWithLine("Skills"));
    children.push(...skillsTable(classicSkills, false));
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

  const contactParts = joinFilled([p.email, p.phone, p.linkedin, p.location], " | ");
  const tr = (opts) => ({ ...opts, font: FONT.times });
  children.push(
    new Paragraph({
      children: [
        new TextRun(tr({ text: p.fullName || "Your Name", bold: true, size: SZ.nameSingle })),
        new TextRun(tr({ text: "\t\t\t" + contactParts, size: SZ.body, color: C.med })),
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

  const shadedSkills = namedSkills(data.skills);
  if (shadedSkills.length > 0) {
    children.push(shadedSectionHeading("Skills"));
    children.push(...skillsTable(shadedSkills, true));
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
      children.push(...educationParagraphs(edu, dateStr, true));
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
