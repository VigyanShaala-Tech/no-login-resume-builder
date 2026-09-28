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
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional layout",
    hasPhoto: true,
    preview: "Clean layout with photo in top-right"
  },
  {
    id: "classic",
    name: "Traditional",
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
    description: "Violet two-tone with section accent bars",
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
    id: "sidebar",
    name: "Sidebar",
    description: "Navy rail with a timeline",
    hasPhoto: true,
    preview: "Dark sidebar, stacked name, dotted experience"
  },
];

const TemplateThumb = ({ id }: { id: string }) => {
  const thumbs: Record<string, JSX.Element> = {
    "resumake-classic": (
      <div className="p-2 h-full">
        <div className="text-center mb-1">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-800">JOHN DOE</div>
          <div className="text-[8px] text-gray-600">Software Engineer</div>
        </div>
        <div className="space-y-1">
          <div className="text-[8px] font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 pb-0.5">EXPERIENCE</div>
          <div className="text-[8px] text-gray-600 pl-1">• Senior Developer at Tech Corp</div>
        </div>
      </div>
    ),
    "resumake-classic-single": (
      <div className="p-2 h-full">
        <div className="text-center mb-1">
          <div className="text-xs font-bold text-gray-800">JOHN DOE</div>
          <div className="text-[8px] text-gray-600">Software Engineer</div>
        </div>
        <div className="space-y-1">
          <div className="text-[8px] font-bold text-white bg-gray-600 px-1 py-0.5 rounded">EXPERIENCE</div>
          <div className="text-[8px] text-gray-600 pl-1">• Senior Developer at Tech Corp</div>
        </div>
      </div>
    ),
    modern: (
      <div className="p-2 h-full">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="text-xs font-bold text-gray-800">JOHN DOE</div>
            <div className="text-[8px] text-gray-600">jane@example.com</div>
          </div>
          <div className="w-5 h-5 rounded bg-gray-200 border border-gray-300" />
        </div>
        <div className="text-[8px] font-bold text-gray-700 border-b-2 border-[#2c4869] pb-0.5">EXPERIENCE</div>
        <div className="text-[8px] text-gray-600 pl-1 mt-0.5">Senior Developer at Tech Corp</div>
      </div>
    ),
    classic: (
      <div className="p-2 h-full text-center">
        <div className="mx-auto mb-0.5 w-4 h-4 rounded-full bg-gray-200 border border-gray-300" />
        <div className="text-xs font-bold text-gray-800">JOHN DOE</div>
        <div className="text-[8px] font-bold uppercase tracking-wide text-gray-700 border-b border-gray-300 mt-1 pb-0.5">EXPERIENCE</div>
        <div className="text-[8px] text-gray-600 mt-0.5">Senior Developer at Tech Corp</div>
      </div>
    ),
    minimal: (
      <div className="p-2 h-full">
        <div className="text-xs font-light tracking-wide text-gray-800">JOHN DOE</div>
        <div className="text-[8px] text-gray-500">jane@example.com</div>
        <div className="text-[8px] font-medium text-gray-700 border-b border-gray-200 mt-1 pb-0.5">Experience</div>
        <div className="text-[8px] text-gray-600 mt-0.5">Senior Developer at Tech Corp</div>
      </div>
    ),
    professional: (
      <div className="p-2 h-full">
        <div className="text-xs font-bold text-gray-800">JOHN DOE</div>
        <div className="text-[8px] text-gray-600">jane@example.com</div>
        <div className="mt-1 border-l-2 border-gray-400 pl-1">
          <div className="text-[8px] font-bold text-gray-700">EXPERIENCE</div>
          <div className="text-[8px] text-gray-600">Senior Developer at Tech Corp</div>
        </div>
      </div>
    ),
    creative: (
      <div className="p-2 h-full bg-white">
        <div className="bg-[#ede9fe] px-1 py-0.5 mb-0.5">
          <div className="text-xs font-extrabold tracking-tight text-[#4c1d95]">JOHN DOE</div>
        </div>
        <div className="h-0.5 bg-[#7c3aed] mb-1" />
        <div className="flex items-start gap-0.5">
          <div className="w-0.5 h-2 bg-[#7c3aed] mt-0.5 shrink-0" />
          <div>
            <div className="text-[8px] font-bold uppercase tracking-widest text-[#6d28d9]">EXPERIENCE</div>
            <div className="text-[8px] text-gray-600">Senior Developer at Tech Corp</div>
          </div>
        </div>
      </div>
    ),
    executive: (
      <div className="p-2 h-full">
        <div className="bg-gray-800 text-white rounded px-1 py-0.5 mb-1">
          <div className="text-xs font-bold">JOHN DOE</div>
        </div>
        <div className="text-[8px] font-bold text-gray-900 border-b-2 border-gray-900 pb-0.5">EXPERIENCE</div>
        <div className="text-[8px] text-gray-600 border-l-2 border-gray-900 pl-1 mt-0.5">Senior Developer at Tech Corp</div>
      </div>
    ),
    sidebar: (
      <div className="flex h-full">
        <div className="w-[32%] bg-[#1B3A4B] p-1 text-white">
          <div className="mx-auto mb-1 h-3 w-3 rounded-full border border-white" />
          <div className="text-[7px] font-bold tracking-wide">CONTACT</div>
        </div>
        <div className="flex-1 p-1">
          <div className="text-[9px] font-extrabold leading-none text-gray-800">JOHN</div>
          <div className="text-[9px] font-extrabold leading-none text-gray-800">DOE</div>
          <div className="mt-1 border-l-2 border-[#1B3A4B] pl-1 text-[7px] text-gray-600">Senior Developer</div>
        </div>
      </div>
    ),
  };

  return thumbs[id] ?? (
    <div className="h-full bg-muted rounded flex items-center justify-center">
      <span className="text-xs text-muted-foreground">Preview</span>
    </div>
  );
};

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  const isProduction = process.env.NODE_ENV === "production";

  const liveIds = [
    "resumake-classic",
    "resumake-classic-single",
    "modern",
    "classic",
    "minimal",
    "professional",
    "creative",
    "executive",
    "sidebar",
  ];

  const availableTemplates = isProduction
    ? templates.filter((template) => liveIds.includes(template.id))
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
              <div className="h-20 bg-white rounded border border-gray-200 overflow-hidden relative">
                <TemplateThumb id={template.id} />
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
