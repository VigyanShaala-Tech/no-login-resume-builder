import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Function to slice canvas into page-sized pieces
function sliceCanvas(canvas: HTMLCanvasElement, startYPx: number, endYPx: number): HTMLCanvasElement {
  const slicedCanvas = document.createElement('canvas');
  const ctx = slicedCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  slicedCanvas.width = canvas.width;
  slicedCanvas.height = endYPx - startYPx;
  
  ctx.drawImage(canvas, 0, -startYPx, canvas.width, canvas.height);
  return slicedCanvas;
}

export const generatePDF = async (elementId: string, filename: string = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Hide preview-only elements before capturing
    const previewOnlyElements = document.querySelectorAll('.preview-only');
    const originalDisplays: string[] = [];
    
    // Store original display values and hide elements
    previewOnlyElements.forEach((el) => {
      originalDisplays.push((el as HTMLElement).style.display);
      (el as HTMLElement).style.display = 'none';
    });

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      removeContainer: true, // This helps reduce the boundary issue
      logging: false, // Disable logging for cleaner output
    });

    // Restore original display values
    previewOnlyElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalDisplays[index];
    });

    // Calculate dimensions in pixels
    const marginPx = 15 * (canvas.width / 210); // 15mm to pixels
    const contentWidthPx = canvas.width - (marginPx * 2);
    const contentHeightPx = (295 - 30) * (canvas.height / ((canvas.height * 210) / canvas.width));
    
    // Calculate pages needed
    const pagesNeeded = Math.ceil(canvas.height / contentHeightPx);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 15; // mm for PDF placement (top/bottom only)
    const imgWidth = 210; // Full A4 width (no left/right margins)
    const contentHeight = 295 - (margin * 2); // 265mm (with top/bottom margins)

    // Generate pages
    for (let page = 0; page < pagesNeeded; page++) {
      // Calculate slice coordinates in pixels
      const startYPx = page * contentHeightPx;
      const endYPx = Math.min(startYPx + contentHeightPx, canvas.height);
      
      // Create slice
      const slicedCanvas = sliceCanvas(canvas, startYPx, endYPx);
      const slicedImgData = slicedCanvas.toDataURL('image/png');
      
      // Add new page (except first page)
      if (page > 0) {
        pdf.addPage();
      }
      
      // Place slice on PDF with appropriate margins
      if (page === 0) {
        // Page 1: No top margin, no left/right margins
        pdf.addImage(slicedImgData, 'PNG', 0, 0, imgWidth, contentHeight);
      } else {
        // Page 2+: With top margin, no left/right margins
        pdf.addImage(slicedImgData, 'PNG', 0, margin, imgWidth, contentHeight);
      }
    }

    // Download the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};