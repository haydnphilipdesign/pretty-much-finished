# PowerShell Deployment script for pa-real-estate-support-services app

Write-Host "📦 Building and deploying application..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Print node and npm versions
Write-Host "Node version: $(node -v)"
Write-Host "NPM version: $(npm -v)"

# Verify API files exist in correct locations
Write-Host "`n🔍 Checking API files..." -ForegroundColor Cyan
$apiFiles = @("generate-pdf.js", "supabase-pdf-upload.js", "update-airtable-attachment.js")
foreach ($file in $apiFiles) {
    if (Test-Path "api/$file") {
        Write-Host "✅ Found api/$file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing api/$file" -ForegroundColor Red
    }
}

# Check vercel.json configuration
Write-Host "`n🔍 Checking vercel.json configuration..." -ForegroundColor Cyan
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json exists" -ForegroundColor Green
    $vercelContent = Get-Content "vercel.json" -Raw
    if ($vercelContent -match "functions") {
        Write-Host "✅ Functions section found" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing functions section" -ForegroundColor Red
    }
    if ($vercelContent -match "routes") {
        Write-Host "✅ Routes section found" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing routes section" -ForegroundColor Red
    }
} else {
    Write-Host "❌ vercel.json not found" -ForegroundColor Red
}

# Check .vercelignore
Write-Host "`n🔍 Checking .vercelignore..." -ForegroundColor Cyan
if (Test-Path ".vercelignore") {
    Write-Host "✅ .vercelignore exists" -ForegroundColor Green
    
    # Get content as an array of lines
    $vercelignoreLines = Get-Content ".vercelignore"
    
    foreach ($file in $apiFiles) {
        $filePath = "api/$file"
        $isExcluded = $false
        
        foreach ($line in $vercelignoreLines) {
            # Check if the line contains the file path and is not commented
            if ($line -eq $filePath) {
                $isExcluded = $true
                break
            }
        }
        
        if ($isExcluded) {
            Write-Host "⚠️ WARNING: $filePath is excluded in .vercelignore" -ForegroundColor Yellow
        } else {
            Write-Host "✅ $filePath is properly allowed" -ForegroundColor Green
        }
    }
} else {
    Write-Host "❌ .vercelignore not found" -ForegroundColor Red
}

# Deploy the application
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

# Check deployment status
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment initiated successfully!" -ForegroundColor Green
    Write-Host "Wait for deployment to complete, then run check-production-config.js to verify endpoints" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Deployment failed. Check the error messages above." -ForegroundColor Red
} 