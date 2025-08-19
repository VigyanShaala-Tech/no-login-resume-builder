import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "./ResumeBuilder";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  activeSection: string;
}

export const ResumeForm = ({ resumeData, setResumeData, activeSection }: ResumeFormProps) => {
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: ""
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermediate"
    };
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: ""
    };
    setResumeData({
      ...resumeData,
      projects: [...(resumeData.projects || []), newProject]
    });
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      projects: (resumeData.projects || []).map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: (resumeData.projects || []).filter(project => project.id !== id)
    });
  };

  const renderPersonalInfo = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={resumeData.personalInfo.website}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
              placeholder="https://johndoe.com"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={resumeData.personalInfo.summary}
            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
            placeholder="Brief professional summary highlighting your key achievements and skills..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderExperience = () => (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experience</CardTitle>
        <Button onClick={addExperience} size="sm" className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumeData.experience.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Experience Entry</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                  placeholder="Job Title"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => updateExperience(exp.id, "current", checked as boolean)}
                />
                <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                />
              </div>
              {!exp.current && (
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
        {resumeData.experience.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEducation = () => (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <Button onClick={addEducation} size="sm" className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Education Entry</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>School/University</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                  placeholder="University Name"
                />
              </div>
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                  placeholder="Computer Science, Business, etc."
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                />
              </div>
              <div>
                <Label>GPA (Optional)</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </div>
        ))}
        {resumeData.education.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSkills = () => (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>
        <Button onClick={addSkill} size="sm" className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {resumeData.skills.map((skill) => (
          <div key={skill.id} className="flex items-center space-x-4 p-3 border rounded-lg">
            <div className="flex-1">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                placeholder="Skill name (e.g., JavaScript, Project Management)"
              />
            </div>
            <div className="w-40">
              <Select
                value={skill.level}
                onValueChange={(value) => updateSkill(skill.id, "level", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeSkill(skill.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {resumeData.skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet.</p>
            <p className="text-sm">Click "Add Skill" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProjects = () => (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <Button onClick={addProject} size="sm" className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {(resumeData.projects || []).map((project) => (
          <div key={project.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project Entry</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder="Project Name"
                />
              </div>
              <div>
                <Label>Project Link (Optional)</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateProject(project.id, "link", e.target.value)}
                  placeholder="https://github.com/user/project"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, "description", e.target.value)}
                placeholder="Describe the project, your role, and key achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
        {(resumeData.projects || []).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects added yet.</p>
            <p className="text-sm">Click "Add Project" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const sectionComponents = {
    personal: renderPersonalInfo,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
  };

  const CurrentSection = sectionComponents[activeSection as keyof typeof sectionComponents];

  return <div className="animate-fade-in">{CurrentSection()}</div>;
};