# How to Run the Deployment Scripts

## Option 1: PowerShell Script (Windows)

1. Open PowerShell as Administrator
2. Navigate to your project directory:
   ```powershell
   cd "C:\Users\haydn\OneDrive\Documents\Development\Web\PARESS_AGENT_PORTAL\pa-real-estate-support-services"
   ```
3. Set the execution policy to allow the script to run:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
4. Run the PowerShell script:
   ```powershell
   .\force-deploy.ps1
   ```
5. Follow the prompts and instructions shown by the script

## Option 2: Bash Script (Unix/Linux/WSL)

1. Open Terminal or WSL (Windows Subsystem for Linux)
2. Navigate to your project directory:
   ```bash
   cd /path/to/pa-real-estate-support-services
   ```
   If using WSL, you might need to access your Windows drive:
   ```bash
   cd /mnt/c/Users/haydn/OneDrive/Documents/Development/Web/PARESS_AGENT_PORTAL/pa-real-estate-support-services
   ```
3. Make the script executable:
   ```bash
   chmod +x force-deploy.sh
   ```
4. Run the bash script:
   ```bash
   ./force-deploy.sh
   ```
5. Follow the prompts and instructions shown by the script

## Option 3: Manual Deployment Helper (Any OS)

1. Open a command prompt or terminal
2. Navigate to your project directory
3. Run the JavaScript file:
   ```
   node manual-deploy.js
   ```
4. This will create a `deployment-package` folder
5. Zip this folder and upload it directly to the Vercel dashboard:
   - Go to your Vercel dashboard
   - Select your project
   - Click "Deploy" or add a new deployment
   - Choose "Upload" and select your zipped file

## After Deployment

Regardless of which method you use:

1. Wait for the deployment to complete
2. Clear your browser cache or use an incognito window
3. Visit your production site and verify the reset button is now red

## Troubleshooting

If you encounter any issues, refer to the `VERCEL_DEPLOYMENT_TROUBLESHOOTING.md` file for detailed troubleshooting steps.
