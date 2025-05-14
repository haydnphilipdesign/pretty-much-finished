#!/bin/bash

echo "Applying enhanced glass cards and visual styling improvements..."

echo "1. Backing up original files..."
cp src/index.css "src/index.css.backup.$(date +%Y%m%d)"

echo "2. Creating updated index.css with enhanced glass cards and better styling..."
cat > src/index.css.new << EOL
/* Enhanced Glass Card System - May 2025 Update */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap');

/* Import enhanced glass card and contrast fixes first to ensure they take precedence */
@import './styles/glass-cards-improved.css';
@import './styles/enhanced-text-contrast.css';

/* Import other essential styles */
@import './styles/contrast-variables.css';
@import './styles/design-system.css';
@import './styles/scrollbar-fix.css';
@import './styles/transition-fixes.css';
@import './styles/services-page-fixes.css';
@import './styles/home-page-fixes.css';
@import './styles/statistics-cards-fix.css';

/* Import transaction form specific CSS - DO NOT MODIFY */
@import './styles/transaction-form.css';

/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

echo "3. Applying the new index.css..."
cp src/index.css.new src/index.css
rm src/index.css.new

echo "4. Creating updated README for the enhanced glass cards..."
cat > ENHANCED-GLASS-CARDS-README.md << EOL
# Enhanced Glass Card System - May 2025 Update

This document explains the enhanced glass card system that improves the visual appearance and text contrast of all glass cards throughout the website.

## What Changed

1. **Improved Visual Appearance**: The glass cards now have a more refined, modern look with better transparency, blur effects, and shadows.
2. **Enhanced Text Contrast**: All text in the glass cards now has proper contrast against the background, meeting accessibility standards.
3. **Consistent Styling**: All glass card variants now have consistent styling, padding, and hover effects.
4. **Better Hover Effects**: The cards now have more pronounced, smoother hover animations that add depth and interactivity.
5. **Optimized Backdrop Filters**: The backdrop filters have been optimized for better performance and visual quality.
6. **Improved Form Integration**: Forms within glass cards now have better styling and contrast.
7. **Accessibility Improvements**: Added focus states and improved interactive element styling for better accessibility.
8. **Reduced CSS Conflicts**: Eliminated conflicting CSS rules for more consistent appearance.

## Glass Card Variants

The enhanced glass card system includes 8 variants:

1. **Standard Glass Card** (\`.glass-card\`): For light backgrounds, with a semi-transparent white background.
2. **Blue Glass Card** (\`.glass-card-blue\`): For light backgrounds, with a semi-transparent blue background.
3. **Navy Glass Card** (\`.glass-card-navy\`): For light backgrounds, with a semi-transparent navy background.
4. **White Glass Card** (\`.glass-card-white\`): For dark backgrounds, with a mostly opaque white background.
5. **Dark Glass Card** (\`.glass-card-dark\`): For light backgrounds, with a semi-transparent black background.
6. **Frost Glass Card** (\`.glass-card-frost\`): For forms on any background, with a mostly opaque white background.
7. **Light Glass Card** (\`.glass-card-light\`): For dark backgrounds, with a very transparent white background.
8. **Gold Glass Card** (\`.glass-card-gold\`): For accent areas, with a gold gradient background.

## Usage Guidelines

When using glass cards, follow these guidelines:

### For Light Backgrounds (white/gray)
- Use \`.glass-card\`, \`.glass-card-blue\`, \`.glass-card-navy\`, or \`.glass-card-dark\`
- These have appropriate contrast adjustments for light backgrounds

### For Dark Backgrounds (blue/navy)
- Use \`.glass-card-white\`, \`.glass-card-frost\`, or \`.glass-card-light\`
- These have appropriate contrast adjustments for dark backgrounds

### For Forms
- Use \`.glass-card-frost\` which has optimized styling for form elements

### For Accent Areas
- Use \`.glass-card-gold\` to draw attention to important content

## Text Styling

All glass card variants have been optimized for text contrast:

- Headings (h1, h2, h3, h4) have appropriate colors and text shadows where needed
- Paragraphs and other text elements have proper contrast against the card background
- Form elements (inputs, textareas, selects) have consistent styling with proper contrast
- Links have appropriate styling and hover states with sufficient contrast

## Helper Classes

The following helper classes are available for consistent content styling:

- \`.glass-card-title\`: Use for card headings
- \`.glass-card-subtitle\`: Use for secondary text below the heading
- \`.glass-card-content\`: Use for main content text

## Opacity Control

Adjust the opacity of glass cards using helper classes:

- \`.glass-opacity-light\` (70% opacity)
- \`.glass-opacity-medium\` (85% opacity) 
- \`.glass-opacity-heavy\` (95% opacity)

## Backup

A backup of the original \`index.css\` file has been created with the \`.backup.[date]\` extension. If you need to revert the changes, you can simply copy this file back to \`index.css\`.

## Accessibility Notes

The enhanced glass card system now includes:

- Improved focus states for interactive elements
- Better contrast ratios for all text content
- Consistent hover effects for interactive elements
- Proper text shadows to enhance readability when needed

If you encounter any issues with the enhanced glass cards, please refer to the backup files or contact the developer.
EOL

echo "5. Changes applied successfully!"
echo
echo "The following files have been updated:"
echo "- src/index.css (backup created with current date)"
echo
echo "New CSS files added:"
echo "- src/styles/glass-cards-improved.css"
echo "- src/styles/enhanced-text-contrast.css"
echo
echo "Documentation updated:"
echo "- ENHANCED-GLASS-CARDS-README.md"
echo
echo "Please restart your development server to see the changes."
echo
