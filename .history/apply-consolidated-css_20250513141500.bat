@echo off
echo Applying consolidated CSS changes...

:: Make a backup of the original files
echo Creating backups...
mkdir -p css_backup_%date:~10,4%%date:~4,2%%date:~7,2%
copy src\index.css src\index.css.backup.%date:~10,4%%date:~4,2%%date:~7,2%
echo Backup created as src\index.css.backup.%date:~10,4%%date:~4,2%%date:~7,2%

:: Apply the consolidated CSS
echo Applying new modular CSS structure...

:: Create styles_new directory if it doesn't exist
if not exist src\styles_new mkdir src\styles_new

:: Copy the new CSS files
copy src\styles_new\index.css src\styles_new\index.css
copy src\styles_new\core.css src\styles_new\core.css
copy src\styles_new\glass-cards.css src\styles_new\glass-cards.css
copy src\styles_new\contrast-system.css src\styles_new\contrast-system.css
copy src\styles_new\page-specific.css src\styles_new\page-specific.css

:: Update main index.css to import the new structure
echo /* PARESS - Main CSS Entry Point */> src\index.css
echo.>> src\index.css
echo /* Import modular CSS from styles_new directory */>> src\index.css
echo @import './styles_new/index.css';>> src\index.css
echo.>> src\index.css
echo /* This file has been consolidated into modular components */>> src\index.css
echo /* in the styles_new directory for better maintainability */>> src\index.css

echo CSS consolidation completed successfully!
echo.
echo Please restart your development server to see the changes.
echo.

pause
