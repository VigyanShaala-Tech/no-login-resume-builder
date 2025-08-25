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
    description: "Academic template with gray-shaded section headers",
    hasPhoto: false,
    preview: "Shaded headers with tabular layout"
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {templates.map((template) => (
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
              <div className="h-20 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center px-2">
                  {template.preview}
                </span>
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