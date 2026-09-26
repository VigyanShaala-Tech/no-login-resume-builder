/**
 * Build .docx from resume data (Option 2: docx package).
 * Spacing aligned to PDF (CSS rem -> twips: 0.85rem=204, 0.25rem=60, 0.5rem=120).
 * Supports: resumake-classic, resumake-classic-single, and themed builders for
 * modern, professional, minimal, classic, creative, executive.
 * Photos are omitted in Word for this pass.
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

function formatPlace(name, location) {
  return joinFilled([name, location], ", ");
}

function formatDateRange(start, end, current, separator) {
  return joinFilled([formatDate(start), current ? "Present" : formatDate(end)], separator || " - ");
}

function headingBar(text, color) {
  const lineColor = color || C.dark;
  return [
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: SZ.section, color: lineColor })],
      spacing: { before: 180, after: 0 },
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: lineColor } },
      spacing: { after: 80 },
    }),
  ];
}

function headingUpper(text) {
  return [
    new Paragraph({
      children: [new TextRun({ text: String(text).toUpperCase(), bold: true, size: SZ.section, color: C.dark })],
      spacing: { before: 180, after: 60 },
    }),
  ];
}

function itemRow(leftBold, leftRest, dateStr) {
  const children = [
    new TextRun({ text: leftBold || "", bold: true, size: SZ.body, color: C.dark }),
  ];
  if (leftRest) {
    children.push(new TextRun({ text: leftRest, size: SZ.body, color: C.dark }));
  }
  if (dateStr) {
    children.push(new TextRun({ text: "\t" + dateStr, size: SZ.body, color: C.light }));
  }
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: EDUCATION_RIGHT_TAB }],
    children,
    spacing: { after: 40 },
  });
}

function appendThemedSections(children, data, theme) {
  const heading = (text) =>
    theme.heading === "upper" ? headingUpper(text) : headingBar(text, theme.color);
  const p = data.personalInfo || {};
  const dateSep = theme.dateSep || " - ";

  if (p.summary) {
    children.push(...heading(theme.labels.summary));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: stripHtml(p.summary), size: SZ.body, color: C.med })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: SP.blockAfter },
      })
    );
  }

  if (data.experience && data.experience.length > 0) {
    children.push(...heading(theme.labels.experience));
    data.experience.forEach((exp) => {
      const dateStr = formatDateRange(exp.startDate, exp.endDate, exp.current, dateSep);
      const place = formatPlace(exp.company, exp.location);
      if (theme.experience === "position-first") {
        children.push(itemRow(exp.position, "", dateStr));
        if (place) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: place, size: SZ.body, color: C.med })],
              spacing: { after: SP.itemAfter },
            })
          );
        }
      } else {
        children.push(itemRow(place, "", dateStr));
        if (exp.position) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: exp.position, italics: true, size: SZ.body, color: C.med })],
              spacing: { after: SP.itemAfter },
            })
          );
        }
      }
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
    children.push(...heading(theme.labels.education));
    data.education.forEach((edu) => {
      const dateStr = formatDateRange(edu.startDate, edu.endDate, edu.current, dateSep);
      children.push(...educationParagraphs(edu, dateStr, false));
    });
  }

  const themeSkills = namedSkills(data.skills);
  if (themeSkills.length > 0) {
    children.push(...heading(theme.labels.skills));
    if (theme.skills === "inline") {
      const line = themeSkills.map((s) => (s.level ? `${s.name} (${s.level})` : s.name)).filter(Boolean).join(", ");
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: SZ.body, color: C.med })],
          spacing: { after: SP.blockAfter },
        })
      );
    } else {
      children.push(...skillsTable(themeSkills, false));
      children.push(new Paragraph({ text: "", spacing: { after: SP.blockAfter } }));
    }
  }

  if (data.projects && data.projects.length > 0) {
    children.push(...heading(theme.labels.projects));
    data.projects.forEach((proj) => {
      children.push(
        itemRow(proj.name, "", proj.date ? formatDate(proj.date) : "")
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
    children.push(...heading(theme.labels.achievements));
    data.achievements.forEach((a) => {
      children.push(itemRow(a.title, "", a.date ? formatDate(a.date) : ""));
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
    children.push(...heading(theme.labels.awards));
    data.awards.forEach((a) => {
      children.push(itemRow(a.title, "", a.date ? formatDate(a.date) : ""));
      if (a.issuer) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: a.issuer, italics: true, size: SZ.body, color: C.med })],
            spacing: { after: SP.itemAfter },
          })
        );
      }
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
    children.push(...heading(theme.labels.certs));
    data.certifications.forEach((c) => {
      children.push(itemRow(c.name, "", c.date ? formatDate(c.date) : ""));
      if (c.issuer) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: c.issuer, italics: true, size: SZ.body, color: C.med })],
            spacing: { after: SP.itemAfter },
          })
        );
      }
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
    children.push(...heading(theme.labels.pubs));
    data.publications.forEach((pub) => {
      children.push(itemRow(pub.title, "", pub.date ? formatDate(pub.date) : ""));
      if (pub.journal) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: pub.journal, italics: true, size: SZ.body, color: C.med })],
            spacing: { after: SP.itemAfter },
          })
        );
      }
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
}

function buildThemedResume(data, theme) {
  const children = [];
  const p = data.personalInfo || {};
  const nameAlign = theme.nameAlign === "center" ? AlignmentType.CENTER : AlignmentType.LEFT;

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: p.fullName || "Your Name",
          bold: true,
          size: theme.nameSize || 48,
          color: theme.nameColor || C.dark,
        }),
      ],
      alignment: nameAlign,
      spacing: { after: SP.nameAfter },
    })
  );

  if (theme.contact === "stacked") {
    [p.location, p.phone, p.email, p.website, p.linkedin].filter((part) => part && String(part).trim()).forEach((line) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: SZ.body, color: C.med })],
          alignment: nameAlign,
          spacing: { after: 20 },
        })
      );
    });
    children.push(new Paragraph({ text: "", spacing: { after: SP.contactAfter } }));
  } else {
    const contact =
      theme.contact === "shaded"
        ? joinFilled([p.email, p.phone, p.linkedin, p.location], " | ")
        : joinFilled([p.email, p.phone, p.location, p.website, p.linkedin], theme.contactSep || " | ");
    if (contact) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: contact, size: SZ.body, color: C.med })],
          alignment: nameAlign,
          spacing: { after: SP.contactAfter },
        })
      );
    }
  }

  appendThemedSections(children, data, theme);
  return new Document({ sections: [{ properties: {}, children }] });
}

const DEFAULT_LABELS = {
  summary: "Professional Summary",
  experience: "Professional Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  achievements: "Achievements",
  awards: "Awards",
  certs: "Courses & Certifications",
  pubs: "Publications",
};

function buildModern(data) {
  return buildThemedResume(data, {
    color: "2C4869",
    nameSize: 56,
    experience: "position-first",
    labels: DEFAULT_LABELS,
  });
}

function buildProfessional(data) {
  return buildThemedResume(data, {
    color: "374151",
    nameSize: 56,
    experience: "position-first",
    labels: { ...DEFAULT_LABELS, skills: "Core Competencies", projects: "Key Projects" },
  });
}

function buildMinimal(data) {
  return buildThemedResume(data, {
    color: "9CA3AF",
    nameSize: 44,
    skills: "inline",
    experience: "position-first",
    labels: DEFAULT_LABELS,
  });
}

function buildTraditionalClassic(data) {
  return buildThemedResume(data, {
    heading: "upper",
    nameAlign: "center",
    contact: "stacked",
    experience: "position-first",
    labels: { ...DEFAULT_LABELS, summary: "Objective" },
  });
}

function buildCreative(data) {
  return buildThemedResume(data, {
    color: "0D9488",
    nameSize: 56,
    skills: "inline",
    experience: "position-first",
    labels: { ...DEFAULT_LABELS, skills: "Skills & Expertise", projects: "Creative Projects" },
  });
}

function buildExecutive(data) {
  return buildThemedResume(data, {
    color: "111827",
    nameSize: 64,
    nameColor: "111827",
    experience: "position-first",
    labels: {
      ...DEFAULT_LABELS,
      skills: "Core Competencies",
      projects: "Strategic Initiatives",
      achievements: "Key Achievements",
    },
  });
}

async function buildDocx(resumeData, templateId) {
  const builders = {
    modern: buildModern,
    professional: buildProfessional,
    minimal: buildMinimal,
    classic: buildTraditionalClassic,
    creative: buildCreative,
    executive: buildExecutive,
    "resumake-classic": buildResumakeClassic,
    "resumake-classic-single": buildResumakeClassicSingle,
  };
  const build = builders[templateId] || buildResumakeClassic;
  const doc = build(resumeData);
  return Packer.toBuffer(doc);
}

module.exports = { buildDocx };
