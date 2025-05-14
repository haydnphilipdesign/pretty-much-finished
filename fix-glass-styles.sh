#!/bin/bash

echo "🔄 Fixing CSS issues and rebuilding project..."

# Stop any running dev server (you may need to adjust this based on your actual process management)
echo "📋 Checking for running dev servers..."
DEV_PID=$(ps aux | grep "[n]ode.*vite" | awk '{print $2}')
if [ ! -z "$DEV_PID" ]; then
  echo "🛑 Stopping existing dev server (PID: $DEV_PID)..."
  kill -9 $DEV_PID
else
  echo "✅ No running dev server found."
fi

# Clear browser cache by updating modification times on key files
echo "🧹 Clearing potential cache issues..."
touch src/index.css
touch src/styles/glass-cards-improved.css 
touch src/styles/enhanced-text-contrast.css

# Ensure our CSS files are properly set up
echo "📝 Updating index.css to include our enhanced styles..."
cat > src/index.css << EOL
/* Enhanced Glass Card System - May 2025 Update */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&display=swap');

/* Import enhanced glass card and contrast fixes first */
@import './styles/glass-cards-improved.css';
@import './styles/enhanced-text-contrast.css';

/* Import other essential styles */
@import './styles/contrast-variables.css';
@import './styles/design-system.css';
@import './styles/minimal-contrast.css';
@import './styles/scrollbar-fix.css';
@import './styles/transition-fixes.css';
@import './styles/services-page-fixes.css';
@import './styles/home-page-fixes.css';
@import './styles/statistics-cards-fix.css';

/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# Move imports around to ensure they're processed correctly
echo "🔧 Adjusting Tailwind imports for proper processing..."
cat > src/temp-tailwind-fix.css << EOL
/* Tailwind directives first */
@tailwind base;
@tailwind components;

/* Import custom styles */
@import './styles/glass-cards-improved.css';
@import './styles/enhanced-text-contrast.css';
@import './styles/contrast-variables.css';
@import './styles/design-system.css';
@import './styles/minimal-contrast.css';
@import './styles/scrollbar-fix.css';
@import './styles/transition-fixes.css';
@import './styles/services-page-fixes.css';
@import './styles/home-page-fixes.css';
@import './styles/statistics-cards-fix.css';

/* Tailwind utilities last */
@tailwind utilities;
EOL

# Try both approaches - first the standard way, then with Tailwind directives first
echo "📂 Backing up original index.css..."
cp src/index.css src/index.css.original-fix

echo "🧪 Testing alternative Tailwind import order..."
cp src/temp-tailwind-fix.css src/index.css

# Clear any cached modules
echo "🧹 Cleaning cached modules..."
rm -rf node_modules/.vite

# Restart the development server
echo "🚀 Restarting development server..."
npm run dev &

echo "✅ Fixes applied successfully!"
echo "⚠️ If styles still don't appear, try the following:"
echo "  1. Hard refresh your browser with Ctrl+F5"
echo "  2. Open an incognito/private window"
echo "  3. Try both index.css files (original and alternative)"
echo "  4. Check browser developer tools for any CSS errors"
