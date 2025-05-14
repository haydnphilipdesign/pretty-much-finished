#!/bin/bash
# Force Deploy Script for Vercel
# This script ensures a clean deployment by clearing caches and rebuilding

echo -e "\e[36m🚀 Starting force deployment to Vercel...\e[0m"
echo -e "\e[36m============================================\e[0m"

# Step 1: Clean the build artifacts
echo -e "\n\e[36m🧹 Cleaning build artifacts...\e[0m"
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "\e[32m✅ Removed dist folder\e[0m"
fi
if [ -d ".vercel/output" ]; then
    rm -rf .vercel/output
    echo -e "\e[32m✅ Removed .vercel/output folder\e[0m"
fi
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo -e "\e[32m✅ Removed node_modules/.cache folder\e[0m"
fi

# Step 2: Verify the current code state
echo -e "\n\e[36m🔍 Verifying current code state...\e[0m"
RESET_FORM_PATH="src/components/TransactionForm/ResetFormDialog.tsx"
if [ -f "$RESET_FORM_PATH" ]; then
    if grep -q "text-red-600" "$RESET_FORM_PATH"; then
        echo -e "\e[32m✅ Reset button has red styling in code\e[0m"
    else
        echo -e "\e[31m❌ Reset button does NOT have red styling in code!\e[0m"
        echo -e "\e[33mPlease check and update the ResetFormDialog.tsx file\e[0m"
        read -p "Do you want to continue anyway? (y/n) " CONTINUE
        if [ "$CONTINUE" != "y" ]; then
            echo -e "\e[31mDeployment aborted\e[0m"
            exit 1
        fi
    fi
else
    echo -e "\e[31m❌ Cannot find ResetFormDialog.tsx file!\e[0m"
    echo -e "\e[33mPlease check the file path\e[0m"
    exit 1
fi

# Step 3: Build the project
echo -e "\n\e[36m🔨 Building project...\e[0m"
npm run build
if [ $? -ne 0 ]; then
    echo -e "\e[31m❌ Build failed. Please fix the errors and try again.\e[0m"
    exit 1
fi
echo -e "\e[32m✅ Build completed successfully\e[0m"

# Step 4: Deploy to Vercel
echo -e "\n\e[36m🚀 Deploying to Vercel...\e[0m"
echo "This will use the vercel CLI to deploy your project to production."
echo "Make sure you're logged into Vercel CLI before running this script."

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo -e "\e[32m✅ Vercel CLI is installed\e[0m"
    vercel --prod
    if [ $? -ne 0 ]; then
        echo -e "\e[31m❌ Vercel deployment failed.\e[0m"
        echo -e "\e[33mTry running 'npx vercel --prod' instead.\e[0m"
    else
        echo -e "\e[32m✅ Deployment initiated successfully!\e[0m"
    fi
else
    echo -e "\e[36mℹ️ Vercel CLI not found, using npx...\e[0m"
    npx vercel --prod
    if [ $? -ne 0 ]; then
        echo -e "\e[31m❌ Vercel deployment failed.\e[0m"
        echo -e "\e[33mPlease install Vercel CLI using 'npm install -g vercel' and try again.\e[0m"
    else
        echo -e "\e[32m✅ Deployment initiated successfully!\e[0m"
    fi
fi

# Step 5: Instructions for verifying the deployment
echo -e "\n\e[36m📋 Next steps:\e[0m"
echo "1. Wait for the deployment to complete (check the Vercel dashboard)"
echo "2. Clear your browser cache completely (Ctrl+Shift+Delete)"
echo "3. Open your production site in an incognito/private window"
echo "4. Verify that the Reset Form button is now red"
echo "5. If you still see blue buttons, try running 'vercel --prod --force' to force a full rebuild"

echo -e "\n\e[36m✨ Force deployment process completed!\e[0m"
