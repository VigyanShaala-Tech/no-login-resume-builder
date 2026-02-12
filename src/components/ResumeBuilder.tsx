import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, User, Briefcase, GraduationCap, Star, Loader2 } from "lucide-react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { generatePDF, generateWord } from "@/utils/pdfGenerator";
import { storeResumeData } from "@/utils/resumeStorage";

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
    current?: boolean;
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
    date?: string;
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

function validateResumeData(data: ResumeData): { valid: boolean; message?: string } {
  const p = data.personalInfo;
  if (!p.fullName?.trim()) return { valid: false, message: "Please add your name before downloading." };
  if (!p.email?.trim()) return { valid: false, message: "Please add your email address before downloading." };
  if (!p.phone?.trim()) return { valid: false, message: "Please add your phone number before downloading." };
  if (!p.location?.trim()) return { valid: false, message: "Please add your location before downloading." };
  for (let i = 0; i < data.education.length; i++) {
    const edu = data.education[i];
    if (!edu.school?.trim()) return { valid: false, message: `Education ${i + 1}: School/University is required.` };
    if (!edu.degree?.trim()) return { valid: false, message: `Education ${i + 1}: Degree is required.` };
    if (!edu.field?.trim()) return { valid: false, message: `Education ${i + 1}: Field of study is required.` };
    if (!edu.location?.trim()) return { valid: false, message: `Education ${i + 1}: Location is required.` };
    if (!edu.startDate) return { valid: false, message: `Education ${i + 1}: Start date is required.` };
    if (!edu.current && !edu.endDate) return { valid: false, message: `Education ${i + 1}: End date is required (or mark as ongoing).` };
  }
  for (let i = 0; i < data.experience.length; i++) {
    const exp = data.experience[i];
    if (!exp.company?.trim()) return { valid: false, message: `Experience ${i + 1}: Company is required.` };
    if (!exp.position?.trim()) return { valid: false, message: `Experience ${i + 1}: Position is required.` };
    if (!exp.location?.trim()) return { valid: false, message: `Experience ${i + 1}: Location is required.` };
    if (!exp.startDate) return { valid: false, message: `Experience ${i + 1}: Start date is required.` };
  }
  const certs = data.certifications ?? [];
  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (!cert.name?.trim()) return { valid: false, message: `Certification ${i + 1}: Name is required.` };
    if (!cert.issuer?.trim()) return { valid: false, message: `Certification ${i + 1}: Issuer is required.` };
    if (!cert.date) return { valid: false, message: `Certification ${i + 1}: Issue date is required.` };
  }
  return { valid: true };
}

export const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("resumake-classic");
  const [activeSection, setActiveSection] = useState("personal");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
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
    const validation = validateResumeData(resumeData);
    if (!validation.valid) {
      toast({
        title: "Missing Information",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingPDF(true);
    try {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      
      // Store resume data to Supabase
      const { error: storageError } = await storeResumeData(resumeData, selectedTemplate);
      
      if (storageError) {
        console.error('Failed to store resume data:', storageError);
        // Show error to user but don't block PDF download
        toast({
          title: "Data Storage Warning",
          description: "Resume downloaded successfully, but data storage failed. Please check your connection.",
          variant: "destructive",
        });
      } else {
        console.log('Resume data stored successfully to Supabase');
      }
      
      // Generate and download PDF
      await generatePDF('resume-preview', filename);
      
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

  const handleDownloadWord = async () => {
    const validation = validateResumeData(resumeData);
    if (!validation.valid) {
      toast({
        title: "Missing Information",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingWord(true);
    try {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.docx`;
      await generateWord(resumeData, selectedTemplate, filename);
      toast({
        title: "Download complete",
        description: "Your resume has been downloaded as a Word document.",
      });
    } catch {
      toast({
        title: "Download Failed",
        description: "There was an error generating the Word document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingWord(false);
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
            <div className="flex items-center space-x-4">
              <img 
                src="/Logo2.jpg" 
                alt="VigyanShaala" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">VigyanShaala's Free Professional CV Builder</h1>
                <p className="text-primary-foreground/80 text-sm">
                  Create professional resumes and CVs instantly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
            <Button 
              onClick={handleDownload} 
              size="sm" 
              variant="secondary"
              className="flex items-center space-x-2"
              disabled={isGeneratingPDF || isGeneratingWord}
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isGeneratingPDF ? "Generating..." : "Download PDF"}</span>
            </Button>
            <Button 
              onClick={handleDownloadWord} 
              size="sm" 
              variant="secondary"
              className="flex items-center space-x-2"
              disabled={isGeneratingPDF || isGeneratingWord}
            >
              {isGeneratingWord ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>{isGeneratingWord ? "Generating..." : "Download Word"}</span>
            </Button>
          </div>
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
              selectedTemplate={selectedTemplate}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card className="shadow-elegant bg-[#2c4869] text-white">
              <CardHeader>
                <CardTitle className="text-white">Preview</CardTitle>
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