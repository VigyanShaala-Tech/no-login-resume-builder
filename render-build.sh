#!/usr/bin/env bash
set -e

# Install npm dependencies
npm install

# Install Playwright with browsers in the correct location
PLAYWRIGHT_BROWSERS_PATH=/opt/render/.cache/playwright npx playwright install chromium

echo "Build completed successfully"
