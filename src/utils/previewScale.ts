/** A4 at 96dpi. The on-screen preview is laid out at this width, then scaled. */
export const RESUME_PAPER_WIDTH_PX = 794;

/**
 * Form and preview stack below the `lg` breakpoint. At `lg` and up the preview
 * stays fluid in its column so desktop text is not shrunk to a miniature page.
 */
export const PREVIEW_STACKED_MAX_PX = 1023;

export function previewScale(availableWidth: number, paperWidth = RESUME_PAPER_WIDTH_PX): number {
  if (!Number.isFinite(availableWidth) || availableWidth <= 0) return 1;
  if (!Number.isFinite(paperWidth) || paperWidth <= 0) return 1;
  if (availableWidth >= paperWidth) return 1;
  return availableWidth / paperWidth;
}

export function shouldScalePreview(viewportWidth: number, availableWidth: number): boolean {
  if (!Number.isFinite(viewportWidth) || viewportWidth > PREVIEW_STACKED_MAX_PX) return false;
  return previewScale(availableWidth) < 1;
}

/** Layout height after `transform: scale`, so the frame does not keep the unscaled gap. */
export function scaledPreviewHeight(contentHeight: number, scale: number): number {
  if (!Number.isFinite(contentHeight) || contentHeight <= 0) return 0;
  if (!Number.isFinite(scale) || scale <= 0) return 0;
  return contentHeight * scale;
}
