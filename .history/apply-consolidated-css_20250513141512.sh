#!/bin/bash

echo "Applying consolidated CSS changes..."

# Make a backup of the original files
BACKUP_DATE=$(date +%Y%m%d)
echo "Creating backups..."
mkdir -p css_backup_$BACKUP_DATE
cp src/index.css src/index.css.backup.$BACKUP_DATE
echo "Backup created as src/index.css.backup.$BACKUP_DATE"

# Apply the consolidated CSS
echo "Applying new modular CSS structure..."

# Create styles_new directory if it doesn't exist
mkdir -p src/styles_new

# Copy the new CSS files
cp src/styles_new/index.css src/styles_new/index.css 2>/dev/null || :
cp src/styles_new/core.css src/styles_new/core.css 2>/dev/null || :
cp src/styles_new/glass-cards.css src/styles_new/glass-cards.css 2>/dev/null || :
cp src/styles_new/contrast-system.css src/styles_new/contrast-system.css 2>/dev/null || :
cp src/styles_new/page-specific.css src/styles_new/page-specific.css 2>/dev/null || :

# Update main index.css to import the new structure
cat > src/index.css << EOF
/* PARESS - Main CSS Entry Point */

/* Import modular CSS from styles_new directory */
@import './styles_new/index.css';

/* This file has been consolidated into modular components 
   in the styles_new directory for better maintainability */
EOF

echo "CSS consolidation completed successfully!"
echo
echo "Please restart your development server to see the changes."
echo

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