import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, User, Briefcase, GraduationCap, Star, Loader2 } from "lucide-react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { DownloadChecklistDialog } from "./DownloadChecklistDialog";
import { generatePDF, generateWord } from "@/utils/pdfGenerator";
import { storeResumeData } from "@/utils/resumeStorage";
import {
  applyTitleCaseName,
  validateResumeData,
  type ResumeData,
} from "@/utils/resumeRules";

export type { ResumeData };

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
  skills: [
    { id: "skill-1", name: "", level: "Intermediate" },
    { id: "skill-2", name: "", level: "Intermediate" },
  ],
  projects: [],
  achievements: [],
  awards: [],
  certifications: [],
  publications: [],
};

export const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("resumake-classic");
  const [activeSection, setActiveSection] = useState("personal");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
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

  const openChecklist = () => {
    const titled = applyTitleCaseName(resumeData);
    if (titled.personalInfo.fullName !== resumeData.personalInfo.fullName) {
      setResumeData(titled);
    }
    const validation = validateResumeData(titled);
    if (!validation.valid) {
      toast({
        title: "Missing Information",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }
    setChecklistOpen(true);
  };

  const handleDownload = async () => {
    const titled = applyTitleCaseName(resumeData);
    const validation = validateResumeData(titled);
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
      setChecklistOpen(false);
      
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
      setChecklistOpen(false);
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
              onClick={openChecklist} 
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
              onClick={openChecklist} 
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
      <DownloadChecklistDialog
        open={checklistOpen}
        onOpenChange={setChecklistOpen}
        onDownloadPdf={handleDownload}
        onDownloadWord={handleDownloadWord}
        isGeneratingPDF={isGeneratingPDF}
        isGeneratingWord={isGeneratingWord}
      />
    </div>
  );
};