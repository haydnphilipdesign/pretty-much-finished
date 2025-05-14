@echo off
echo Applying consolidated CSS changes to the website...

echo 1. Backing up original files...
copy src\index.css src\index.css.backup

echo 2. Applying consolidated CSS...
copy src\index.css.consolidated src\index.css

echo 3. Changes applied successfully!
echo.
echo The following files have been updated:
echo - src\index.css
echo.
echo New CSS files added:
echo - src\styles\consolidated.css
echo - src\styles\consolidated-part2.css
echo.
echo A backup of the original index.css file has been created with .backup extension.
echo.
echo Please restart your development server to see the changes.
echo.
