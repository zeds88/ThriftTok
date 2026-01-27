# ✅ ThriftTok Deployment Checklist

Use this checklist to ensure everything is configured correctly before launch.

---

## 🔑 Pre-Deployment: API Keys Setup

### Twilio
- [ ] Account created at [twilio.com](https://twilio.com)
- [ ] Phone number purchased ($1/month)
- [ ] Account SID copied: `AC...`
- [ ] Auth Token copied: `...`
- [ ] Phone number format: `+15125551234`

### Stripe
- [ ] Account created at [stripe.com](https://stripe.com)
- [ ] Secret Key copied: `sk_test_...` or `sk_live_...`
- [ ] **Option A**: Payment Link created and URL saved
- [ ] **Option B**: Webhook endpoint planned (set up after deployment)

### Anthropic
- [ ] Account created at [console.anthropic.com](https://console.anthropic.com)
- [ ] API Key copied: `sk-ant-...`
- [ ] Free credits confirmed ($5 = ~50 analyses)

---

## 📝 Pre-Deployment: Code Preparation

### Environment Variables
- [ ] Copied `.env.example` to `.env`
- [ ] Filled in `TWILIO_ACCOUNT_SID`
- [ ] Filled in `TWILIO_AUTH_TOKEN`
- [ ] Filled in `TWILIO_PHONE_NUMBER`
- [ ] Filled in `STRIPE_SECRET_KEY`
- [ ] Filled in `ANTHROPIC_API_KEY`
- [ ] Set `ADMIN_PHONE` to your number
- [ ] Set `PORT=3000`
- [ ] Set `NODE_ENV=production`

### Git Repository
- [ ] Initialized git: `git init`
- [ ] Added files: `git add .`
- [ ] Created commit: `git commit -m "Initial commit"`
- [ ] Pushed to GitHub (private repo recommended)

---

## 🚀 Deployment: Railway Setup

### Railway Account
- [ ] Created account at [railway.app](https://railway.app)
- [ ] Verified email
- [ ] Free credits available ($5/month)

### Project Deployment
- [ ] Created new project
- [ ] Connected GitHub repository
- [ ] Railway detected Node.js automatically
- [ ] Initial deployment completed successfully
- [ ] Deployment status shows "Success" ✅

### Environment Variables (Railway)
- [ ] Clicked Variables → Raw Editor
- [ ] Pasted all environment variables
- [ ] **Updated BASE_URL** with Railway URL
- [ ] Triggered redeploy after BASE_URL update

### Domain Setup
- [ ] Generated Railway domain: `Settings → Generate Domain`
- [ ] Copied full URL: `https://your-app-production.up.railway.app`
- [ ] Updated `BASE_URL` variable with this URL
- [ ] Waited for redeploy to complete

---

## 🔗 Post-Deployment: Service Connections

### Twilio Webhook
- [ ] Opened [Twilio Console](https://console.twilio.com)
- [ ] Navigated to: Phone Numbers → Manage → Active Numbers
- [ ] Clicked your phone number
- [ ] Messaging Configuration → Webhook
- [ ] Set URL: `https://your-app.railway.app/sms`
- [ ] Set Method: `POST`
- [ ] Clicked Save

### Stripe Webhook (Optional but Recommended)
- [ ] Opened [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Navigated to: Developers → Webhooks
- [ ] Clicked: Add Endpoint
- [ ] Set URL: `https://your-app.railway.app/webhook/stripe`
- [ ] Selected Events: `checkout.session.completed`
- [ ] Copied Webhook Signing Secret: `whsec_...`
- [ ] Added to Railway variables: `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testing: Core Functionality

### Health Check
- [ ] Opened: `https://your-app.railway.app/health`
- [ ] Received JSON response with status: "ok"
- [ ] Stats show: `totalRequests: 0`

### Admin Dashboard
- [ ] Opened: `https://your-app.railway.app/admin`
- [ ] Dashboard loaded successfully
- [ ] Shows: Total Requests, Completed Analyses, Revenue

### End-to-End Test
- [ ] Sent SMS to Twilio number: `https://facebook.com/marketplace/item/123456`
- [ ] Received payment link within 5 seconds
- [ ] Clicked payment link, completed test payment
- [ ] Used test card: `4242 4242 4242 4242` (Stripe test mode)
- [ ] Replied: `PAID`
- [ ] Received: "Processing your analysis..." message
- [ ] Received analysis within 90 seconds
- [ ] Analysis format correct (VALUE, PROFIT, VERDICT, WHY)

### Command Testing
- [ ] Sent: `HELP` → Received help message
- [ ] Sent: `STATS` (from admin phone) → Received stats
- [ ] Sent: Random text → Received welcome message

---

## 🔍 Verification: Logs & Monitoring

### Railway Logs
- [ ] Opened: Deployments → Latest → Logs
- [ ] Verified server started: "ThriftTok SMS service running on port 3000"
- [ ] No error messages in startup logs
- [ ] Webhook events appear when SMS sent

### Twilio Logs
- [ ] Opened: [Twilio Console](https://console.twilio.com) → Monitor → Logs
- [ ] Incoming message logged
- [ ] Outgoing messages logged
- [ ] No error status codes (all 200 OK)

### Stripe Events
- [ ] Opened: Developers → Events
- [ ] Checkout session created event visible
- [ ] Payment succeeded event visible
- [ ] Webhook delivered successfully (if configured)

---

## 🎨 Landing Page Deployment

### Update Phone Number
- [ ] Opened `landing-page.html`
- [ ] Replaced `(512) 555-FLIP` with your real number
- [ ] Replaced all instances (appears 3x in file)
- [ ] Saved changes

### Deploy to Vercel
- [ ] Created [Vercel account](https://vercel.com)
- [ ] Created new project
- [ ] Uploaded `landing-page.html`
- [ ] Deployed successfully
- [ ] Tested: Opens on mobile
- [ ] Tested: Phone number clickable on mobile

---

## 🎬 Marketing: Content Preparation

### TikTok Videos
- [ ] Video 1 recorded: "The Saver" (saved from bad buy)
- [ ] Video 2 recorded: "The Winner" (found good deal)
- [ ] Video 3 recorded: "The Tutorial" (how to use)
- [ ] Videos edited with captions
- [ ] Hashtags prepared (#Reselling #ThriftFlip etc.)
- [ ] Link in bio updated with phone number

### Facebook Groups
- [ ] Joined 5+ reseller groups
- [ ] Posts written (vary slightly for each group)
- [ ] Ready to post at launch time

### Reddit Posts
- [ ] r/Flipping post written
- [ ] r/ThriftStoreHauls post written
- [ ] r/SideHustle post written
- [ ] Ready to post with time delays

### Twitter/X
- [ ] Launch thread written (5 tweets)
- [ ] Screenshots prepared
- [ ] Scheduled for 7pm CST

---

## 🔒 Security & Performance

### Security Checks
- [ ] All API keys in environment variables (not code)
- [ ] `.env` file in `.gitignore`
- [ ] No sensitive data logged
- [ ] Stripe webhook signature verification enabled
- [ ] Input validation working (URL validation)

### Performance Checks
- [ ] Health endpoint responds < 100ms
- [ ] Analysis completes < 90 seconds
- [ ] Railway resource usage < 50% (memory/CPU)
- [ ] No memory leaks after 10 test requests

---

## 💵 Payment Verification

### Stripe Configuration
- [ ] Live mode enabled (if launching for real money)
- [ ] Test mode working (for testing)
- [ ] Payment link works on mobile
- [ ] Payment completion triggers webhook
- [ ] Refund process understood

### Price Verification
- [ ] Product set to $2.00
- [ ] Stripe fee calculated correctly (~$0.36)
- [ ] Users see $2.00 on checkout
- [ ] Payment success returns to app

---

## 📊 Launch Day Preparation

### 2 Hours Before Launch
- [ ] All tests passing
- [ ] Railway showing "Operational"
- [ ] Phone number ready to receive high volume
- [ ] Admin dashboard open for monitoring
- [ ] Railway logs open
- [ ] Phone ready to respond to support questions

### Launch Time (7pm CST)
- [ ] Posted TikTok Video 1
- [ ] Posted TikTok Video 2
- [ ] Posted TikTok Video 3
- [ ] Posted to 5 Facebook groups
- [ ] Posted to 3 Reddit communities
- [ ] Tweeted launch thread
- [ ] Monitoring incoming requests

### First Hour After Launch
- [ ] Responding to comments
- [ ] Monitoring error rate
- [ ] Checking payment conversion
- [ ] Fixing any immediate issues
- [ ] Collecting initial feedback

---

## 🚨 Emergency Contacts & Backups

### Service Status Pages
- [ ] Bookmarked: [status.railway.app](https://status.railway.app)
- [ ] Bookmarked: [status.twilio.com](https://status.twilio.com)
- [ ] Bookmarked: [status.stripe.com](https://status.stripe.com)
- [ ] Bookmarked: [status.anthropic.com](https://status.anthropic.com)

### Backup Plan
- [ ] Know how to pause Twilio webhook
- [ ] Know how to refund Stripe payments
- [ ] Have Railway restart command ready
- [ ] Database backup process understood

---

## 📈 Success Criteria (Day 1)

### Minimum Success
- [ ] 5+ SMS received
- [ ] 1+ payment completed
- [ ] 1+ analysis delivered successfully
- [ ] 0 major errors/crashes
- [ ] Response time < 90 seconds average

### Target Success
- [ ] 20+ SMS received
- [ ] 5+ payments completed
- [ ] 5+ analyses delivered
- [ ] 1+ testimonial collected
- [ ] 1 TikTok > 1,000 views

### Exceptional Success
- [ ] 50+ SMS received
- [ ] 20+ payments completed
- [ ] 1 TikTok > 10,000 views
- [ ] 5+ testimonials
- [ ] Revenue > $40 (Day 1)

---

## ✅ Final Pre-Launch Checklist

**Read through this list ONE MORE TIME before posting your first TikTok:**

- [ ] ✅ Server deployed and operational
- [ ] ✅ Twilio webhook configured
- [ ] ✅ End-to-end test completed successfully
- [ ] ✅ Landing page live with correct phone number
- [ ] ✅ Marketing content ready to post
- [ ] ✅ Monitoring dashboard open
- [ ] ✅ Support plan in place
- [ ] ✅ Ready to respond to first customers

---

## 🎉 You're Ready to Launch!

Once every box is checked, you're ready to:

1. Post your TikTok videos
2. Share in Facebook groups
3. Post to Reddit
4. Monitor and respond
5. Collect testimonials
6. **Make money! 🚀**

**Go time is NOW.**

---

## 📞 Quick Reference

**Your Twilio Number**: `+15125551234` _(update this)_

**Railway App URL**: `https://your-app.up.railway.app` _(update this)_

**Landing Page URL**: `https://thrifttok.vercel.app` _(update this)_

**Admin Dashboard**: `https://your-app.up.railway.app/admin`

**Health Check**: `https://your-app.up.railway.app/health`

---

**Last updated**: Launch day
**Status**: Ready for deployment ✅
