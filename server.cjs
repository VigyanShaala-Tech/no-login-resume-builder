// Set Playwright environment variables for Render
process.env.PLAYWRIGHT_BROWSERS_PATH = '0';
process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1';

const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/generate-pdf', async (req, res) => {
  try {
    console.log('Received PDF generation request');
    const { html } = req.body;

    if (!html) {
      console.log('No HTML content provided');
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log('HTML content length:', html.length);
    console.log('Starting Playwright...');

    // Launch browser with Render-specific configuration
    const browser = await chromium.launch({
      executablePath: '/opt/render/project/.cache/playwright/chromium_headless_shell-1187/chrome-linux/headless_shell',
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    console.log('Browser launched');

    // Create new page
    const page = await browser.newPage();

    console.log('Page created, setting content...');

    // Set content
    await page.setContent(html, { waitUntil: 'networkidle' });

    console.log('Content set, generating PDF...');

    // Generate PDF with improved page break handling
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '3mm',
        right: '10px',
        bottom: '12mm',
        left: '10px'
      }
    });

    console.log('PDF generated, size:', pdf.length);

    // Close browser
    await browser.close();

    console.log('Browser closed, sending PDF...');

    // Return PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdf);

    console.log('PDF sent successfully');

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Check if it's a Playwright installation issue
    if (error.message.includes('chromium') || error.message.includes('browser')) {
      console.error('Playwright browser issue detected. This might be an installation problem.');
      res.status(500).json({ 
        error: 'PDF generation failed: Browser not available. Please check Playwright installation.' 
      });
    } else {
      res.status(500).json({ error: 'PDF generation failed: ' + error.message });
    }
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
