@echo off
chcp 65001 >nul
title Protyasha Cable Network - InfinityFree Build & ZIP Maker
echo ============================================================
echo   Protyasha Cable Network - InfinityFree Upload ZIP Builder
echo ============================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Node.js is not installed on this PC.
  echo Please install Node.js LTS from: https://nodejs.org
  echo Then double-click this file again.
  echo.
  pause
  exit /b 1
)

echo [1/3] Installing packages (first time takes 1-2 minutes)...
call npm install
if %errorlevel% neq 0 (
  echo [ERROR] npm install failed. Check internet connection and try again.
  pause
  exit /b 1
)

echo.
echo [2/3] Building production app into dist folder...
call npm run build
if %errorlevel% neq 0 (
  echo [ERROR] Build failed.
  pause
  exit /b 1
)

echo.
echo [3/3] Creating INFINITYFREE_UPLOAD.zip...
if exist "INFINITYFREE_UPLOAD.zip" del /f /q "INFINITYFREE_UPLOAD.zip"
powershell -NoProfile -Command "Compress-Archive -Path 'dist\*','dist\.htaccess' -DestinationPath 'INFINITYFREE_UPLOAD.zip' -Force"
if %errorlevel% neq 0 (
  powershell -NoProfile -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'INFINITYFREE_UPLOAD.zip' -Force"
)

echo.
echo ============================================================
echo   SUCCESS! Ready for InfinityFree!
echo ============================================================
echo.
echo   File created: INFINITYFREE_UPLOAD.zip
echo   (Or upload all files inside the "dist" folder)
echo.
echo   InfinityFree steps:
echo   1. Open InfinityFree File Manager -> htdocs folder
echo   2. Delete old files inside htdocs (do NOT delete htdocs itself)
echo   3. Upload and Extract INFINITYFREE_UPLOAD.zip inside htdocs
echo      (Make sure index.html and assets folder are directly inside htdocs)
echo ============================================================
echo.
explorer /select,"%cd%\INFINITYFREE_UPLOAD.zip"
pause
