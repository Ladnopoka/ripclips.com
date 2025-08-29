# RIP Clips Production Deployment Guide

## Overview
This comprehensive guide will walk you through deploying your RIP Clips web application to production using Vercel. This is your complete step-by-step handbook for your first production deployment.

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Code Preparation](#code-preparation)
5. [Vercel Account Setup](#vercel-account-setup)
6. [Domain Setup](#domain-setup)
7. [Deployment Process](#deployment-process)
8. [Environment Variables Configuration](#environment-variables-configuration)
9. [Domain Binding](#domain-binding)
10. [Firebase Production Setup](#firebase-production-setup)
11. [API Keys Configuration](#api-keys-configuration)
12. [Testing & Verification](#testing--verification)
13. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
14. [Monitoring & Logging](#monitoring--logging)
15. [Security Checklist](#security-checklist)
16. [Post-Deployment Tasks](#post-deployment-tasks)
17. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Project Requirements Analysis
Your RIP Clips application has the following components that need production setup:

- **Framework**: Next.js 15.5.0 with TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Vercel (recommended for Next.js)
- **External APIs**: Twitch API, YouTube Data API v3
- **Styling**: Tailwind CSS
- **Domain**: You'll need to purchase/configure your domain

---

## Environment Variables Setup

### Current Environment Variables
Your application uses these environment variables (found in `.env.example`):

```bash
# Firebase Configuration (Public - these are safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# API Secrets (Private - these must be secured)
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
YOUTUBE_API_KEY=
```

⚠️ **Critical Security Note**: Your `lib/firebase.js` currently has hardcoded Firebase config values. This needs to be changed before production.

---

## Firebase Configuration

### Step 1: Secure Firebase Configuration

**URGENT**: Your Firebase configuration is currently hardcoded in `lib/firebase.js`. This needs to be changed immediately.

1. **Update `lib/firebase.js`**:
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

### Step 2: Firebase Security Rules
Your Firestore rules look good for production. They properly restrict access based on authentication and admin roles.

### Step 3: Firebase Auth Domain Setup
You'll need to add your production domain to Firebase Auth:
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your production domain (e.g., `ripclips.com`, `www.ripclips.com`)

---

## Code Preparation

### URLs That Need Updating
Search for and replace these localhost references:

1. **In your authentication redirect URLs**:
   - Check `lib/useAuth.ts` for any localhost references
   - Update password reset email action URLs

2. **In API configurations**:
   - Twitch API OAuth redirect URLs
   - YouTube API referrer restrictions

### Required Code Changes Before Deployment:

1. **Update Password Reset URL in `lib/useAuth.ts`**:
```typescript
const actionCodeSettings = {
  url: `${window.location.origin}/auth/action?mode=resetPassword`,
  handleCodeInApp: false,
};
```

2. **Ensure all hardcoded localhost:3000 references are dynamic**

---

## Vercel Account Setup

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up using your GitHub account (recommended for automatic deployments)
3. Verify your email address

### Step 2: Install Vercel CLI (Optional but Recommended)
```bash
npm install -g vercel
```

---

## Domain Setup

### Option 1: Purchase Domain Through Vercel
1. Go to Vercel Dashboard → Domains
2. Search for your desired domain (e.g., `ripclips.com`)
3. Purchase through Vercel (they handle DNS automatically)
4. **Cost**: Typically $15-20/year for .com domains

### Option 2: Use External Domain Provider
1. Purchase domain from providers like:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Cloudflare
2. You'll need to configure DNS settings manually (covered later)

---

## Deployment Process

### Step 1: Push Code to GitHub
1. Ensure your code is in a GitHub repository
2. Make sure your `.env` files are in `.gitignore` (they should be)
3. Push all changes:
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select your RIP Clips repository

### Step 3: Configure Build Settings
Vercel will auto-detect Next.js. Verify these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Initial Deployment
1. Click "Deploy"
2. Vercel will assign a temporary URL like `ripclips-abc123.vercel.app`
3. **Don't visit the site yet** - it won't work without environment variables

---

## Environment Variables Configuration

### Step 1: Set Up Environment Variables in Vercel
1. Go to your project in Vercel Dashboard
2. Go to Settings → Environment Variables
3. Add each variable:

**Firebase Variables** (mark as "Production" and "Preview"):
- `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyDz8_rsF0WIGPp25mz4IkHPs7E9UPZftYE`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `ripclips-86abe.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `ripclips-86abe`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `ripclips-86abe.firebasestorage.app`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `505229440957`
- `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:505229440957:web:7dbda6c1afefb7fe3f44d4`

**API Keys** (mark as "Production" only - keep these secret):
- `TWITCH_CLIENT_ID` = [Your Twitch Client ID]
- `TWITCH_CLIENT_SECRET` = [Your Twitch Client Secret]
- `YOUTUBE_API_KEY` = [Your YouTube API Key]

### Step 2: Redeploy
After adding environment variables:
1. Go to Deployments tab
2. Click the three dots on latest deployment
3. Click "Redeploy"

---

## Domain Binding

### If You Bought Domain Through Vercel:
1. Go to Settings → Domains
2. Your domain should be automatically configured
3. Vercel handles SSL certificates automatically

### If You Have External Domain:
1. In Vercel: Settings → Domains → Add
2. Enter your domain (e.g., `ripclips.com`)
3. Vercel will show DNS configuration:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. In your domain registrar's DNS settings, add these records
5. Wait 24-48 hours for propagation

### SSL Certificate
- Vercel automatically provides SSL certificates
- Your site will be available at both `http://` and `https://`
- Set up redirect from HTTP to HTTPS

---

## Firebase Production Setup

### Step 1: Update Firebase Auth Domains
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ripclips-86abe`
3. Authentication → Settings → Authorized domains
4. Add your production domains:
   - `ripclips.com` (or your domain)
   - `www.ripclips.com`
   - Keep the `.vercel.app` domain for preview deployments

### Step 2: Update Firestore Security Rules
Your current rules are production-ready, but verify:
1. Go to Firestore Database → Rules
2. Ensure rules are published
3. Test with the Rules Playground

### Step 3: Firebase Hosting (Optional)
You don't need Firebase Hosting since you're using Vercel, but you can set up custom email templates:
1. Authentication → Templates → Email Templates
2. Customize password reset emails to match your branding

---

## API Keys Configuration

### Twitch API Setup
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. Find your existing app or create new one
3. **OAuth Redirect URLs** - Add:
   - `https://yourdomain.com` (replace with your actual domain)
   - `https://www.yourdomain.com`
   - Keep `http://localhost:3000` for development
4. Copy Client ID and Client Secret to Vercel environment variables

### YouTube API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project or create new one
3. Enable YouTube Data API v3
4. Create/Edit API Key
5. **Application restrictions**:
   - HTTP referrers
   - Add: `https://yourdomain.com/*`
   - Add: `https://www.yourdomain.com/*`
6. **API restrictions**:
   - Restrict to YouTube Data API v3

---

## Testing & Verification

### Step 1: Basic Functionality Test
1. Visit your production URL
2. Test core features:
   - Homepage loads
   - User registration works
   - Login/logout functions
   - Password reset emails
   - Clip submission (test with sample Twitch/YouTube URLs)

### Step 2: API Integration Test
1. Test Twitch metadata extraction
2. Test YouTube metadata extraction
3. Verify Firebase database writes
4. Test authentication flows

### Step 3: Mobile Responsiveness
1. Test on various devices
2. Use browser dev tools to simulate different screen sizes

### Step 4: Performance Test
1. Use Google PageSpeed Insights
2. Check Vercel Analytics
3. Monitor loading times

---

## CI/CD Pipeline Setup

### Automatic Deployments (Recommended)
Vercel automatically sets up CI/CD when connected to GitHub:

1. **Production Deployments**:
   - Triggered by pushes to `main` branch
   - Uses production environment variables
   - Deployed to your custom domain

2. **Preview Deployments**:
   - Triggered by pull requests
   - Uses preview environment variables
   - Gets unique URL like `ripclips-git-feature-branch.vercel.app`

### Branch Protection Setup
1. Go to GitHub → Your Repository → Settings → Branches
2. Add rule for `main` branch
3. Enable "Require pull request reviews"
4. Enable "Require status checks to pass"

### Custom Deploy Hooks
For advanced workflows, you can create deploy hooks:
1. Vercel Dashboard → Settings → Git → Deploy Hooks
2. Create webhook URL for specific branches
3. Use in external CI/CD systems

---

## Monitoring & Logging

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor:
   - Page views
   - Performance metrics
   - Core Web Vitals
   - Geographic distribution

### Error Tracking
Set up error tracking with Sentry (recommended):

1. **Install Sentry**:
```bash
npm install @sentry/nextjs
```

2. **Configure Sentry**:
Create `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

3. **Add Sentry DSN to environment variables**

### Firebase Monitoring
1. Go to Firebase Console → Monitoring
2. Set up alerts for:
   - Authentication errors
   - Database read/write spikes
   - Security rule violations

### Custom Logging
Implement structured logging:
```javascript
// lib/logger.js
export const log = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to monitoring service
  }
};
```

---

## Security Checklist

### Pre-Launch Security Audit
- [ ] All API keys moved to environment variables
- [ ] Firebase config uses environment variables
- [ ] No sensitive data in client-side code
- [ ] Firestore rules properly restrict access
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Content Security Policy headers set
- [ ] Rate limiting implemented (consider Vercel Edge Config)

### Security Headers
Add to `next.config.ts`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

### Firebase Security
1. Enable App Check for Firebase
2. Set up monitoring alerts
3. Regularly review authentication logs
4. Monitor Firestore usage quotas

---

## Post-Deployment Tasks

### Step 1: DNS and Email Setup
1. Set up email forwarding for your domain
2. Consider setting up Google Workspace or similar
3. Set up contact forms if needed

### Step 2: SEO Setup
1. Add `robots.txt` in `public/` folder:
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

2. Add sitemap generation
3. Set up Google Analytics
4. Submit to Google Search Console

### Step 3: Backup Strategy
1. Set up Firebase project exports
2. Regular database backups
3. Code repository backup (GitHub handles this)

### Step 4: Performance Optimization
1. Enable Vercel Edge Caching
2. Optimize images (use Next.js Image component)
3. Enable compression
4. Monitor Core Web Vitals

---

## Troubleshooting

### Common Issues and Solutions

**1. "Firebase Config Error"**
- Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check for typos in environment variable names
- Redeploy after adding variables

**2. "Authentication Not Working"**
- Verify production domain is added to Firebase Auth
- Check password reset email templates
- Ensure auth cookies are set correctly

**3. "API Calls Failing"**
- Verify API keys are set as environment variables
- Check API key restrictions (domain/referrer)
- Monitor API usage quotas

**4. "Database Permission Denied"**
- Review Firestore security rules
- Check user authentication status
- Verify admin email addresses in rules

**5. "Site Not Loading"**
- Check DNS propagation (use dig or nslookup)
- Verify domain is correctly added in Vercel
- Check SSL certificate status

### Debug Tools
1. Vercel Dashboard → Functions → Logs
2. Browser Developer Tools → Network tab
3. Firebase Console → Monitoring
4. Google Search Console → Coverage

---

## Cost Estimation

### Monthly Costs Breakdown:
- **Domain**: $1-2/month (.com domain)
- **Vercel Pro** (if needed): $20/month (includes analytics, better support)
- **Firebase Blaze Plan**: Pay-as-you-go (likely $0-5/month for small scale)
- **Total Estimated**: $21-27/month

### Free Tier Limits:
- **Vercel**: 100GB bandwidth, 6,000 function executions
- **Firebase**: 1 GB storage, 50K reads/day, 20K writes/day
- Your app should stay within free tiers initially

---

## Maintenance Schedule

### Daily:
- Monitor error logs
- Check uptime status

### Weekly:
- Review analytics data
- Check database usage
- Monitor API quotas

### Monthly:
- Update dependencies
- Review security logs
- Performance audit

### Quarterly:
- Security audit
- Backup verification
- Cost optimization review

---

## Emergency Procedures

### Site Down Emergency:
1. Check Vercel status page
2. Review recent deployments
3. Rollback to previous version if needed
4. Check domain DNS settings

### Security Incident:
1. Immediately rotate all API keys
2. Check Firebase auth logs
3. Review unusual database activity
4. Update security rules if needed

### Data Loss Prevention:
1. Firebase auto-backups are enabled
2. Export data regularly
3. Version control for all code
4. Document all configuration changes

---

## Success Checklist

Before going live, verify:
- [ ] Site loads on your custom domain
- [ ] HTTPS is working (green lock icon)
- [ ] User registration/login works
- [ ] Password reset emails arrive
- [ ] Clip submission works with Twitch/YouTube URLs
- [ ] Admin panel accessible (for ladnopokaa@gmail.com, ivanovworkbusiness@gmail.com)
- [ ] Mobile responsive design works
- [ ] All pages load without errors
- [ ] Firebase database reads/writes function
- [ ] API integrations working (Twitch, YouTube)

---

## Final Notes

This deployment process should take 4-6 hours total, including:
- 1 hour: Code preparation and security fixes
- 2 hours: Domain and Vercel setup
- 1 hour: Environment variables and API configuration
- 2 hours: Testing and verification

Remember:
1. **Test thoroughly** before announcing your site
2. **Monitor closely** for the first few days after launch
3. **Document any changes** you make to this setup
4. **Keep all passwords and API keys secure**

Your RIP Clips application is well-structured and ready for production. The main changes needed are moving from hardcoded Firebase config to environment variables and setting up your domain properly.

Good luck with your first production deployment! 🚀

---

*Last updated: [Current Date]*
*Version: 1.0*