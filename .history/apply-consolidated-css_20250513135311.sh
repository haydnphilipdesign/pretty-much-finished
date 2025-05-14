#!/bin/bash

echo "Starting CSS Consolidation Process..."

# Create backup of current CSS
backup_date=$(date +%Y%m%d)
echo "Creating backup in css_backup_$backup_date..."
mkdir -p "css_backup_$backup_date"
cp -r src/index.css "css_backup_$backup_date/"
cp -r src/styles "css_backup_$backup_date/"

# Create new styles directory
echo "Creating new styles directory..."
mkdir -p src/styles_new

# Copy new CSS files
echo "Copying new CSS files..."
cp -f src/styles_new/core.css src/styles_new/
cp -f src/styles_new/contrast-system.css src/styles_new/
cp -f src/styles_new/glass-cards.css src/styles_new/
cp -f src/styles_new/page-specific.css src/styles_new/

# Update main index.css
echo "Updating main index.css..."
cp -f src/index.css src/index.css.backup

echo "CSS consolidation complete!"
echo
echo "Please test the changes by:"
echo "1. Running 'npm run dev' or 'yarn dev'"
echo "2. Checking all pages for proper text contrast"
echo "3. Verifying glass card appearances"
echo "4. Testing dark mode functionality"
echo
echo "If any issues are found, you can restore from css_backup_$backup_date"
echo 