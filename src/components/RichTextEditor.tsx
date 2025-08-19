import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder = "Enter text...",
  height = "200px", // Increased default height
}: RichTextEditorProps) => {
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'link'
  ];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border rounded-md overflow-hidden">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          style={{ height }}
          className="rich-text-editor"
        />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor .ql-toolbar {
            position: sticky !important;
            top: 0 !important;
            background: white !important;
            z-index: 10 !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
          .rich-text-editor .ql-container {
            min-height: calc(${height} - 42px) !important;
          }
          .rich-text-editor .ql-editor {
            min-height: calc(${height} - 42px) !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            text-align: left !important;
            padding: 12px 15px !important;
          }
          .rich-text-editor .ql-editor p {
            text-align: left !important;
            margin-bottom: 8px !important;
          }
          .rich-text-editor .ql-editor ul, .rich-text-editor .ql-editor ol {
            text-align: left !important;
            padding-left: 20px !important;
          }
          .rich-text-editor .ql-editor li {
            text-align: left !important;
            margin-bottom: 4px !important;
          }
        `
      }} />
    </div>
  );
};