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

  const renderModernTemplate = () => (
    <div className="bg-white p-8 min-h-[11in] text-gray-900 text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-8">
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
      </header>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
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
                  <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
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
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                )}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="space-y-1 text-gray-600">
          {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
          {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
          {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
          {resumeData.personalInfo.website && <div className="text-blue-600">{resumeData.personalInfo.website}</div>}
        </div>
      </header>

      {/* Objective/Summary */}
      {resumeData.personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Objective
          </h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
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
                  <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
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
          <p className="text-gray-700 leading-relaxed italic">
            {resumeData.personalInfo.summary}
          </p>
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
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
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
    </div>
  );

  const templates = {
    modern: renderModernTemplate,
    classic: renderClassicTemplate,
    minimal: renderMinimalTemplate,
    professional: renderModernTemplate, // Using modern as base
    creative: renderModernTemplate, // Using modern as base
    executive: renderClassicTemplate, // Using classic as base
  };

  const TemplateComponent = templates[template as keyof typeof templates] || renderModernTemplate;

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="transform scale-75 origin-top-left w-[133.33%] h-fit">
        <TemplateComponent />
      </div>
    </Card>
  );
};