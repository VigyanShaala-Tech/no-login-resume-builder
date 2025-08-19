import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Globe, Linkedin, Calendar } from "lucide-react";
import { ResumeData } from "./ResumeBuilder";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
}

export const ResumePreview = ({ resumeData, template }: ResumePreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  // Function to strip HTML tags for clean display in templates
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const renderModernTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
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
                    className="text-gray-700 mt-2 leading-relaxed"
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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700 font-medium">{edu.school}</p>
                    {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {resumeData.skills.map((skill) => (
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
                  {project.link && (
                    <span className="text-blue-600 text-sm">{project.link}</span>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Achievements
          </h2>
          <div className="space-y-4">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id}>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
            Awards
          </h2>
          <div className="space-y-4">
            {resumeData.awards.map((award) => (
              <div key={award.id}>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
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
      <header className="text-center mb-8 pb-6 border-b-2 border-gray-300">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {resumeData.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="space-y-1 text-gray-600">
            {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
            {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
            {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
            {resumeData.personalInfo.website && <div className="text-blue-600">{resumeData.personalInfo.website}</div>}
            {resumeData.personalInfo.linkedin && <div className="text-blue-600">{resumeData.personalInfo.linkedin}</div>}
          </div>
        </div>
      </header>

      {/* Objective/Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
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
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-2">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">{exp.company}, {exp.location}</span>
                    <span className="text-gray-600">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 mt-2 leading-relaxed"
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
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="font-semibold text-gray-700">{edu.school}, {edu.location}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {resumeData.skills.map((skill) => (
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
                  {project.link && (
                    <p className="text-blue-600 text-sm">{project.link}</p>
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
      <header className="mb-10">
        <h1 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-gray-600 space-y-1 text-sm">
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
        </div>
      </header>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-10">
          <div 
            className="text-gray-700 leading-relaxed italic"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <h3 className="font-medium text-gray-900 mb-1">{exp.position}</h3>
                <div className="text-gray-600 mb-3">
                  <span>{exp.company}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                </div>
                {exp.description && (
                  <div 
                    className="text-gray-700 leading-relaxed"
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
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                <div className="text-gray-600">
                  <span>{edu.school}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <span key={skill.id} className="text-gray-700">
                {skill.name}
                {skill.id !== resumeData.skills[resumeData.skills.length - 1].id && ","}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Projects
          </h2>
          <div className="space-y-8">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
                {project.link && (
                  <div className="text-blue-600 text-sm mb-2">{project.link}</div>
                )}
                {project.technologies && (
                  <div className="text-gray-600 mb-3">
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
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Achievements
          </h2>
          <div className="space-y-6">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id}>
                <div className="flex justify-between items-start mb-2">
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
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
            Awards
          </h2>
          <div className="space-y-6">
            {resumeData.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{award.title}</h3>
                    <div className="text-gray-600 text-sm">{award.issuer}</div>
                  </div>
                  <span className="text-gray-600 text-sm">{formatDate(award.date)}</span>
                </div>
                {award.description && (
                  <div 
                    className="text-gray-700 leading-relaxed mt-2"
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
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-widest">
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
      <header className="mb-8 border-b-2 border-gray-200 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
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
              <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm">
                <Linkedin className="w-4 h-4" />
                <span>{resumeData.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
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
                    className="text-gray-700 mt-2 leading-relaxed"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700 font-medium">{edu.school}</p>
                    {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {resumeData.skills.map((skill) => (
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Key Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="border-l-4 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <span className="text-blue-600 text-sm">{project.link}</span>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">
            Key Achievements
          </h2>
          <div className="space-y-4">
            {resumeData.achievements.map((achievement) => (
              <div key={achievement.id} className="border-l-4 border-gray-300 pl-4">
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
      <header className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-500">
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-green-500">
            Work Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{exp.position}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
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
                    className="text-gray-700 mt-2 leading-relaxed"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-purple-500">
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700 font-medium">{edu.school}</p>
                    {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                    {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-orange-500">
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-1 border-b-2 border-teal-500">
            Creative Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="bg-teal-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <span className="text-blue-600 text-sm">{project.link}</span>
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
      <header className="mb-8 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-lg">
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
              <div className="flex items-center gap-2 mt-2 text-gray-200 text-sm">
                <Linkedin className="w-4 h-4" />
                <span>{resumeData.personalInfo.linkedin}</span>
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
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-4 border-gray-900">
            Executive Summary
          </h2>
          <div 
            className="text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: resumeData.personalInfo.summary }}
          />
        </section>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Executive Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">{exp.position}</h3>
                    <p className="text-gray-700 font-semibold text-lg">{exp.company}</p>
                    {exp.location && <p className="text-gray-600">{exp.location}</p>}
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
                    className="text-gray-700 leading-relaxed"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Education
          </h2>
          <div className="space-y-6">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-700 font-semibold">{edu.school}</p>
                    {edu.location && <p className="text-gray-600">{edu.location}</p>}
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{skill.name}</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-4 border-gray-900">
            Strategic Initiatives
          </h2>
          <div className="space-y-6">
            {resumeData.projects.map((project) => (
              <div key={project.id} className="border-l-4 border-gray-900 pl-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                  {project.link && (
                    <span className="text-blue-600">{project.link}</span>
                  )}
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

  const templates = {
    modern: renderModernTemplate,
    classic: renderClassicTemplate,
    minimal: renderMinimalTemplate,
    professional: renderProfessionalTemplate,
    creative: renderCreativeTemplate,
    executive: renderExecutiveTemplate,
  };

  const TemplateComponent = templates[template as keyof typeof templates] || renderModernTemplate;

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="transform scale-75 origin-top-left w-[133.33%] h-fit">
        <div key={template} className="relative">
          <TemplateComponent />
          
          {/* PDF Slicing Lines - 10 pages of cut-off points */}
          
          {/* Page 1 end (265mm = content height for slicing) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '265mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '265mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 1</span>
          </div>
          
          {/* Page 2 end (530mm = 2 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '530mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '530mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 2</span>
          </div>
          
          {/* Page 3 end (795mm = 3 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '795mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '795mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 3</span>
          </div>
          
          {/* Page 4 end (1060mm = 4 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '1060mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '1060mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 4</span>
          </div>
          
          {/* Page 5 end (1325mm = 5 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '1325mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '1325mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 5</span>
          </div>
          
          {/* Page 6 end (1590mm = 6 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '1590mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '1590mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 6</span>
          </div>
          
          {/* Page 7 end (1855mm = 7 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '1855mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '1855mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 7</span>
          </div>
          
          {/* Page 8 end (2120mm = 8 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '2120mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '2120mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 8</span>
          </div>
          
          {/* Page 9 end (2385mm = 9 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '2385mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '2385mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 9</span>
          </div>
          
          {/* Page 10 end (2650mm = 10 × content height) */}
          <hr className="absolute w-full border-0 h-0.5 bg-red-400 pointer-events-none preview-only" 
              style={{ top: '2650mm', zIndex: 10 }} />
          <div className="absolute pointer-events-none preview-only" 
               style={{ top: '2650mm', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">Page 10</span>
          </div>
        </div>
      </div>
    </Card>
  );
};