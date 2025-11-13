# AWS Amplify + Cloudflare DNS Deployment Guide

Complete guide for deploying SwiftMind Systems website to AWS Amplify with Cloudflare DNS.

## Prerequisites ✅

- ✅ AWS CLI configured (Version: 2.27.61)
- ✅ AWS Account: 168787218791
- ✅ Domain: swiftmindsystems.com (on Cloudflare)
- ✅ GitHub Repository: https://github.com/yancheng0821/swiftmind-systems

## Step 1: Create Amplify App via AWS Console

Since AWS CLI doesn't fully support Amplify app creation with GitHub OAuth, we'll use the console for initial setup:

### Option A: AWS Console (Recommended - Easier)

1. **Go to AWS Amplify Console**
   ```bash
   # Open in browser
   open https://console.aws.amazon.com/amplify/home
   ```

2. **Create New App**
   - Click "New app" → "Host web app"
   - Select "GitHub"
   - Authorize GitHub (one-time)
   - Repository: `yancheng0821/swiftmind-systems`
   - Branch: `main`
   - App name: `swiftmind-systems`

3. **Build Settings** (Auto-detected from amplify.yml)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Next" → "Save and deploy"

4. **Wait for Deployment** (5-10 minutes)
   - You'll get a URL like: `https://main.d1234abcd.amplifyapp.com`
   - Note this URL for testing

### Option B: AWS CLI (Advanced)

If you prefer CLI after console setup:

```bash
# List Amplify apps
aws amplify list-apps --region us-east-1

# Get app details
aws amplify get-app --app-id YOUR_APP_ID --region us-east-1
```

## Step 2: Add Custom Domain to Amplify

### Via AWS Console

1. **In Amplify Console**
   - Go to your app
   - Click "Domain management" in left sidebar
   - Click "Add domain"

2. **Enter Domain**
   - Domain: `swiftmindsystems.com`
   - Click "Configure domain"

3. **Select Subdomains**
   - ✅ Root domain (swiftmindsystems.com)
   - ✅ www subdomain (www.swiftmindsystems.com)
   - Click "Save"

4. **Get DNS Records**

   Amplify will show you records like:

   ```
   For Root Domain (@):
   Type: CNAME
   Name: swiftmindsystems.com
   Value: d1234abcd.cloudfront.net
   Proxy: NO (DNS only)

   For WWW:
   Type: CNAME
   Name: www
   Value: d1234abcd.cloudfront.net
   Proxy: NO (DNS only)

   For SSL Verification:
   Type: CNAME
   Name: _acm-challenge.swiftmindsystems.com
   Value: _abc123.xyz.acm-validations.aws.
   Proxy: NO (DNS only)
   ```

   **⚠️ IMPORTANT: Copy these values - you'll need them for Cloudflare**

### Via AWS CLI

```bash
# Add domain to Amplify app
aws amplify create-domain-association \
  --app-id YOUR_APP_ID \
  --domain-name swiftmindsystems.com \
  --sub-domain-settings "prefix=,branchName=main" "prefix=www,branchName=main" \
  --region us-east-1

# Get domain status
aws amplify get-domain-association \
  --app-id YOUR_APP_ID \
  --domain-name swiftmindsystems.com \
  --region us-east-1
```

## Step 3: Configure DNS in Cloudflare

### Important Cloudflare Settings

**⚠️ CRITICAL: Disable Cloudflare Proxy for Amplify DNS records**
- Amplify manages its own CDN/SSL
- Cloudflare proxy will conflict with Amplify SSL
- Set all Amplify records to "DNS only" (gray cloud ☁️, not orange 🟠)

### DNS Configuration Steps

1. **Login to Cloudflare Dashboard**
   ```bash
   # Open in browser
   open https://dash.cloudflare.com/
   ```

2. **Select Your Domain**
   - Click on `swiftmindsystems.com`
   - Go to "DNS" → "Records"

3. **Add Root Domain CNAME**

   **Option A: If Cloudflare supports CNAME flattening (recommended)**
   ```
   Type: CNAME
   Name: @  (or swiftmindsystems.com)
   Target: [Your Amplify CloudFront domain from Step 2]
   Proxy status: DNS only (gray cloud ☁️)
   TTL: Auto
   ```

   **Option B: If CNAME not allowed for root**

   You'll need to use A records pointing to Amplify IPs. Get IPs with:
   ```bash
   dig [your-amplify-cloudfront-domain] A +short
   ```

   Then add multiple A records:
   ```
   Type: A
   Name: @
   IPv4 address: [IP from dig command]
   Proxy status: DNS only
   TTL: Auto
   ```

4. **Add WWW Subdomain CNAME**
   ```
   Type: CNAME
   Name: www
   Target: [Your Amplify CloudFront domain from Step 2]
   Proxy status: DNS only (gray cloud ☁️)
   TTL: Auto
   ```

5. **Add SSL Verification CNAME**
   ```
   Type: CNAME
   Name: _acm-challenge
   Target: [ACM verification value from Step 2]
   Proxy status: DNS only (gray cloud ☁️)
   TTL: Auto
   ```

6. **Remove Conflicting Records**
   - Delete any existing A/CNAME records for @ and www
   - Keep only the new Amplify records

### Example Cloudflare DNS Configuration

After configuration, your DNS records should look like:

| Type  | Name           | Content                        | Proxy Status |
|-------|----------------|--------------------------------|--------------|
| CNAME | @              | d1234abcd.cloudfront.net       | DNS only ☁️  |
| CNAME | www            | d1234abcd.cloudfront.net       | DNS only ☁️  |
| CNAME | _acm-challenge | _abc.xyz.acm-validations.aws.  | DNS only ☁️  |

## Step 4: Configure SSL/TLS Settings in Cloudflare

1. **Go to SSL/TLS Settings**
   - In Cloudflare dashboard
   - SSL/TLS → Overview

2. **Set Encryption Mode**
   - Select: **"Full (strict)"** or **"Off"**
   - Recommended: **"Off"** (let Amplify handle SSL entirely)

3. **Disable Automatic HTTPS Rewrites** (Optional but recommended)
   - SSL/TLS → Edge Certificates
   - Toggle OFF "Always Use HTTPS" if causing issues
   - Toggle OFF "Automatic HTTPS Rewrites" if causing issues

## Step 5: Verify Deployment

### Check DNS Propagation

```bash
# Check root domain
dig swiftmindsystems.com

# Check www subdomain
dig www.swiftmindsystems.com

# Check if pointing to CloudFront
dig swiftmindsystems.com CNAME +short
```

### Check SSL Certificate

```bash
# Test SSL certificate
curl -vI https://swiftmindsystems.com 2>&1 | grep -i "ssl\|certificate"
```

### Check in Amplify Console

1. Go to Amplify Console → Domain management
2. Wait for status to change from "Pending" to "Available"
3. SSL certificate status should be "Issued"

### Test Website

```bash
# Test root domain
open https://swiftmindsystems.com

# Test www subdomain
open https://www.swiftmindsystems.com
```

## Step 6: Configure WWW Redirect (Optional)

To redirect www to non-www (or vice versa):

1. **In Amplify Console**
   - App Settings → Rewrites and redirects
   - Add redirect rule

2. **Redirect www to non-www:**
   ```
   Source: https://www.swiftmindsystems.com/<*>
   Target: https://swiftmindsystems.com/<*>
   Type: 301 (Permanent Redirect)
   ```

3. **Or redirect non-www to www:**
   ```
   Source: https://swiftmindsystems.com/<*>
   Target: https://www.swiftmindsystems.com/<*>
   Type: 301 (Permanent Redirect)
   ```

## Common Issues & Solutions

### Issue 1: SSL Certificate Stuck on "Pending"

**Cause:** DNS not configured correctly or Cloudflare proxy enabled

**Solution:**
1. Verify all DNS records in Cloudflare are "DNS only" (gray cloud)
2. Check _acm-challenge CNAME record is correct
3. Wait up to 48 hours for DNS propagation
4. Remove and re-add domain in Amplify if stuck >48 hours

### Issue 2: "Too Many Redirects" Error

**Cause:** Cloudflare SSL/TLS mode conflicts with Amplify

**Solution:**
1. In Cloudflare: SSL/TLS → Overview
2. Change to "Full (strict)" or "Off"
3. Clear browser cache
4. Wait 5-10 minutes

### Issue 3: DNS Not Resolving

**Cause:** DNS propagation delay or incorrect records

**Solution:**
```bash
# Check current DNS
dig swiftmindsystems.com +trace

# Flush DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Wait 5-60 minutes for propagation
```

### Issue 4: Cloudflare Proxy Causing Issues

**Cause:** Orange cloud (🟠) enabled on DNS records

**Solution:**
1. Go to Cloudflare DNS settings
2. Click orange cloud on each Amplify record to make it gray ☁️
3. Save changes
4. Wait 5 minutes

## Quick Troubleshooting Commands

```bash
# Check DNS resolution
nslookup swiftmindsystems.com
nslookup www.swiftmindsystems.com

# Check if HTTPS works
curl -I https://swiftmindsystems.com

# Check certificate
openssl s_client -connect swiftmindsystems.com:443 -servername swiftmindsystems.com < /dev/null

# Check Cloudflare status
curl -I https://swiftmindsystems.com | grep -i cf-

# Test from different DNS
dig swiftmindsystems.com @8.8.8.8
dig swiftmindsystems.com @1.1.1.1
```

## Expected Timeline

- ✅ Amplify app creation: 5-10 minutes
- ✅ First deployment: 5-10 minutes
- ⏱️ DNS propagation: 5 minutes - 48 hours (usually < 1 hour)
- ⏱️ SSL certificate issuance: 5 minutes - 2 hours
- ✅ **Total time:** Usually 20-60 minutes

## Monitoring & Maintenance

### Check Amplify Build Status
```bash
aws amplify list-jobs \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --region us-east-1
```

### View Build Logs
Go to Amplify Console → [Your App] → Build history

### Auto Deployment
- Every `git push` to `main` branch triggers automatic deployment
- Build takes ~3-5 minutes
- Live site updates automatically

## Cost Estimate

**Cloudflare:**
- Free Plan: $0/month (sufficient for most sites)
- DNS hosting: Free

**AWS Amplify:**
- First 12 months free tier:
  - 1000 build minutes/month
  - 15 GB data transfer/month
  - 5 GB storage
- After free tier: ~$1-5/month for small site

**Total: $0-5/month**

## Security Best Practices

✅ Already implemented in `amplify.yml`:
- HTTPS enforced (HSTS header)
- XSS protection
- Clickjacking protection
- Content type sniffing protection

## Cloudflare Additional Features (Optional)

If you enable Cloudflare proxy later:
- Page Rules for caching
- Rate limiting
- DDoS protection
- Web Application Firewall (WAF)

**Note:** Only enable after Amplify domain is fully working

## Quick Reference

**Your Configuration:**
- Domain: swiftmindsystems.com
- DNS Provider: Cloudflare (maria.ns.cloudflare.com, porter.ns.cloudflare.com)
- Hosting: AWS Amplify
- Region: us-east-1
- GitHub: yancheng0821/swiftmind-systems
- Branch: main

## Next Steps After Deployment

1. ✅ Test website: https://swiftmindsystems.com
2. ✅ Test www redirect: https://www.swiftmindsystems.com
3. 📧 Update email DNS records if needed (MX records)
4. 📊 Set up AWS CloudWatch monitoring (optional)
5. 🔍 Add Google Analytics (optional)
6. 🗺️ Submit sitemap to Google Search Console (optional)

---

## Need Help?

**Amplify Issues:**
- Check build logs in Amplify Console
- AWS Support: https://console.aws.amazon.com/support/

**Cloudflare Issues:**
- Cloudflare Support: https://support.cloudflare.com/
- Community: https://community.cloudflare.com/

**DNS Issues:**
- Use: https://dnschecker.org/ to check propagation
- Wait 24-48 hours before escalating

---

🎉 **Deployment Complete!**

Your website will be live at:
- https://swiftmindsystems.com
- https://www.swiftmindsystems.com

With:
- ✅ Global CDN (AWS CloudFront)
- ✅ Automatic HTTPS
- ✅ Continuous deployment from GitHub
- ✅ Cloudflare DNS management
