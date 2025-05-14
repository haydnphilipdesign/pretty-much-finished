#!/bin/bash
# Deployment script for pa-real-estate-support-services app

echo "📦 Building and deploying application..."
echo "========================================="

# Print node and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Verify API files exist in correct locations
echo -e "\n🔍 Checking API files..."
for file in "generate-pdf.js" "supabase-pdf-upload.js" "update-airtable-attachment.js"; do
  if [ -f "api/$file" ]; then
    echo "✅ Found api/$file"
  else
    echo "❌ Missing api/$file"
  fi
done

# Check vercel.json configuration
echo -e "\n🔍 Checking vercel.json configuration..."
if [ -f "vercel.json" ]; then
  echo "✅ vercel.json exists"
  cat vercel.json | grep -i "functions" && echo "✅ Functions section found" || echo "❌ Missing functions section"
  cat vercel.json | grep -i "routes" && echo "✅ Routes section found" || echo "❌ Missing routes section"
else
  echo "❌ vercel.json not found"
fi

# Check .vercelignore
echo -e "\n🔍 Checking .vercelignore..."
if [ -f ".vercelignore" ]; then
  echo "✅ .vercelignore exists"
  
  # Highlight potential problems in .vercelignore
  for file in "api/generate-pdf.js" "api/supabase-pdf-upload.js" "api/update-airtable-attachment.js"; do
    if grep -q "$file" .vercelignore; then
      echo "⚠️ WARNING: $file is excluded in .vercelignore"
    fi
  done
else
  echo "❌ .vercelignore not found"
fi

# Deploy the application
echo -e "\n🚀 Deploying to Vercel..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
  echo -e "\n✅ Deployment initiated successfully!"
  echo "Wait for deployment to complete, then run check-production-config.js to verify endpoints"
else
  echo -e "\n❌ Deployment failed. Check the error messages above."
fi 