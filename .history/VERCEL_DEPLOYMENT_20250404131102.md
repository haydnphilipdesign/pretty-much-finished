# Deploying to Vercel

This guide explains how to deploy the application to Vercel, including setup for both the client-side React app and server-side PDF generation functionality.

## Prerequisites

1. A Vercel account: [Sign up here](https://vercel.com/signup) if you don't have one
2. The Vercel CLI: Install with `npm install -g vercel`
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Project

The project has already been configured for Vercel deployment with:

- A `vercel.json` configuration file to define builds and routes
- API routes adapted to work as Vercel serverless functions
- Client components updated to handle Vercel's serverless function responses

### 2. Set Up Environment Variables

Before deploying, you'll need to make sure all environment variables are set up in Vercel:

1. Log in to your Vercel account
2. Create a new project or select your existing project
3. Go to the "Settings" tab
4. Select "Environment Variables"
5. Add all required environment variables:

```
# Airtable Configuration
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id
NEXT_PUBLIC_AIRTABLE_API_KEY=your_api_key
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@parealestatesupport.com
EMAIL_RECIPIENT=debbie@parealestatesupport.com
```

Also add any field ID environment variables starting with `VITE_AIRTABLE_`.

### 3. Deploy from Git

The easiest way to deploy to Vercel is directly from your Git repository:

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure your project:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `build`
   - Install Command: `npm install`
5. Click "Deploy"

### 4. Deploy from CLI (Alternative Method)

You can also deploy using the Vercel CLI:

1. Open your terminal
2. Navigate to your project directory
3. Run `vercel login` and follow the authentication steps
4. Run `vercel` to deploy
5. Follow the prompts to configure your project
6. Confirm your environment variables when prompted

### 5. Verify Your Deployment

After deployment:

1. Check the deployment logs for any errors
2. Test the application functionality:
   - Navigate to your application
   - Try generating a PDF cover sheet
   - Verify the email is sent correctly

## Important Notes About Vercel Deployment

### Serverless Function Limitations

Vercel serverless functions have some limitations you should be aware of:

1. **Execution Time**: Functions have a maximum execution time of 10 seconds on the Hobby plan (60 seconds on Pro plans). PDF generation might exceed this limit for complex documents.

2. **Memory**: Functions are limited to 1GB of memory on the Hobby plan (3GB on Pro plans).

3. **Temporary Storage**: Files created in `/tmp` are temporary and not persistent between function invocations. This is why we've configured the app to prioritize email delivery of PDFs rather than direct downloads.

4. **Cold Starts**: There might be a delay when functions haven't been used recently.

### Potential Solutions for Limitations

If you encounter issues with the serverless function limits:

1. **Upgrade to Pro Plan**: For longer execution times and higher memory limits
2. **Optimize PDF Generation**: Simplify templates or reduce image sizes
3. **Use External Storage**: Store generated PDFs in AWS S3 or similar service
4. **External Service**: Use a dedicated PDF generation service like DocRaptor

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs for specific errors
   - Make sure all dependencies are properly installed
   - Verify environment variables are set correctly

2. **Runtime Errors**:
   - Check function logs in the Vercel dashboard
   - May need to increase function timeout or memory limits (requires Pro plan)

3. **PDF Generation Issues**:
   - Puppeteer requires specific dependencies which are included in Vercel's Node.js environment
   - Complex PDF generation might exceed time limits

### Getting Help

If you encounter issues:
- Check Vercel documentation: https://vercel.com/docs
- Examine function logs in the Vercel dashboard
- Contact Vercel support for platform-specific issues 