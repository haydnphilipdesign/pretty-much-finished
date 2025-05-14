@echo off
echo Applying enhanced glass card styles to the website...

echo 1. Backing up original files...
copy src\index.css src\index.css.backup

echo 2. Creating updated index.css with enhanced glass cards...
echo /* Enhanced Glass Card System */ > src\index.css.new
echo @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap'); >> src\index.css.new
echo. >> src\index.css.new
echo /* Import enhanced glass card styles first to ensure they take precedence */ >> src\index.css.new
echo @import './styles/enhanced-glass-cards.css'; >> src\index.css.new
echo. >> src\index.css.new
echo /* Import other styles */ >> src\index.css.new
echo @import './styles/contrast-variables.css'; >> src\index.css.new
echo @import './styles/design-system.css'; >> src\index.css.new
echo @import './styles/scrollbar-fix.css'; >> src\index.css.new
echo @import './styles/transition-fixes.css'; >> src\index.css.new
echo @import './styles/services-page-fixes.css'; >> src\index.css.new
echo @import './styles/home-page-fixes.css'; >> src\index.css.new
echo. >> src\index.css.new
echo /* Import transaction form specific CSS - DO NOT MODIFY */ >> src\index.css.new
echo @import './styles/transaction-form.css'; >> src\index.css.new
echo. >> src\index.css.new
echo /* Tailwind directives */ >> src\index.css.new
echo @tailwind base; >> src\index.css.new
echo @tailwind components; >> src\index.css.new
echo @tailwind utilities; >> src\index.css.new

echo 3. Applying the new index.css...
copy src\index.css.new src\index.css
del src\index.css.new

echo 4. Changes applied successfully!
echo.
echo The following files have been updated:
echo - src\index.css
echo.
echo New CSS files added:
echo - src\styles\enhanced-glass-cards.css
echo.
echo A backup of the original index.css file has been created with .backup extension.
echo.
echo Please restart your development server to see the changes.
echo.
