@echo off
echo 🔄 Fixing CSS issues and rebuilding project...

echo 📋 Checking for running dev servers...
tasklist /FI "IMAGENAME eq node.exe" | find "node.exe" > nul
if %ERRORLEVEL% == 0 (
    echo 🛑 Stopping existing dev server...
    for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /fo table /nh') do (
        taskkill /PID %%a /F
    )
) else (
    echo ✅ No running dev server found.
)

echo 🧹 Clearing potential cache issues...
copy /b src\index.css+,, src\index.css
copy /b src\styles\glass-cards-improved.css+,, src\styles\glass-cards-improved.css
copy /b src\styles\enhanced-text-contrast.css+,, src\styles\enhanced-text-contrast.css

echo 📝 Updating index.css to include our enhanced styles...
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

echo 🔧 Creating alternative version with different Tailwind import order...
echo /* Tailwind directives first */ > src\temp-tailwind-fix.css
echo @tailwind base; >> src\temp-tailwind-fix.css
echo @tailwind components; >> src\temp-tailwind-fix.css
echo. >> src\temp-tailwind-fix.css
echo /* Import custom styles */ >> src\temp-tailwind-fix.css
echo @import './styles/glass-cards-improved.css'; >> src\temp-tailwind-fix.css
echo @import './styles/enhanced-text-contrast.css'; >> src\temp-tailwind-fix.css
echo @import './styles/contrast-variables.css'; >> src\temp-tailwind-fix.css
echo @import './styles/design-system.css'; >> src\temp-tailwind-fix.css
echo @import './styles/minimal-contrast.css'; >> src\temp-tailwind-fix.css
echo @import './styles/scrollbar-fix.css'; >> src\temp-tailwind-fix.css
echo @import './styles/transition-fixes.css'; >> src\temp-tailwind-fix.css
echo @import './styles/services-page-fixes.css'; >> src\temp-tailwind-fix.css
echo @import './styles/home-page-fixes.css'; >> src\temp-tailwind-fix.css
echo @import './styles/statistics-cards-fix.css'; >> src\temp-tailwind-fix.css
echo. >> src\temp-tailwind-fix.css
echo /* Tailwind utilities last */ >> src\temp-tailwind-fix.css
echo @tailwind utilities; >> src\temp-tailwind-fix.css

echo 📂 Backing up original index.css...
copy src\index.css src\index.css.original-fix

echo 🧪 Testing alternative Tailwind import order...
copy src\temp-tailwind-fix.css src\index.css

echo 🧹 Cleaning cached modules...
if exist "node_modules\.vite" (
    rmdir /s /q node_modules\.vite
)

echo 🚀 Restarting development server...
start cmd /c "npm run dev"

echo ✅ Fixes applied successfully!
echo ⚠️ If styles still don't appear, try the following:
echo   1. Hard refresh your browser with Ctrl+F5
echo   2. Open an incognito/private window
echo   3. Try both index.css files (original and alternative)
echo   4. Check browser developer tools for any CSS errors
