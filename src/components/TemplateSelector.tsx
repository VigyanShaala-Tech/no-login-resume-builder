import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { TEMPLATE_IDS } from "@/utils/templates";

const HIDDEN_KEY = "resume-templates-hidden";

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
  const [hidden, setHidden] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    setHidden(sessionStorage.getItem(HIDDEN_KEY) === "1");
  }, []);

  const toggleHidden = () => {
    const next = !hidden;
    setHidden(next);
    sessionStorage.setItem(HIDDEN_KEY, next ? "1" : "0");
  };

  const liveIds = [...TEMPLATE_IDS];

  const availableTemplates = isProduction
    ? templates.filter((template) => liveIds.includes(template.id))
    : templates;
  const selected = availableTemplates.find((template) => template.id === selectedTemplate);

  return (
    <div>
      <div className={`flex items-center justify-between gap-3 ${hidden ? "" : "mb-3"}`}>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-semibold text-lg shrink-0">Templates</h2>
          {selected && <span className="text-sm text-muted-foreground truncate">{selected.name}</span>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={toggleHidden}>
          {hidden ? "Change template" : "Hide templates"}
        </Button>
      </div>
      {!hidden && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {availableTemplates.map((template) => {
            const selectedThis = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onTemplateSelect(template.id)}
                className="shrink-0 w-36 text-left"
              >
                <div
                  className={`h-44 bg-white rounded-md border overflow-hidden ${
                    selectedThis ? "ring-2 ring-primary" : "border-gray-200"
                  }`}
                >
                  <TemplateThumb id={template.id} />
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-sm font-medium">
                  {selectedThis && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  <span className="truncate">{template.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
