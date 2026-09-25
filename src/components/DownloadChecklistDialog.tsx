import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DOWNLOAD_CHECKLIST,
  isChecklistComplete,
  type ChecklistAnswer,
} from "@/utils/resumeRules";
import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DownloadChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadPdf: () => void;
  onDownloadWord: () => void;
  isGeneratingPDF: boolean;
  isGeneratingWord: boolean;
}

const emptyAnswers = (): ChecklistAnswer[] => DOWNLOAD_CHECKLIST.map(() => "");

export const DownloadChecklistDialog = ({
  open,
  onOpenChange,
  onDownloadPdf,
  onDownloadWord,
  isGeneratingPDF,
  isGeneratingWord,
}: DownloadChecklistDialogProps) => {
  const [answers, setAnswers] = useState<ChecklistAnswer[]>(emptyAnswers);

  useEffect(() => {
    if (open) setAnswers(emptyAnswers());
  }, [open]);

  const ready = isChecklistComplete(answers);
  const busy = isGeneratingPDF || isGeneratingWord;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Have you re-read these points?</DialogTitle>
          <DialogDescription className="text-gray-600">
            Mark Yes or Not Applicable for every point. Download stays disabled if any point is No or unanswered.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {DOWNLOAD_CHECKLIST.map((item, index) => (
            <div key={item} className="rounded-md border border-gray-200 p-3">
              <p className="mb-3 text-sm font-medium text-gray-900">
                {index + 1}. {item}
              </p>
              <RadioGroup
                className="flex flex-wrap gap-4"
                value={answers[index]}
                onValueChange={(value) => {
                  setAnswers((prev) => {
                    const next = [...prev];
                    next[index] = value as ChecklistAnswer;
                    return next;
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`check-${index}-yes`} />
                  <Label htmlFor={`check-${index}-yes`} className="cursor-pointer text-gray-800">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="na" id={`check-${index}-na`} />
                  <Label htmlFor={`check-${index}-na`} className="cursor-pointer text-gray-800">
                    Not Applicable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`check-${index}-no`} />
                  <Label htmlFor={`check-${index}-no`} className="cursor-pointer text-gray-800">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="flex items-center space-x-2"
            disabled={!ready || busy}
            onClick={onDownloadPdf}
          >
            {isGeneratingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{isGeneratingPDF ? "Generating..." : "Download PDF"}</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center space-x-2"
            disabled={!ready || busy}
            onClick={onDownloadWord}
          >
            {isGeneratingWord ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            <span>{isGeneratingWord ? "Generating..." : "Download Word"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
