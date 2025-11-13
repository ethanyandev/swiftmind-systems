# AWS Amplify Deployment Guide

Complete guide for deploying SwiftMind Systems website to AWS Amplify with custom domain.

## Prerequisites

- AWS Account
- GitHub repository with your code
- Custom domain name (e.g., swiftmindsystems.com)
- Domain DNS access (for DNS configuration)

## Step 1: Build Configuration

First, ensure your project has the correct build settings. Amplify will automatically detect these.

**Build Command:** `npm run build`
**Output Directory:** `dist`
**Node Version:** 20.x

These are already configured in your `package.json`.

## Step 2: Deploy to AWS Amplify

### Option A: Using AWS Console (Recommended)

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com/amplify/
   - Sign in to your AWS account

2. **Create New App**
   - Click "New app" → "Host web app"
   - Select "GitHub" as the repository service
   - Click "Connect branch"

3. **Authorize GitHub**
   - Authorize AWS Amplify to access your GitHub account
   - Select repository: `yancheng0821/swiftmind-systems`
   - Select branch: `main`
   - Click "Next"

4. **Configure Build Settings**

   Amplify should auto-detect the settings. Verify they match:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Advanced Settings**
   - App name: `swiftmind-systems`
   - Environment: `production`
   - Click "Next"

6. **Review and Deploy**
   - Review all settings
   - Click "Save and deploy"
   - Wait for deployment to complete (5-10 minutes)

7. **Access Your Site**
   - Once deployed, you'll get a URL like: `https://main.xxxxx.amplifyapp.com`
   - Test the website

### Option B: Using AWS CLI

1. **Install AWS CLI**
   ```bash
   # macOS
   brew install awscli

   # Configure AWS credentials
   aws configure
   ```

2. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

3. **Initialize Amplify**
   ```bash
   cd website
   amplify init
   ```

4. **Add Hosting**
   ```bash
   amplify add hosting
   # Select: Hosting with Amplify Console
   # Select: Manual deployment
   ```

5. **Deploy**
   ```bash
   amplify publish
   ```

## Step 3: Custom Domain Configuration

### If Domain is in Route 53

1. **Add Custom Domain**
   - In Amplify Console, go to your app
   - Click "Domain management" → "Add domain"
   - Select your domain from Route 53 dropdown
   - Select domain options:
     - ✅ swiftmindsystems.com
     - ✅ www.swiftmindsystems.com
   - Click "Configure domain"

2. **SSL Certificate**
   - Amplify automatically provisions SSL certificate
   - Wait for DNS verification (can take up to 48 hours, usually faster)

3. **Done!**
   - Your site will be available at your custom domain with HTTPS

### If Domain is External (GoDaddy, Namecheap, etc.)

1. **Add Custom Domain in Amplify**
   - In Amplify Console, go to your app
   - Click "Domain management" → "Add domain"
   - Enter your domain name manually
   - Click "Configure domain"

2. **Get DNS Records**

   Amplify will show you DNS records to add. Example:

   ```
   Type: CNAME
   Name: www
   Value: xxxxx.cloudfront.net

   Type: CNAME
   Name: @
   Value: xxxxx.amplifyapp.com

   Type: TXT (for SSL verification)
   Name: _amazonSSLVerification.swiftmindsystems.com
   Value: xxxxxxxxxxxxx
   ```

3. **Configure DNS at Your Domain Registrar**

   **For root domain (@):**
   - If registrar supports ALIAS/ANAME records:
     ```
     Type: ALIAS/ANAME
     Name: @
     Value: [amplify-provided-value]
     ```

   - If only CNAME supported, you may need to:
     - Point A record to Amplify IP (check Amplify docs)
     - Or use DNS provider that supports ALIAS

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: [amplify-provided-value]
   ```

   **For SSL verification:**
   ```
   Type: TXT
   Name: _amazonSSLVerification
   Value: [amplify-provided-value]
   ```

4. **Wait for DNS Propagation**
   - DNS changes can take 5 minutes to 48 hours
   - Check status in Amplify Console
   - SSL certificate will be automatically issued after verification

5. **Verify**
   - Visit https://swiftmindsystems.com
   - Visit https://www.swiftmindsystems.com
   - Both should work with HTTPS

## Step 4: Configure Redirects (Optional)

To redirect www to non-www (or vice versa):

1. **In Amplify Console**
   - Go to "Rewrites and redirects"
   - Add redirect rule

2. **Redirect www to non-www:**
   ```
   Source: https://www.swiftmindsystems.com
   Target: https://swiftmindsystems.com
   Type: 301 (Permanent Redirect)
   ```

3. **Or redirect non-www to www:**
   ```
   Source: https://swiftmindsystems.com
   Target: https://www.swiftmindsystems.com
   Type: 301 (Permanent Redirect)
   ```

## Step 5: Enable Continuous Deployment

Amplify automatically deploys when you push to GitHub:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```

2. **Automatic Build**
   - Amplify detects the push
   - Automatically runs build
   - Deploys to production
   - Updates your custom domain

## Environment Variables (If Needed)

If your app needs environment variables:

1. **In Amplify Console**
   - Go to "Environment variables"
   - Click "Manage variables"
   - Add variables:
     ```
     NODE_VERSION = 20
     ```

## Monitoring and Logs

1. **View Build Logs**
   - In Amplify Console
   - Click on a deployment
   - View "Provision", "Build", "Deploy" logs

2. **Access Logs**
   - Available in CloudWatch
   - Click "Monitoring" in Amplify Console

## Troubleshooting

### Build Fails

Check build logs in Amplify Console. Common issues:
- Node version mismatch → Set NODE_VERSION environment variable
- Missing dependencies → Check package.json
- Build command error → Verify build command

### DNS Not Working

- Wait 24-48 hours for DNS propagation
- Verify DNS records at your registrar
- Use `dig` or `nslookup` to check DNS:
  ```bash
  dig swiftmindsystems.com
  nslookup www.swiftmindsystems.com
  ```

### SSL Certificate Pending

- Ensure TXT records are added correctly
- Wait for verification (can take up to 48 hours)
- Check certificate status in Amplify Console

## Cost Estimate

AWS Amplify Free Tier (12 months):
- Build minutes: 1000 minutes/month free
- Hosting: 15 GB served/month free
- Storage: 5 GB/month free

After free tier:
- Build: $0.01 per build minute
- Hosting: $0.15 per GB served
- Storage: $0.023 per GB stored

**Estimated cost for small business website:** $0-5/month

## Performance Optimization

Your site is already optimized, but here are additional tips:

1. **Enable Compression**
   - Amplify enables Gzip/Brotli automatically

2. **Cache Control**
   - Add to `amplify.yml`:
     ```yaml
     customHeaders:
       - pattern: '**/*'
         headers:
           - key: 'Cache-Control'
             value: 'public, max-age=31536000, immutable'
     ```

3. **Image Optimization**
   - Consider WebP format for images
   - Compress images before uploading

## Backup and Rollback

1. **View All Deployments**
   - In Amplify Console, see all deployments

2. **Rollback**
   - Click on previous deployment
   - Click "Redeploy this version"

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Custom Domain Guide](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
- [Build Settings](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html)

## Support

For issues:
1. Check AWS Amplify documentation
2. Review build logs in Amplify Console
3. Contact AWS Support (if you have support plan)

---

**Deployment Checklist:**

- [ ] Code pushed to GitHub
- [ ] AWS Account created
- [ ] Amplify app created and connected to GitHub
- [ ] First deployment successful
- [ ] Test URL working
- [ ] Custom domain added in Amplify
- [ ] DNS records configured at registrar
- [ ] SSL certificate issued and verified
- [ ] Custom domain working with HTTPS
- [ ] www redirect configured (optional)
- [ ] Continuous deployment tested

---

🎉 Your website is now live on AWS with global CDN, automatic scaling, and HTTPS!
