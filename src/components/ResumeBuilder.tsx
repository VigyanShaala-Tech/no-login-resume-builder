import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, User, Briefcase, GraduationCap, Star, Loader2 } from "lucide-react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { generatePDF } from "@/utils/pdfGenerator";

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
    photo?: string; // Base64 encoded image or URL
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    date?: string;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  publications?: Array<{
    id: string;
    title: string;
    journal: string;
    date: string;
    authors?: string;
    link?: string;
  }>;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
    photo: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  awards: [],
  certifications: [],
  publications: [],
};

export const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [activeSection, setActiveSection] = useState("personal");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const sections = [
    { id: "personal", label: "Personal", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Star },
    { id: "projects", label: "Projects", icon: FileText },
    { id: "achievements", label: "Achievements", icon: Star },
    { id: "awards", label: "Awards", icon: Star },
    { id: "certifications", label: "Certifications", icon: FileText },
    { id: "publications", label: "Publications", icon: FileText },
  ];

  const handleDownload = async () => {
    if (!resumeData.personalInfo.fullName) {
      toast({
        title: "Missing Information",
        description: "Please add your name before downloading your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      await generatePDF('resume-preview', filename);
      toast({
        title: "Success!",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-background"
      style={{ backgroundColor: 'hsl(206 29% 29%)' }}
    >
      
      {/* Header */}
      <header className="border-b bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">CV Builder</h1>
                <p className="text-primary-foreground/80 text-sm">
                  Create professional resumes instantly
                </p>
              </div>
            </div>
            <Button 
              onClick={handleDownload} 
              size="sm" 
              variant="secondary"
              className="flex items-center space-x-2"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isGeneratingPDF ? "Generating..." : "Download PDF"}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Template Selector */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Choose Template</span>
              <Badge variant="secondary">{selectedTemplate}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </CardContent>
        </Card>

        {/* Main Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Section Navigation */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant="default"
                        size="sm"
                        onClick={() => setActiveSection(section.id)}
                        className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{section.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <ResumeForm 
              resumeData={resumeData}
              setResumeData={setResumeData}
              activeSection={activeSection}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div id="resume-preview">
                  <ResumePreview 
                    resumeData={resumeData}
                    template={selectedTemplate}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};