@echo off
echo Applying enhanced glass cards and visual styling improvements...

echo 1. Backing up original files...
copy src\index.css src\index.css.backup.%date:~-4,4%%date:~-7,2%%date:~-10,2%

echo 2. Creating updated index.css with enhanced glass cards and better styling...
echo /* Enhanced Glass Card System - May 2025 Update */ > src\index.css.new
echo @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap'); >> src\index.css.new
echo. >> src\index.css.new
echo /* Import enhanced glass card and contrast fixes first to ensure they take precedence */ >> src\index.css.new
echo @import './styles/glass-cards-improved.css'; >> src\index.css.new
echo @import './styles/enhanced-text-contrast.css'; >> src\index.css.new
echo. >> src\index.css.new
echo /* Import other essential styles */ >> src\index.css.new
echo @import './styles/contrast-variables.css'; >> src\index.css.new
echo @import './styles/design-system.css'; >> src\index.css.new
echo @import './styles/scrollbar-fix.css'; >> src\index.css.new
echo @import './styles/transition-fixes.css'; >> src\index.css.new
echo @import './styles/services-page-fixes.css'; >> src\index.css.new
echo @import './styles/home-page-fixes.css'; >> src\index.css.new
echo @import './styles/statistics-cards-fix.css'; >> src\index.css.new
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

echo 4. Creating updated README for the enhanced glass cards...
echo # Enhanced Glass Card System - May 2025 Update > ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo This document explains the enhanced glass card system that improves the visual appearance and text contrast of all glass cards throughout the website. >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## What Changed >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo 1. **Improved Visual Appearance**: The glass cards now have a more refined, modern look with better transparency, blur effects, and shadows. >> ENHANCED-GLASS-CARDS-README.md
echo 2. **Enhanced Text Contrast**: All text in the glass cards now has proper contrast against the background, meeting accessibility standards. >> ENHANCED-GLASS-CARDS-README.md
echo 3. **Consistent Styling**: All glass card variants now have consistent styling, padding, and hover effects. >> ENHANCED-GLASS-CARDS-README.md
echo 4. **Better Hover Effects**: The cards now have more pronounced, smoother hover animations that add depth and interactivity. >> ENHANCED-GLASS-CARDS-README.md
echo 5. **Optimized Backdrop Filters**: The backdrop filters have been optimized for better performance and visual quality. >> ENHANCED-GLASS-CARDS-README.md
echo 6. **Improved Form Integration**: Forms within glass cards now have better styling and contrast. >> ENHANCED-GLASS-CARDS-README.md
echo 7. **Accessibility Improvements**: Added focus states and improved interactive element styling for better accessibility. >> ENHANCED-GLASS-CARDS-README.md
echo 8. **Reduced CSS Conflicts**: Eliminated conflicting CSS rules for more consistent appearance. >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Glass Card Variants >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo The enhanced glass card system includes 8 variants: >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo 1. **Standard Glass Card** (`.glass-card`): For light backgrounds, with a semi-transparent white background. >> ENHANCED-GLASS-CARDS-README.md
echo 2. **Blue Glass Card** (`.glass-card-blue`): For light backgrounds, with a semi-transparent blue background. >> ENHANCED-GLASS-CARDS-README.md
echo 3. **Navy Glass Card** (`.glass-card-navy`): For light backgrounds, with a semi-transparent navy background. >> ENHANCED-GLASS-CARDS-README.md
echo 4. **White Glass Card** (`.glass-card-white`): For dark backgrounds, with a mostly opaque white background. >> ENHANCED-GLASS-CARDS-README.md
echo 5. **Dark Glass Card** (`.glass-card-dark`): For light backgrounds, with a semi-transparent black background. >> ENHANCED-GLASS-CARDS-README.md
echo 6. **Frost Glass Card** (`.glass-card-frost`): For forms on any background, with a mostly opaque white background. >> ENHANCED-GLASS-CARDS-README.md
echo 7. **Light Glass Card** (`.glass-card-light`): For dark backgrounds, with a very transparent white background. >> ENHANCED-GLASS-CARDS-README.md
echo 8. **Gold Glass Card** (`.glass-card-gold`): For accent areas, with a gold gradient background. >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Usage Guidelines >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo When using glass cards, follow these guidelines: >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ### For Light Backgrounds (white/gray) >> ENHANCED-GLASS-CARDS-README.md
echo - Use `.glass-card`, `.glass-card-blue`, `.glass-card-navy`, or `.glass-card-dark` >> ENHANCED-GLASS-CARDS-README.md
echo - These have appropriate contrast adjustments for light backgrounds >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ### For Dark Backgrounds (blue/navy) >> ENHANCED-GLASS-CARDS-README.md
echo - Use `.glass-card-white`, `.glass-card-frost`, or `.glass-card-light` >> ENHANCED-GLASS-CARDS-README.md
echo - These have appropriate contrast adjustments for dark backgrounds >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ### For Forms >> ENHANCED-GLASS-CARDS-README.md
echo - Use `.glass-card-frost` which has optimized styling for form elements >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ### For Accent Areas >> ENHANCED-GLASS-CARDS-README.md
echo - Use `.glass-card-gold` to draw attention to important content >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Text Styling >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo All glass card variants have been optimized for text contrast: >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo - Headings (h1, h2, h3, h4) have appropriate colors and text shadows where needed >> ENHANCED-GLASS-CARDS-README.md
echo - Paragraphs and other text elements have proper contrast against the card background >> ENHANCED-GLASS-CARDS-README.md
echo - Form elements (inputs, textareas, selects) have consistent styling with proper contrast >> ENHANCED-GLASS-CARDS-README.md
echo - Links have appropriate styling and hover states with sufficient contrast >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Helper Classes >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo The following helper classes are available for consistent content styling: >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo - `.glass-card-title`: Use for card headings >> ENHANCED-GLASS-CARDS-README.md
echo - `.glass-card-subtitle`: Use for secondary text below the heading >> ENHANCED-GLASS-CARDS-README.md
echo - `.glass-card-content`: Use for main content text >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Opacity Control >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo Adjust the opacity of glass cards using helper classes: >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo - `.glass-opacity-light` (70%% opacity) >> ENHANCED-GLASS-CARDS-README.md
echo - `.glass-opacity-medium` (85%% opacity)  >> ENHANCED-GLASS-CARDS-README.md
echo - `.glass-opacity-heavy` (95%% opacity) >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Backup >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo A backup of the original `index.css` file has been created with the `.backup.[date]` extension. If you need to revert the changes, you can simply copy this file back to `index.css`. >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo ## Accessibility Notes >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo The enhanced glass card system now includes: >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo - Improved focus states for interactive elements >> ENHANCED-GLASS-CARDS-README.md
echo - Better contrast ratios for all text content >> ENHANCED-GLASS-CARDS-README.md
echo - Consistent hover effects for interactive elements >> ENHANCED-GLASS-CARDS-README.md
echo - Proper text shadows to enhance readability when needed >> ENHANCED-GLASS-CARDS-README.md
echo. >> ENHANCED-GLASS-CARDS-README.md
echo If you encounter any issues with the enhanced glass cards, please refer to the backup files or contact the developer. >> ENHANCED-GLASS-CARDS-README.md

echo 5. Changes applied successfully!
echo.
echo The following files have been updated:
echo - src\index.css (backup created with current date)
echo.
echo New CSS files added:
echo - src\styles\glass-cards-improved.css
echo - src\styles\enhanced-text-contrast.css
echo.
echo Documentation updated:
echo - ENHANCED-GLASS-CARDS-README.md
echo.
echo Please restart your development server to see the changes.
echo.
