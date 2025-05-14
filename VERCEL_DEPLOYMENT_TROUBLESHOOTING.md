# Vercel Deployment Troubleshooting Guide

## Common Issues & Solutions

### Issue: Changes visible in development but not in production

#### Possible Causes:

1. **Caching Issues**
   - Browser cache
   - Vercel edge cache
   - CDN cache

2. **Deployment Issues**
   - Changes not properly deployed
   - Previous deployment still active
   - Branch deployment conflict

3. **Build Configuration Issues**
   - Environment variables differences
   - Different build processes for dev vs production

#### Solutions:

1. **Clear All Caches**
   ```bash
   # Purge Vercel's cache
   vercel --prod --force
   
   # Clear browser cache or use incognito mode
   ```

2. **Force a Clean Rebuild & Deploy**
   - Run the `force-deploy.sh` (Unix) or `force-deploy.ps1` (Windows) script
   - This cleans up build artifacts and deploys a fresh build

3. **Check Environment Variables**
   - Ensure environment variables match between dev and production
   - Check `.env.local` vs `.env.production`

4. **Verify Build Output**
   ```bash
   # Build locally and check output
   npm run build
   
   # Inspect build output
   ls -la dist/
   ```

5. **Inspect Deployment Logs in Vercel Dashboard**
   - Check for any build or deployment errors
   - Verify that all files are being uploaded correctly

## Specific Issues

### Reset Form Button Color Difference

If the Reset Form button appears blue in production but red in development:

1. Verify the component code has the correct styling:
   ```tsx
   <Button 
     variant="outline" 
     size="sm"
     className="h-10 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
     onClick={() => setIsOpen(true)}
   >
     <RotateCcw className="w-4 h-4 mr-2" />
     Reset Form
   </Button>
   ```

2. Run a forced deployment:
   ```bash
   # Windows
   .\force-deploy.ps1
   
   # Unix
   ./force-deploy.sh
   ```

3. Access the site in an incognito/private window to avoid browser cache

## Preventative Measures

1. **Set Up Proper Version Control**
   - Maintain an up-to-date GitHub repository
   - Use branches for feature development
   - Configure automatic deployments

2. **Use a Consistent Build Process**
   - Ensure local, staging, and production builds follow the same process
   - Document any environment-specific configurations

3. **Implement Cache Busting**
   - Add cache busting to critical resources with hashes
   - Configure correct caching headers

4. **Monitor Deployments**
   - Check deployment logs after each deployment
   - Verify changes in production after deployment completes

## Commands Reference

```bash
# Deploy to production
vercel --prod

# Force deploy with cache invalidation
vercel --prod --force

# List recent deployments
vercel ls

# Remove old deployments
vercel rm [deployment-id]

# Promote a specific deployment to production
vercel promote [deployment-id]
```

## Getting Help

If you continue to experience deployment issues:

1. Check Vercel status: https://www.vercelstatus.com/
2. Review Vercel documentation: https://vercel.com/docs
3. Search issues on Vercel community: https://github.com/vercel/vercel/discussions
