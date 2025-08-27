import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  hasPhoto: boolean;
  preview: string;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional layout",
    hasPhoto: true,
    preview: "Clean layout with photo in top-right"
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional resume format",
    hasPhoto: true,
    preview: "Traditional centered layout with photo"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design",
    hasPhoto: false,
    preview: "Minimalist single-column design"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate-style layout",
    hasPhoto: false,
    preview: "Professional with clean typography"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Eye-catching design with photo",
    hasPhoto: true,
    preview: "Creative layout with colored sections"
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium layout with photo option",
    hasPhoto: true,
    preview: "Executive style with dark header"
  },
  {
    id: "resumake-classic",
    name: "Classic",
    description: "LaTeX-inspired minimalist design",
    hasPhoto: false,
    preview: "Classic typography with small caps headers"
  },
  {
    id: "resumake-classic-single",
    name: "Shaded Headers",
    description: "Academic, gray-shaded",
    hasPhoto: false,
    preview: "Shaded headers with tabular layout"
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  // Filter templates based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  const availableTemplates = isProduction 
    ? templates.filter(template => 
        template.id === "resumake-classic" || 
        template.id === "resumake-classic-single"
      )
    : templates;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {availableTemplates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-card ${
            selectedTemplate === template.id
              ? "ring-2 ring-primary shadow-elegant"
              : "hover:border-primary/50"
          }`}
          onClick={() => onTemplateSelect(template.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-muted-foreground text-sm">{template.description}</p>
              </div>
              {selectedTemplate === template.id && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {/* Visual Template Preview */}
              <div className="h-20 bg-white rounded border border-gray-200 overflow-hidden relative">
                {template.id === "resumake-classic" && (
                  <div className="p-2 h-full">
                    {/* Classic Template Preview */}
                    <div className="text-center mb-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-800">JOHN DOE</div>
                      <div className="text-[8px] text-gray-600">Software Engineer</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[8px] font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 pb-0.5">EXPERIENCE</div>
                      <div className="text-[8px] text-gray-600 pl-1">• Senior Developer at Tech Corp</div>
                    </div>
                  </div>
                )}
                
                {template.id === "resumake-classic-single" && (
                  <div className="p-2 h-full">
                    {/* Shaded Headers Template Preview */}
                    <div className="text-center mb-1">
                      <div className="text-xs font-bold text-gray-800">JOHN DOE</div>
                      <div className="text-[8px] text-gray-600">Software Engineer</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[8px] font-bold text-white bg-gray-600 px-1 py-0.5 rounded">EXPERIENCE</div>
                      <div className="text-[8px] text-gray-600 pl-1">• Senior Developer at Tech Corp</div>
                    </div>
                  </div>
                )}
                
                {/* Fallback for other templates */}
                {template.id !== "resumake-classic" && template.id !== "resumake-classic-single" && (
                  <div className="h-full bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground text-center px-2">
                      {template.preview}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant={template.hasPhoto ? "default" : "secondary"} className="text-xs">
                  {template.hasPhoto ? "With Photo" : "No Photo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};