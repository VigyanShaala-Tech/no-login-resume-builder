// import jsPDF from 'jspdf'; // Commented out - backup
// import html2canvas from 'html2canvas'; // Commented out - backup



// Function to slice canvas into page-sized pieces
// function sliceCanvas(canvas: HTMLCanvasElement, startYPx: number, endYPx: number): HTMLCanvasElement {
//   const slicedCanvas = document.createElement('canvas');
//   const ctx = slicedCanvas.getContext('2d');
//   
//   if (!ctx) {
//     throw new Error('Could not get canvas context');
//   }
//   
//   slicedCanvas.width = canvas.width;
//   slicedCanvas.height = endYPx - startYPx;
//   
//   ctx.drawImage(canvas, 0, -startYPx, canvas.width, canvas.height);
//   return slicedCanvas;
// }

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
    // const canvas = await html2canvas(element, {
    //   scale: 3.5, // Higher resolution for better quality
    //   useCORS: true,
    //   allowTaint: false,
    //   backgroundColor: '#ffffff',
    //   removeContainer: true, // This helps reduce the boundary issue
    //   logging: false, // Disable logging for cleaner output
    //   imageTimeout: 10000, // Longer timeout for images
    // });

        // Restore original display values
    previewOnlyElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalDisplays[index];
    });

    // NEW: Puppeteer API call
    try {
      // Get the HTML content with CSS
      const getAllCSS = () => {
        const styles = Array.from(document.styleSheets);
        let cssText = '';
        
        styles.forEach(styleSheet => {
          try {
            const rules = Array.from(styleSheet.cssRules || styleSheet.rules);
            rules.forEach(rule => {
              cssText += rule.cssText + '\n';
            });
          } catch (e) {
            // Skip external stylesheets that might cause CORS issues
          }
        });
        
        return cssText;
      };

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume</title>
          <style>
            /* Include all our CSS */
            ${getAllCSS()}
            /* Add Tailwind CSS */
            @import url('https://cdn.tailwindcss.com');
            
            /* PDF-specific styles for proper background */
            body {
              background-color: white !important;
              padding: 0 !important;
              min-height: 100vh !important;
            }
            
            #resume-preview {
              background-color: white !important;
              min-height: 100vh !important;
            }
            
            .bg-white {
              background-color: white !important;
            }
            
            /* Ensure proper page breaks and margins for all pages */
            @media print {
              body {
                background-color: white !important;
              }
              
              #resume-preview {
                background-color: white !important;
                min-height: 100vh !important;
              }
              
              /* Add top margin to all pages */
              @page {
                margin-top: 12mm !important;
                margin-bottom: 12mm !important;
                margin-left: 10px !important;
                margin-right: 10px !important;
              }
              
              /* Special margin for first page only */
              @page :first {
                margin-top: 3mm !important;
                margin-bottom: 12mm !important;
                margin-left: 10px !important;
                margin-right: 10px !important;
              }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
        </html>
      `;
      
      // Call the API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get PDF blob
      const pdfBlob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('PDF generation failed. Please try again.');
    }
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};