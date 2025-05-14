@echo off
echo ========================================================
echo     GLASS CARDS CSS FIX - MULTIPLE APPROACHES
echo ========================================================
echo.

echo Step 1: Creating backup of current files...
copy src\index.css src\index.css.backup.%date:~-4,4%%date:~-7,2%%date:~-10,2%
echo Backup created successfully.
echo.

echo Step 2: Checking if development server is running...
tasklist /FI "IMAGENAME eq node.exe" | find "node.exe" > nul
if %ERRORLEVEL% == 0 (
    echo Development server is running - will need to restart it.
    echo Stopping development server...
    taskkill /FI "IMAGENAME eq node.exe" /F
    echo Development server stopped.
) else (
    echo No development server detected.
)
echo.

echo Step 3: Selecting a CSS approach to try...
echo.
echo [1] Standard CSS Import (recommended first try)
echo [2] Tailwind Layer-Based Approach (more compatible with Tailwind)
echo [3] Direct CSS in index.css (most reliable)
echo.
set /p approach=Select an approach (1-3): 
echo.

if "%approach%"=="1" (
    echo Applying Standard CSS Import approach...
    
    echo /* Enhanced Glass Card System - May 2025 Update */ > src\index.css
    echo @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700^&family=Merriweather:wght@400;700^&display=swap'); >> src\index.css
    echo. >> src\index.css
    echo /* Import enhanced glass card and contrast fixes first */ >> src\index.css
    echo @import './styles/glass-cards-improved.css'; >> src\index.css
    echo @import './styles/enhanced-text-contrast.css'; >> src\index.css
    echo. >> src\index.css
    echo /* Import other essential styles */ >> src\index.css
    echo @import './styles/contrast-variables.css'; >> src\index.css
    echo @import './styles/design-system.css'; >> src\index.css
    echo @import './styles/minimal-contrast.css'; >> src\index.css
    echo @import './styles/scrollbar-fix.css'; >> src\index.css
    echo @import './styles/transition-fixes.css'; >> src\index.css
    echo @import './styles/services-page-fixes.css'; >> src\index.css
    echo @import './styles/home-page-fixes.css'; >> src\index.css
    echo @import './styles/statistics-cards-fix.css'; >> src\index.css
    echo. >> src\index.css
    echo /* Tailwind directives */ >> src\index.css
    echo @tailwind base; >> src\index.css
    echo @tailwind components; >> src\index.css
    echo @tailwind utilities; >> src\index.css
    
    echo Standard CSS Import approach applied.
)

if "%approach%"=="2" (
    echo Applying Tailwind Layer-Based approach...
    
    echo /* Tailwind directives first */ > src\index.css
    echo @tailwind base; >> src\index.css
    echo @tailwind components; >> src\index.css
    echo. >> src\index.css
    echo /* Import glass cards with @layer directives */ >> src\index.css
    echo @import './styles/glass-cards-tailwind.css'; >> src\index.css
    echo. >> src\index.css
    echo /* Import other essential styles */ >> src\index.css
    echo @import './styles/contrast-variables.css'; >> src\index.css
    echo @import './styles/design-system.css'; >> src\index.css
    echo @import './styles/minimal-contrast.css'; >> src\index.css
    echo @import './styles/scrollbar-fix.css'; >> src\index.css
    echo @import './styles/transition-fixes.css'; >> src\index.css
    echo @import './styles/services-page-fixes.css'; >> src\index.css
    echo @import './styles/home-page-fixes.css'; >> src\index.css
    echo @import './styles/statistics-cards-fix.css'; >> src\index.css
    echo. >> src\index.css
    echo /* Tailwind utilities last */ >> src\index.css
    echo @tailwind utilities; >> src\index.css
    
    echo Tailwind Layer-Based approach applied.
)

if "%approach%"=="3" (
    echo Applying Direct CSS approach...
    
    echo /* Tailwind directives */ > src\index.css
    echo @tailwind base; >> src\index.css
    echo @tailwind components; >> src\index.css
    echo. >> src\index.css
    
    echo /* Directly including glass card styles */ >> src\index.css
    type src\styles\glass-cards-improved.css >> src\index.css
    echo. >> src\index.css
    type src\styles\enhanced-text-contrast.css >> src\index.css
    echo. >> src\index.css
    
    echo /* Import other essential styles */ >> src\index.css
    echo @import './styles/contrast-variables.css'; >> src\index.css
    echo @import './styles/design-system.css'; >> src\index.css
    echo @import './styles/minimal-contrast.css'; >> src\index.css
    echo @import './styles/scrollbar-fix.css'; >> src\index.css
    echo @import './styles/transition-fixes.css'; >> src\index.css
    echo @import './styles/services-page-fixes.css'; >> src\index.css
    echo @import './styles/home-page-fixes.css'; >> src\index.css
    echo @import './styles/statistics-cards-fix.css'; >> src\index.css
    echo. >> src\index.css
    
    echo /* Tailwind utilities */ >> src\index.css
    echo @tailwind utilities; >> src\index.css
    
    echo Direct CSS approach applied.
)

echo.
echo Step 4: Cleaning build cache...
if exist "node_modules\.vite" (
    rmdir /s /q node_modules\.vite
    echo Vite cache cleaned.
) else (
    echo No Vite cache found.
)
echo.

echo Step 5: Starting development server...
start cmd /c "npm run dev"
echo Development server started.
echo.

echo ========================================================
echo     TROUBLESHOOTING TIPS
echo ========================================================
echo.
echo If styles don't appear after applying this fix:
echo.
echo 1. Hard refresh your browser (Ctrl+F5)
echo 2. Open the site in an incognito/private window
echo 3. Try a different approach (1-3) from this script
echo 4. Check browser console for CSS errors
echo 5. If using approach #2, make sure src\styles\glass-cards-tailwind.css exists
echo.
echo Backup files have been created if you need to restore the original state.
echo.
echo ========================================================
echo.
echo Press any key to exit...
pause > nul
