# Force Deploy Script for Vercel
# This script ensures a clean deployment by clearing caches and rebuilding

Write-Host "🚀 Starting force deployment to Vercel..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Step 1: Clean the build artifacts
Write-Host "`n🧹 Cleaning build artifacts..." -ForegroundColor Cyan
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "✅ Removed dist folder" -ForegroundColor Green
}
if (Test-Path ".vercel/output") {
    Remove-Item -Path ".vercel/output" -Recurse -Force
    Write-Host "✅ Removed .vercel/output folder" -ForegroundColor Green
}
if (Test-Path "node_modules/.cache") {
    Remove-Item -Path "node_modules/.cache" -Recurse -Force
    Write-Host "✅ Removed node_modules/.cache folder" -ForegroundColor Green
}

# Step 2: Verify the current code state
Write-Host "`n🔍 Verifying current code state..." -ForegroundColor Cyan
$resetFormPath = "src/components/TransactionForm/ResetFormDialog.tsx"
if (Test-Path $resetFormPath) {
    $content = Get-Content $resetFormPath -Raw
    if ($content -match "text-red-600") {
        Write-Host "✅ Reset button has red styling in code" -ForegroundColor Green
    } else {
        Write-Host "❌ Reset button does NOT have red styling in code!" -ForegroundColor Red
        Write-Host "Please check and update the ResetFormDialog.tsx file" -ForegroundColor Yellow
        $continue = Read-Host "Do you want to continue anyway? (y/n)"
        if ($continue -ne "y") {
            Write-Host "Deployment aborted" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "❌ Cannot find ResetFormDialog.tsx file!" -ForegroundColor Red
    Write-Host "Please check the file path" -ForegroundColor Yellow
    exit 1
}

# Step 3: Build the project
Write-Host "`n🔨 Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Step 4: Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "This will use the vercel CLI to deploy your project to production."
Write-Host "Make sure you're logged into Vercel CLI before running this script."

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    # Command not found, do nothing
}

if ($vercelInstalled) {
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
    vercel --prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel deployment failed." -ForegroundColor Red
        Write-Host "Try running 'npx vercel --prod' instead." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Deployment initiated successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️ Vercel CLI not found, using npx..." -ForegroundColor Cyan
    npx vercel --prod
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel deployment failed." -ForegroundColor Red
        Write-Host "Please install Vercel CLI using 'npm install -g vercel' and try again." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Deployment initiated successfully!" -ForegroundColor Green
    }
}

# Step 5: Instructions for verifying the deployment
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait for the deployment to complete (check the Vercel dashboard)"
Write-Host "2. Clear your browser cache completely (Ctrl+Shift+Delete)"
Write-Host "3. Open your production site in an incognito/private window"
Write-Host "4. Verify that the Reset Form button is now red"
Write-Host "5. If you still see blue buttons, try running 'vercel --prod --force' to force a full rebuild"

Write-Host "`n✨ Force deployment process completed!" -ForegroundColor Cyan
