@echo off
echo Starting CSS Consolidation Process...

REM Create backup of current CSS
set "backup_date=%date:~10,4%%date:~4,2%%date:~7,2%"
echo Creating backup in css_backup_%backup_date%...
mkdir "css_backup_%backup_date%"
xcopy /s /i "src\index.css" "css_backup_%backup_date%\"
xcopy /s /i "src\styles" "css_backup_%backup_date%\styles\"

REM Create new styles directory
echo Creating new styles directory...
mkdir "src\styles_new" 2>nul

REM Copy new CSS files
echo Copying new CSS files...
xcopy /y "src\styles_new\core.css" "src\styles_new\"
xcopy /y "src\styles_new\contrast-system.css" "src\styles_new\"
xcopy /y "src\styles_new\glass-cards.css" "src\styles_new\"
xcopy /y "src\styles_new\page-specific.css" "src\styles_new\"

REM Update main index.css
echo Updating main index.css...
copy /y "src\index.css" "src\index.css.backup"

echo CSS consolidation complete!
echo.
echo Please test the changes by:
echo 1. Running 'npm run dev' or 'yarn dev'
echo 2. Checking all pages for proper text contrast
echo 3. Verifying glass card appearances
echo 4. Testing dark mode functionality
echo.
echo If any issues are found, you can restore from css_backup_%backup_date%
echo.
