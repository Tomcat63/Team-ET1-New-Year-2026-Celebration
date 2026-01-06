@echo off
setlocal

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
