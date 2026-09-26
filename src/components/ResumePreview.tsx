import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Globe, Linkedin, Calendar } from "lucide-react";
import { ResumeData } from "./ResumeBuilder";
import { educationEntryLines, formatContactLine, formatDateRange, formatPlace, formatResumeDate } from "@/utils/resumeRules";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
}

export const ResumePreview = ({ resumeData, template }: ResumePreviewProps) => {
  const formatDate = formatResumeDate;
  const namedSkills = resumeData.skills.filter((skill) => skill.name.trim());

  const renderEducationEntry = (
    edu: ResumeData["education"][number],
    options: {
      dateSeparator: string;
      degreeClass: string;
      placeClass: string;
      fieldClass: string;
      scoreClass: string;
      dateClass: string;
      showCalendar?: boolean;
      calendarClass?: string;
    }
  ) => {
    const lines = educationEntryLines(edu);
    const dateText = formatDateRange(edu.startDate, edu.endDate, edu.current, options.dateSeparator);
    return (
      <>
        <div className="flex justify-between items-start gap-4">
          <h3 className={`min-w-0 ${options.degreeClass}`}>
            {lines.degree}
            {lines.place && (
              <span className={`font-normal ${options.placeClass}`}>
                {lines.degree ? ", " : ""}
                {lines.place}
              </span>
            )}
          </h3>
          <div className={`shrink-0 text-right ${options.dateClass}`}>
            <div className="flex items-center justify-end gap-1">
              {options.showCalendar && <Calendar className={options.calendarClass || "w-3 h-3"} />}
              <span>{dateText}</span>
            </div>
          </div>
        </div>
        {(lines.field || lines.score) && (
          <div className="flex justify-between items-start gap-4">
            <p className={`min-w-0 italic text-sm ${options.fieldClass}`}>{lines.field}</p>
            {lines.score && <span className={`shrink-0 text-sm ${options.scoreClass}`}>{lines.score}</span>}
          </div>
        )}
      </>
    );
  };

  const renderModernTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-blue-600 text-sm mt-2">
              {resumeData.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{resumeData.personalInfo.website}</span>
                </div>
              )}
              {resumeData.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
          {resumeData.personalInfo.photo && (
            <div className="ml-6">
              <img
                src={resumeData.personalInfo.photo}
                alt="Profile"
                className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
              />
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0">
          <h2 className="modern-section-header">
            Professional Summary
          </h2>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0">
          <h2 className="modern-section-header">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{formatPlace(exp.company, exp.location)}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-semibold text-gray-900",
                  placeClass: "text-gray-700",
                  fieldClass: "text-gray-600",
                  scoreClass: "text-gray-600",
                  dateClass: "text-sm text-gray-600",
                  showCalendar: true,
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {namedSkills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.date && (
                    <span className="text-blue-600 text-sm">{formatDate(project.date)}</span>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                )}
                {project.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-0">
          <h2 className="modern-section-header">
            Achievements
          </h2>
          <div className="space-y-4">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-sm text-gray-600">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: achievement.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-0">
          <h2 className="modern-section-header">
            Awards
          </h2>
          <div className="space-y-4">
            {resumeData.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-gray-700 font-medium">{award.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-0">
          <h2 className="modern-section-header">
            Courses & Certifications
          </h2>
          <div className="space-y-4">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700 font-medium">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-gray-600 text-sm">ID: {cert.credentialId}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && <div>Expires: {formatDate(cert.expiryDate)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-0">
          <h2 className="modern-section-header">
            Publications
          </h2>
          <div className="space-y-4">
            {resumeData.publications.map((pub) => (
              <div key={pub.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                    <p className="text-gray-700 font-medium">{pub.journal}</p>
                    {pub.authors && <p className="text-gray-600 text-sm">Authors: {pub.authors}</p>}
                    {pub.link && (
                      <p className="text-blue-600 text-sm">{pub.link}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(pub.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="text-center pb-2 border-b-2 border-gray-300">
        <div className="flex flex-col items-center">
          {resumeData.personalInfo.photo && (
            <div className="mb-4">
              <img
                src={resumeData.personalInfo.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {resumeData.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="space-y-0 text-gray-600">
            {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
            {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
            {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
            <div className="flex gap-4">
              {resumeData.personalInfo.website && <div className="text-blue-600">{resumeData.personalInfo.website}</div>}
              {resumeData.personalInfo.linkedin && <div className="text-blue-600">{resumeData.personalInfo.linkedin}</div>}
            </div>
          </div>
        </div>
      </header>

      {/* Objective/Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0">
          <h2 className="classic-section-header">
            Objective
          </h2>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0">
          <h2 className="classic-section-header">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{formatPlace(exp.company, exp.location)}</span>
                    <span className="text-gray-600">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-bold text-gray-900",
                  placeClass: "text-gray-700",
                  fieldClass: "text-gray-600",
                  scoreClass: "text-gray-600",
                  dateClass: "text-gray-600",
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {namedSkills.map((skill) => (
              <div key={skill.id} className="flex justify-between">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-gray-600">({skill.level})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <div className="mb-2">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.date && (
                    <p className="text-blue-600 text-sm">{formatDate(project.date)}</p>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                )}
                {project.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Achievements
          </h2>
          <div className="space-y-4">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-gray-600">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: achievement.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Awards
          </h2>
          <div className="space-y-4">
            {resumeData.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{award.title}</h3>
                    <div className="text-gray-600 text-sm">{award.issuer}</div>
                  </div>
                  <span className="text-gray-600">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Courses & Certifications
          </h2>
          <div className="space-y-4">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <div className="text-gray-600 text-sm">{cert.issuer}</div>
                    {cert.credentialId && (
                      <div className="text-gray-600 text-sm">ID: {cert.credentialId}</div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && <div>Expires: {formatDate(cert.expiryDate)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Publications
          </h2>
          <div className="space-y-4">
            {resumeData.publications.map((pub) => (
              <div key={pub.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{pub.title}</h3>
                    <div className="text-gray-600 text-sm">{pub.journal}</div>
                    {pub.authors && (
                      <div className="text-gray-600 text-sm">Authors: {pub.authors}</div>
                    )}
                    {pub.link && (
                      <div className="text-blue-600 text-sm">{pub.link}</div>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">{formatDate(pub.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-800 text-sm leading-relaxed max-w-2xl">
      {/* Header */}
      <header className="mb-1">
        <h1 className="text-2xl font-light text-gray-900 mb-1 tracking-wide">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-gray-600 space-y-0 text-sm">
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
        </div>
      </header>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0">
          <div 
            className="text-gray-700 leading-relaxed italic"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0">
          <h2 className="minimal-section-header">
            Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-gray-600 text-sm">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-gray-600 mb-3">
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 leading-relaxed mt-0.5"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-0">
          <h2 className="minimal-section-header">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-semibold text-gray-900",
                  placeClass: "text-gray-600",
                  fieldClass: "text-gray-600",
                  scoreClass: "text-gray-600",
                  dateClass: "text-sm text-gray-600",
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-0 pb-3">
          <h2 className="minimal-section-header">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {namedSkills.map((skill) => (
              <span key={skill.id} className="text-gray-700">
                {skill.name}
                {skill.id !== namedSkills[namedSkills.length - 1].id && ","}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-0">
          <h2 className="minimal-section-header">
            Projects
          </h2>
          <div className="space-y-8">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  {project.date && (
                    <span className="text-gray-600 text-sm">{formatDate(project.date)}</span>
                  )}
                </div>

                {project.technologies && (
                  <div className="text-gray-600 mb-1.5">
                    <span className="font-medium">Technologies:</span> {project.technologies}
                  </div>
                )}
                {project.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-0">
          <h2 className="minimal-section-header">
            Achievements
          </h2>
          <div className="space-y-6">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id}>
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-gray-600 text-sm">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: achievement.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-0">
          <h2 className="minimal-section-header">
            Awards
          </h2>
          <div className="space-y-6">
            {resumeData.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h3 className="font-medium text-gray-900">{award.title}</h3>
                    <div className="text-gray-600 text-sm">{award.issuer}</div>
                  </div>
                  <span className="text-gray-600 text-sm">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed mt-0.5"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-0">
          <h2 className="minimal-section-header">
            Certifications
          </h2>
          <div className="space-y-6">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{cert.name}</h3>
                    <div className="text-gray-600 text-sm">{cert.issuer}</div>
                    {cert.credentialId && (
                      <div className="text-gray-600 text-sm">ID: {cert.credentialId}</div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && <div>Expires: {formatDate(cert.expiryDate)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Publications
          </h2>
          <div className="space-y-6">
            {resumeData.publications.map((pub) => (
              <div key={pub.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{pub.title}</h3>
                    <div className="text-gray-600 text-sm">{pub.journal}</div>
                    {pub.authors && (
                      <div className="text-gray-600 text-sm">Authors: {pub.authors}</div>
                    )}
                    {pub.link && (
                      <div className="text-blue-600 text-sm">{pub.link}</div>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">{formatDate(pub.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderProfessionalTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-1 border-b-2 border-gray-200 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
              {resumeData.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-blue-600">{resumeData.personalInfo.website}</span>
                </div>
              )}
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="flex items-center gap-4 mt-2 text-blue-600 text-sm">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.linkedin}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0">
          <h2 className="professional-section-header">
            Professional Summary
          </h2>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0">
          <h2 className="professional-section-header">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{formatPlace(exp.company, exp.location)}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-0">
          <h2 className="professional-section-header">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-gray-300 pl-4">
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-semibold text-gray-900",
                  placeClass: "text-gray-700",
                  fieldClass: "text-gray-600",
                  scoreClass: "text-gray-600",
                  dateClass: "text-sm text-gray-600",
                  showCalendar: true,
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-0 pb-3">
          <h2 className="professional-section-header">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {namedSkills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-0">
          <h2 className="professional-section-header">
            Key Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.date && (
                    <span className="text-gray-600 text-sm">{formatDate(project.date)}</span>
                  )}
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-1.5">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                )}
                {project.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-0">
          <h2 className="professional-section-header">
            Key Achievements
          </h2>
          <div className="space-y-4">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-sm text-gray-600">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: achievement.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Awards & Recognition
          </h2>
          <div className="space-y-4">
            {resumeData.awards.map((award) => (
              <div key={award.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-gray-700 font-medium">{award.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Professional Certifications
          </h2>
          <div className="space-y-4">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700 font-medium">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-gray-600 text-sm">ID: {cert.credentialId}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && <div>Expires: {formatDate(cert.expiryDate)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Publications
          </h2>
          <div className="space-y-4">
            {resumeData.publications.map((pub) => (
              <div key={pub.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                    <p className="text-gray-700 font-medium">{pub.journal}</p>
                    {pub.authors && <p className="text-gray-600 text-sm">Authors: {pub.authors}</p>}
                    {pub.link && (
                      <p className="text-blue-600 text-sm">{pub.link}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(pub.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-1 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-blue-600 text-sm mt-2">
              {resumeData.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{resumeData.personalInfo.website}</span>
                </div>
              )}
              {resumeData.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
          {resumeData.personalInfo.photo && (
            <div className="ml-6">
              <img
                src={resumeData.personalInfo.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0">
          <h2 className="creative-section-header">
            About Me
          </h2>
          <div 
            className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0">
          <h2 className="creative-section-header">
            Work Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{formatPlace(exp.company, exp.location)}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 mt-0.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-0">
          <h2 className="creative-section-header">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="bg-purple-50 p-4 rounded-lg">
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-semibold text-gray-900",
                  placeClass: "text-gray-700",
                  fieldClass: "text-gray-600",
                  scoreClass: "text-gray-600",
                  dateClass: "text-sm text-gray-600",
                  showCalendar: true,
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-0 pb-3">
          <h2 className="creative-section-header">
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {namedSkills.map((skill) => (
              <span key={skill.id} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-3 pb-1 border-b-2 border-teal-500">
            Creative Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="bg-teal-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                </div>
                {project.technologies && (
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                )}
                {project.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-pink-500">
            Achievements
          </h2>
          <div className="space-y-4">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-pink-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-sm text-gray-600">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: achievement.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-yellow-500">
            Awards & Recognition
          </h2>
          <div className="space-y-4">
            {resumeData.awards.map((award) => (
              <div key={award.id} className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-gray-700 font-medium">{award.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-indigo-500">
            Certifications
          </h2>
          <div className="space-y-4">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id} className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700 font-medium">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-gray-600 text-sm">ID: {cert.credentialId}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && <div>Expires: {formatDate(cert.expiryDate)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-red-500">
            Publications
          </h2>
          <div className="space-y-4">
            {resumeData.publications.map((pub) => (
              <div key={pub.id} className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                    <p className="text-gray-700 font-medium">{pub.journal}</p>
                    {pub.authors && <p className="text-gray-600 text-sm">Authors: {pub.authors}</p>}
                    {pub.link && (
                      <p className="text-blue-600 text-sm">{pub.link}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(pub.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="grid grid-cols-2 gap-4 text-gray-200 text-sm">
              {resumeData.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
              {resumeData.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{resumeData.personalInfo.website}</span>
                </div>
              )}
            </div>
            {resumeData.personalInfo.linkedin && (
              <div className="flex items-center gap-4 mt-2 text-gray-200 text-sm">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.linkedin}</span>
                </div>
              </div>
            )}
          </div>
          {resumeData.personalInfo.photo && (
            <div className="ml-6">
              <img
                src={resumeData.personalInfo.photo}
                alt="Profile"
                className="w-36 h-36 rounded-lg object-cover border-4 border-white shadow-xl"
              />
            </div>
          )}
        </div>
      </header>

      {/* Executive Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0">
          <h2 className="executive-section-header">
            Executive Summary
          </h2>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0">
          <h2 className="executive-section-header">
            Executive Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-semibold">{formatPlace(exp.company, exp.location)}</p>
                  </div>
                  <div className="text-right text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 leading-relaxed mt-0.5"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-0">
          <h2 className="executive-section-header">
            Education
          </h2>
          <div className="space-y-6">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-gray-900 pl-6">
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-bold text-gray-900",
                  placeClass: "text-gray-700",
                  fieldClass: "text-gray-600",
                  scoreClass: "text-gray-600",
                  dateClass: "text-gray-600",
                  showCalendar: true,
                  calendarClass: "w-4 h-4",
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-0 pb-3">
          <h2 className="executive-section-header">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {namedSkills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{skill.name}</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-3 pb-2 border-b-4 border-gray-900">
            Strategic Initiatives
          </h2>
          <div className="space-y-6">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                </div>
                {project.technologies && (
                  <p className="text-gray-600 mb-3">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                )}
                {project.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Key Achievements
          </h2>
          <div className="space-y-6">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{achievement.title}</h3>
                  {achievement.date && (
                    <span className="text-gray-600">{formatDate(achievement.date)}</span>
                  )}
                </div>
                {achievement.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: achievement.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Awards & Recognition
          </h2>
          <div className="space-y-6">
            {resumeData.awards.map((award) => (
              <div key={award.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{award.title}</h3>
                    <p className="text-gray-700 font-semibold">{award.issuer}</p>
                  </div>
                  <span className="text-gray-600">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Professional Certifications
          </h2>
          <div className="space-y-6">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{cert.name}</h3>
                    <p className="text-gray-700 font-semibold">{cert.issuer}</p>
                    {cert.credentialId && <p className="text-gray-600">ID: {cert.credentialId}</p>}
                  </div>
                  <div className="text-right text-gray-600">
                    <div>{formatDate(cert.date)}</div>
                    {cert.expiryDate && <div>Expires: {formatDate(cert.expiryDate)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Publications
          </h2>
          <div className="space-y-6">
            {resumeData.publications.map((pub) => (
              <div key={pub.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{pub.title}</h3>
                    <p className="text-gray-700 font-semibold">{pub.journal}</p>
                    {pub.authors && <p className="text-gray-600">Authors: {pub.authors}</p>}
                    {pub.link && (
                      <p className="text-blue-600">{pub.link}</p>
                    )}
                  </div>
                  <span className="text-gray-600">{formatDate(pub.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Resumake Template 1: Classic Minimalist
  const renderResumakeClassicTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header - Centered with small caps name and dot-separated contact info */}
      <header className="text-center mb-2">
        <h1 className="resumake-classic-name">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="resumake-classic-contact">
          {formatContactLine(resumeData.personalInfo, "classic")}
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-0 summary-section">
          <h2 className="resumake-classic-section-header">
            Professional Summary
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div 
            className="text-gray-700 leading-tight text-justify"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-0 experience-section">
          <h2 className="resumake-classic-section-header">
            Professional Experience
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="resumake-classic-item">
                <div className="resumake-classic-item-header">
                  <div>
                    <h3 className="resumake-classic-institution">{formatPlace(exp.company, exp.location)}</h3>
                    <p className="resumake-classic-position">{exp.position}</p>
                  </div>
                  <div className="resumake-classic-date">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <div className="resumake-classic-item-content">
                    <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-0 education-section">
          <h2 className="resumake-classic-section-header">
            Education
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="resumake-classic-item">
                {renderEducationEntry(edu, {
                  dateSeparator: " - ",
                  degreeClass: "font-semibold text-[#333333]",
                  placeClass: "text-[#333333]",
                  fieldClass: "text-[#374151]",
                  scoreClass: "text-[#6b7280]",
                  dateClass: "resumake-classic-date",
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-0 skills-section">
          <h2 className="resumake-classic-section-header">
            Skills
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="resumake-classic-skills-grid ml-2">
            {namedSkills.map((skill) => (
              <div key={skill.id} className="resumake-classic-skill-item">
                <span className="resumake-classic-institution">{skill.name}</span>
                <span className="resumake-classic-skill-level">{skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-0 projects-section">
          <h2 className="resumake-classic-section-header">
            Projects
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="resumake-classic-item">
                <div className="resumake-classic-item-header">
                  <div>
                    <h3 className="resumake-classic-institution">{project.name}</h3>
                    {project.technologies && (
                      <p className="resumake-classic-position">{project.technologies}</p>
                    )}
                  </div>
                  {project.date && (
                    <div className="resumake-classic-date">{formatDate(project.date)}</div>
                  )}
                </div>
                {project.description && (
                  <div className="resumake-classic-item-content">
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-0 achievements-section">
          <h2 className="resumake-classic-section-header">
            Achievements
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id} className="resumake-classic-item">
                <div className="resumake-classic-item-header">
                  <div>
                    <h3 className="resumake-classic-institution">{achievement.title}</h3>
                  </div>
                  {achievement.date && (
                    <div className="resumake-classic-date">{formatDate(achievement.date)}</div>
                  )}
                </div>
                {achievement.description && (
                  <div className="resumake-classic-item-content">
                    <div dangerouslySetInnerHTML={{ __html: achievement.description }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-0 awards-section">
          <h2 className="resumake-classic-section-header">
            Awards
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.awards.map((award) => (
              <div key={award.id} className="resumake-classic-item">
                <div className="resumake-classic-item-header">
                  <div>
                    <h3 className="resumake-classic-institution">{award.title}</h3>
                    {award.issuer && <p className="resumake-classic-position">{award.issuer}</p>}
                  </div>
                  {award.date && (
                    <div className="resumake-classic-date">{formatDate(award.date)}</div>
                  )}
                </div>
                {award.description && (
                  <div className="resumake-classic-item-content">
                    <div dangerouslySetInnerHTML={{ __html: award.description }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-0 certifications-section">
          <h2 className="resumake-classic-section-header">
            Certifications
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id} className="resumake-classic-item">
                <div className="resumake-classic-item-header">
                  <div>
                    <h3 className="resumake-classic-institution">{cert.name}</h3>
                    {cert.issuer && <p className="resumake-classic-position">{cert.issuer}</p>}
                  </div>
                  {cert.date && (
                    <div className="resumake-classic-date">{formatDate(cert.date)}</div>
                  )}
                </div>
                {cert.credentialId && (
                  <div className="resumake-classic-item-content">
                    <p className="resumake-classic-location">Credential ID: {cert.credentialId}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-0 publications-section">
          <h2 className="resumake-classic-section-header">
            Publications
          </h2>
          <hr className="border-0 h-[1px] bg-black my-1" />
          <div className="space-y-0 ml-2">
            {resumeData.publications.map((pub) => (
              <div key={pub.id} className="resumake-classic-item">
                <div className="resumake-classic-item-header">
                  <div>
                    <h3 className="resumake-classic-institution">{pub.title}</h3>
                    {pub.journal && <p className="resumake-classic-position">{pub.journal}</p>}
                    {pub.authors && <p className="resumake-classic-location">Authors: {pub.authors}</p>}
                  </div>
                  {pub.date && (
                    <div className="resumake-classic-date">{formatDate(pub.date)}</div>
                  )}
                </div>
                {pub.link && (
                  <div className="resumake-classic-item-content">
                    <p className="text-blue-600">{pub.link}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderResumakeClassicSingleTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed academic-body academic-content">
      {/* Header */}
      <header className="mb-3">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <h1 className="text-2xl text-black leading-tight academic-name whitespace-nowrap">
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
          </div>
          <div className="text-right text-black">
            <div className="text-right">
              {formatContactLine(resumeData.personalInfo, "shaded")}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Professional Summary
          </h2>
          <div>
            <div 
              className="text-black leading-relaxed text-justify -ml-2"
              dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
            />
          </div>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Experience
          </h2>
          <div className="space-y-3 -ml-2">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="experience-item mb-3">
                <div className="flex justify-between items-start mb-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">
                      {formatPlace(exp.company, exp.location)}
                    </h3>
                    <p className="font-bold text-black mb-0 ml-1">{exp.position}</p>
                  </div>
                  <div className="text-right text-sm text-black">
                    <div>{formatDateRange(exp.startDate, exp.endDate, exp.current, " | ")}</div>
                  </div>
                </div>
                {exp.description && (
                  <div className="-mt-1">
                    <div 
                      className="text-black leading-relaxed text-justify ml-2"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {namedSkills.length > 0 && (
        <section className="mb-0 skills-section">
          <h2 className="academic-shaded-header">
            Skills
          </h2>
          <div className="resumake-classic-skills-grid ml-2">
            {namedSkills.map((skill) => (
              <div key={skill.id} className="resumake-classic-skill-item">
                <span className="resumake-classic-institution">{skill.name}</span>
                <span className="resumake-classic-skill-level">{skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Projects
          </h2>
          <div className="space-y-3 -ml-2">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="project-item mb-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{project.name}</h3>
                  </div>
                  <div className="text-right text-sm text-black">
                    {project.date && <div>{formatDate(project.date)}</div>}
                  </div>
                </div>
                {project.description && (
                  <div className="-mt-1">
                    <div 
                      className="text-black leading-relaxed text-justify ml-2"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>
                )}
                {project.technologies && (
                  <div className="mt-1 text-sm text-black">
                    <span className="font-bold">Skills:</span> {project.technologies}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-2">
          <h2 className="academic-shaded-header">
            Education
          </h2>
          <div className="space-y-0 -ml-2">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="education-item">
                {renderEducationEntry(edu, {
                  dateSeparator: " | ",
                  degreeClass: "font-semibold text-black",
                  placeClass: "text-black",
                  fieldClass: "text-black",
                  scoreClass: "text-black",
                  dateClass: "text-sm text-black",
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Achievements
          </h2>
          <div className="space-y-3 -ml-2">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item mb-3">
                <div className="flex justify-between items-start mb-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{achievement.title}</h3>
                  </div>
                  <div className="text-right text-sm text-black">
                    {achievement.date && <div>{formatDate(achievement.date)}</div>}
                  </div>
                </div>
                {achievement.description && (
                  <div className="-mt-1">
                    <div 
                      className="text-black leading-relaxed text-justify ml-2"
                      dangerouslySetInnerHTML={{ __html: achievement.description }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {resumeData.awards && resumeData.awards.length > 0 && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Awards
          </h2>
          <div className="space-y-3 -ml-2">
            {resumeData.awards.map((award) => (
              <div key={award.id} className="award-item mb-3">
                <div className="flex justify-between items-start mb-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{award.title}</h3>
                  </div>
                  <div className="text-right text-sm text-black">
                    {award.date && <div>{formatDate(award.date)}</div>}
                  </div>
                </div>
                {award.description && (
                  <div className="-mt-1">
                    <div 
                      className="text-black leading-relaxed text-justify ml-2"
                      dangerouslySetInnerHTML={{ __html: award.description }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Certifications
          </h2>
          <div className="space-y-3 -ml-2">
            {resumeData.certifications.map((cert) => (
              <div key={cert.id} className="certification-item mb-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{cert.name}</h3>
                    {cert.issuer && <p className="italic text-black">{cert.issuer}</p>}
                  </div>
                  <div className="text-right text-sm text-black">
                    {cert.date && <div>{formatDate(cert.date)}</div>}
                  </div>
                </div>
                {cert.credentialId && (
                  <div className="mt-1 text-sm text-black">
                    <span className="font-medium">Credential ID:</span> {cert.credentialId}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {resumeData.publications && resumeData.publications.length > 0 && (
        <section className="mb-4">
          <h2 className="academic-shaded-header">
            Publications
          </h2>
          <div className="space-y-1 -ml-2">
            {resumeData.publications.map((pub) => (
              <div key={pub.id} className="publication-item">
                <div className="flex justify-between items-start mb-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{pub.title}</h3>
                    {pub.journal && <p className="italic text-black">{pub.journal}</p>}
                    {pub.authors && <p className="text-sm text-black">Authors: {pub.authors}</p>}
                    {pub.link && (
                      <div className="text-sm text-blue-600 -mt-1">
                        {pub.link}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-black">
                    {pub.date && <div>{formatDate(pub.date)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const templates = {
    modern: renderModernTemplate,
    classic: renderClassicTemplate,
    minimal: renderMinimalTemplate,
    professional: renderProfessionalTemplate,
    creative: renderCreativeTemplate,
    executive: renderExecutiveTemplate,
    "resumake-classic": renderResumakeClassicTemplate,
    "resumake-classic-single": renderResumakeClassicSingleTemplate,
  };

  const TemplateComponent = templates[template as keyof typeof templates] || renderModernTemplate;

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="w-full h-fit">
        <div key={template} className="relative">
          <TemplateComponent />
          

        </div>
      </div>
    </Card>
  );
};