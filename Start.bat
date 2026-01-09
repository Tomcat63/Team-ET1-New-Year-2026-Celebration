@echo off
setlocal

echo ============================================
echo   Team ET1 New Year 2026 Celebration
echo ============================================
echo.

REM Check if node_modules exists, if not run npm install
if not exist "node_modules\" (
    echo node_modules not found. Installing dependencies...
    call npm.cmd install
    if errorlevel 1 (
        echo npm install failed!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
    echo.
)

echo Killing process on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /R /C:":3000 "') do (
    echo Terminating PID: %%a
    taskkill /f /pid %%a 2>nul
)

echo.
echo Running build to verify project...
call npm.cmd run build || (echo Build failed! & pause & exit /b)

echo.
echo Starting app with npm run dev...
call npm.cmd run dev
pause
