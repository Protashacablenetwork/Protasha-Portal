#!/usr/bin/env bash
set -euo pipefail

echo "============================================================"
echo "  Protasha Cable Network - Universal Hosting Builder"
echo "============================================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed. Install from https://nodejs.org/"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "[1/3] Installing dependencies..."
  npm install
else
  echo "[1/3] Dependencies already installed."
fi

echo "[2/3] Building production bundle (dist/ and HTDOCS_UPLOAD/)..."
npm run build

if [ ! -f "dist/assets/app.js" ]; then
  echo "[ERROR] Build failed: dist/assets/app.js was not generated."
  exit 1
fi

echo "[3/3] Creating HOSTING_UPLOAD.zip..."
rm -f HOSTING_UPLOAD.zip
if command -v zip >/dev/null 2>&1; then
  (cd dist && zip -qr ../HOSTING_UPLOAD.zip . -x "*.DS_Store")
  echo ""
  echo "SUCCESS! Upload everything inside 'dist/' (or extract HOSTING_UPLOAD.zip)"
  echo "into your hosting server's public_html / htdocs / wwwroot folder."
else
  echo ""
  echo "SUCCESS! 'zip' command not found, so upload all files directly from 'dist/' (or 'HTDOCS_UPLOAD/')."
fi
