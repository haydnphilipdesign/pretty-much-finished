@echo off
echo ===== PARESS CSS Consolidation and Contrast Fix =====
echo This script will consolidate CSS files and fix text contrast issues.
echo.

rem Backup original files
echo Creating backups...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set BACKUP_DATE=%%c%%a%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set BACKUP_TIME=%%a%%b)
set BACKUP_FOLDER=css_backup_%BACKUP_DATE%_%BACKUP_TIME%
mkdir %BACKUP_FOLDER%\src\styles
copy src\index.css %BACKUP_FOLDER%\src\
copy src\styles\*.css %BACKUP_FOLDER%\src\styles\
echo Backup created in %BACKUP_FOLDER%\
echo.

rem Create new CSS structure
echo Creating new CSS structure...
mkdir src\styles_new

rem Write core.css
echo Creating core.css...
echo /* PARESS Core CSS - May 2025 */ > src\styles_new\core.css
echo /* All base styles and essential components */ >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo /* Import fonts */ >> src\styles_new\core.css
echo @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700^&family=Merriweather:wght@400;700^&display=swap'); >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo @tailwind base; >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo @layer base { >> src\styles_new\core.css
echo   html, >> src\styles_new\core.css
echo   body { >> src\styles_new\core.css
echo     @apply text-gray-900 bg-white text-base overflow-x-hidden; >> src\styles_new\core.css
echo     width: 100%%; >> src\styles_new\core.css
echo     max-width: 100%%; >> src\styles_new\core.css
echo     height: 100%%; >> src\styles_new\core.css
echo   } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   #root, >> src\styles_new\core.css
echo   .app-root { >> src\styles_new\core.css
echo     min-height: 100vh; >> src\styles_new\core.css
echo     display: flex; >> src\styles_new\core.css
echo     flex-direction: column; >> src\styles_new\core.css
echo   } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   main { >> src\styles_new\core.css
echo     flex: 1 0 auto; >> src\styles_new\core.css
echo     display: flex; >> src\styles_new\core.css
echo     flex-direction: column; >> src\styles_new\core.css
echo   } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   footer { >> src\styles_new\core.css
echo     flex-shrink: 0; >> src\styles_new\core.css
echo     width: 100%%; >> src\styles_new\core.css
echo     position: relative; >> src\styles_new\core.css
echo     z-index: 1; >> src\styles_new\core.css
echo   } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   h1 { @apply text-3xl md:text-4xl lg:text-5xl; } >> src\styles_new\core.css
echo   h2 { @apply text-2xl md:text-3xl; } >> src\styles_new\core.css
echo   h3 { @apply text-xl md:text-2xl; } >> src\styles_new\core.css
echo   h4 { @apply text-lg md:text-xl; } >> src\styles_new\core.css
echo   h5 { @apply text-base md:text-lg; } >> src\styles_new\core.css
echo   h6 { @apply text-sm md:text-base; } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   p { @apply mb-4 last:mb-0; } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   a { @apply text-brand-blue hover:text-brand-gold transition-colors duration-300; } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo   ::selection { @apply bg-brand-blue/20 text-brand-blue; } >> src\styles_new\core.css
echo } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo @tailwind components; >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo @layer components { >> src\styles_new\core.css
echo   /* Core components - shortened for batch file */ >> src\styles_new\core.css
echo   .btn { @apply inline-block px-6 py-2.5 font-semibold transition-all duration-300 relative overflow-hidden rounded-lg; } >> src\styles_new\core.css
echo   .btn-primary { @apply bg-brand-blue text-white hover:bg-brand-blue/90 shadow-md hover:shadow-lg; } >> src\styles_new\core.css
echo   .btn-secondary { @apply bg-brand-gold text-brand-blue hover:bg-brand-gold/90 shadow-sm hover:shadow-md; } >> src\styles_new\core.css
echo   .card { @apply bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg; } >> src\styles_new\core.css
echo   .section { @apply py-12 md:py-16; } >> src\styles_new\core.css
echo   .container { @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8; } >> src\styles_new\core.css
echo } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo /* Animation keyframes */ >> src\styles_new\core.css
echo @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } >> src\styles_new\core.css
echo @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } >> src\styles_new\core.css
echo @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } >> src\styles_new\core.css
echo .animate-slide-up { animation: slideUp 0.5s ease-out forwards; } >> src\styles_new\core.css
echo .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; } >> src\styles_new\core.css
echo. >> src\styles_new\core.css
echo @tailwind utilities; >> src\styles_new\core.css

echo Creating index.css...
echo /* PARESS - Main CSS Entry Point */ > src\styles_new\index.css
echo /* Consolidated CSS structure - May 2025 */ >> src\styles_new\index.css
echo. >> src\styles_new\index.css
echo /* Import core CSS with Tailwind directives */ >> src\styles_new\index.css
echo @import './styles/core.css'; >> src\styles_new\index.css
echo. >> src\styles_new\index.css
echo /* Import enhanced components */ >> src\styles_new\index.css
echo @import './styles/glass-cards.css'; >> src\styles_new\index.css
echo. >> src\styles_new\index.css
echo /* Import contrast system */ >> src\styles_new\index.css
echo @import './styles/contrast-system.css'; >> src\styles_new\index.css
echo. >> src\styles_new\index.css
echo /* Import specific page fixes */ >> src\styles_new\index.css
echo @import './styles/page-specific.css'; >> src\styles_new\index.css

echo Creating remaining CSS files...
echo See the 'Complete CSS Consolidation Package' artifact for the full CSS content.
echo You will need to manually copy the content for:
echo - src\styles\contrast-system.css
echo - src\styles\glass-cards.css
echo - src\styles\page-specific.css

echo Applying the changes...
echo IMPORTANT: The complete content for all CSS files is available in the 'Complete CSS Consolidation Package' artifact.
echo.
echo After copying the content from the artifact to the appropriate files:
echo 1. Move the src\styles_new folder to replace src\styles
echo 2. Copy src\styles\index.css to src\index.css
echo 3. Restart the development server
echo.
echo A backup of your original files is available in %BACKUP_FOLDER%\
echo.
echo Press any key to exit...
pause > nul