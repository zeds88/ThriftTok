# 🛍️ ThriftTok SMS - Marketplace Analysis Service

AI-powered Facebook Marketplace listing analyzer via SMS. Users text a link, pay $2, and receive instant profit analysis.

## 🚀 Quick Start (12-Hour Launch Plan)

### Prerequisites
- Node.js 18+
- Accounts needed:
  - [Twilio](https://twilio.com) - SMS service
  - [Stripe](https://stripe.com) - Payments
  - [Anthropic](https://console.anthropic.com) - Claude API
  - [Railway](https://railway.app) or [Render](https://render.com) - Hosting

---

## ⚙️ Setup Instructions

### 1. Twilio Setup (10 minutes)

1. **Create account** at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Buy a phone number**:
   - Console → Phone Numbers → Buy a Number
   - Choose a number with SMS capability ($1/month)
   - Save this number
3. **Get credentials**:
   - Dashboard → Account Info
   - Copy `Account SID` and `Auth Token`
4. **Configure webhook** (do this AFTER deployment):
   - Phone Numbers → Your Number → Messaging Configuration
   - Webhook URL: `https://your-app.railway.app/sms`
   - Method: POST

### 2. Stripe Setup (10 minutes)

**Option A: Payment Links (Easier)**
1. Dashboard → Products → Add Product
2. Name: "ThriftTok Analysis", Price: $2.00
3. Create → Generate Payment Link
4. Copy link URL → Use as `STRIPE_PAYMENT_LINK` in .env

**Option B: Checkout Sessions (More Flexible)**
1. Dashboard → Developers → API Keys
2. Copy `Secret Key` (sk_test_...)
3. For webhooks:
   - Developers → Webhooks → Add Endpoint
   - URL: `https://your-app.railway.app/webhook/stripe`
   - Events: `checkout.session.completed`
   - Copy signing secret

### 3. Anthropic Setup (2 minutes)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Copy the API key (sk-ant-...)

### 4. Deploy to Railway (15 minutes)

1. **Create Railway account**: [railway.app](https://railway.app)

2. **Deploy from GitHub**:
   ```bash
   # Initialize git repo
   cd thrifttok-sms
   git init
   git add .
   git commit -m "Initial commit"

   # Push to GitHub
   gh repo create thrifttok-sms --private --source=. --push
   ```

3. **Connect Railway**:
   - New Project → Deploy from GitHub
   - Select `thrifttok-sms` repo
   - Railway auto-detects Node.js

4. **Add environment variables**:
   - Project → Variables → Raw Editor
   - Paste all values from `.env.example`
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=+15125551234
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ANTHROPIC_API_KEY=sk-ant-...
   PORT=3000
   NODE_ENV=production
   BASE_URL=https://thrifttok-sms-production.up.railway.app
   ADMIN_PHONE=+15125551234
   ```

5. **Deploy**:
   - Railway deploys automatically
   - Check Deployments tab for URL
   - Verify at `https://your-app.railway.app/health`

6. **Configure Twilio webhook** (now that you have the URL):
   - Go back to Twilio console
   - Set webhook: `https://your-app.railway.app/sms`

### Alternative: Deploy to Render

```bash
# Connect Render to your GitHub repo
# Add environment variables in dashboard
# Render builds automatically
```

---

## 📱 User Flow

1. **User texts Marketplace link**:
   ```
   https://facebook.com/marketplace/item/123456
   ```

2. **Bot responds with payment**:
   ```
   ThriftTok Analysis: $2.00

   📦 Item queued for analysis

   Pay here:
   https://checkout.stripe.com/...

   After payment, reply PAID to get your analysis.
   ```

3. **User pays & replies**:
   ```
   PAID
   ```

4. **Bot analyzes & responds**:
   ```
   Processing your analysis... This takes about 60 seconds. ⏳

   VALUE: $45-$65
   PROFIT: $30-$50 (200%)
   CONDITION: Minor wear on sleeves, logo intact
   VERDICT: BUY
   WHY: High-demand vintage item with 3x markup potential

   ✨ ThriftTok • thrifttok.com
   ```

---

## 🧪 Testing Locally

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example and fill in)
cp .env.example .env

# Run server
npm start

# Test with curl (simulating Twilio webhook)
curl -X POST http://localhost:3000/sms \
  -d "From=+15125551234" \
  -d "Body=https://facebook.com/marketplace/item/123"
```

---

## 📊 Monitoring

### Health Check
```bash
curl https://your-app.railway.app/health
```

### Admin Dashboard
Visit: `https://your-app.railway.app/admin`

Shows:
- Total requests
- Completed analyses
- Revenue
- System status

### Stats via SMS
Text `STATS` from admin phone to get:
```
ThriftTok Stats:
Total: 47
Completed: 42
Revenue: $84
```

---

## 💰 Cost Breakdown (Per Transaction)

| Service | Cost | Notes |
|---------|------|-------|
| Twilio (receive) | $0.0075 | Per incoming SMS |
| Twilio (send) | $0.0158 | 2 messages @ $0.0079 each |
| Stripe | $0.36 | $0.30 + 2.9% of $2 |
| Claude API | $0.10 | ~1000 tokens avg |
| Puppeteer | $0.01 | Server compute |
| **Total Cost** | **$0.53** | |
| **Revenue** | **$2.00** | |
| **Profit** | **$1.47** | **73.5% margin** |

Monthly fixed costs:
- Twilio phone: $1
- Railway: $5 (free tier covers ~100 req/month)
- Domain (optional): $12/year

---

## 🐛 Troubleshooting

### "Scraping failed"
- Facebook changed their HTML structure
- Update selectors in `scraper.js`
- Check if URL is valid Marketplace link

### "Payment not detected"
- Ensure Stripe webhook is configured
- Check webhook signing secret matches
- Verify webhook endpoint is accessible

### "SMS not sending"
- Verify Twilio credentials
- Check phone number format (+1...)
- Ensure webhook URL is set correctly

### "Analysis timeout"
- Puppeteer might need more resources
- Increase Railway plan for more RAM
- Or use [Browserless.io](https://browserless.io) ($10/mo)

---

## 🔒 Security Considerations

**Implemented**:
- ✅ Environment variables for secrets
- ✅ Stripe webhook signature verification
- ✅ Input validation on URLs
- ✅ Error handling & graceful failures
- ✅ No user data stored except phone/URL

**Recommendations**:
- Use Stripe webhooks instead of "PAID" confirmation (prevents fraud)
- Add rate limiting (1 request per minute per phone)
- Implement retry logic for failed analyses
- Add automated refunds for errors

---

## 📈 Scaling Checklist

### Week 1: Validate (10-50 requests/day)
- ✅ Monitor error rates
- ✅ Collect user feedback
- ✅ Test edge cases

### Week 2: Optimize (50-200 requests/day)
- [ ] Add caching for common items
- [ ] Batch eBay comparables requests
- [ ] Optimize prompt for token usage
- [ ] Switch to cheaper Claude model if accurate

### Week 3: Automate (200-500 requests/day)
- [ ] Remove "PAID" step (use webhook only)
- [ ] Add saved payment methods
- [ ] Offer subscription ($50/month unlimited)
- [ ] Implement referral system

### Month 2: Build App
- [ ] Use revenue to fund React Native app
- [ ] Keep SMS version as fallback
- [ ] Cross-promote to SMS users

---

## 🚀 Marketing Launch (Hours 11-12)

### TikTok (Critical)

**Record 3 videos TODAY**:

**Video 1 - The Hook**:
```
[Screen record iPhone]
"Is this $15 hoodie actually worth it?"
[Show Marketplace listing]
[Text link to ThriftTok number]
[Show response: VALUE: $45-65, BUY]
[Cut to: Buying item IRL]
[Cut to: eBay sold for $58]
"Made $43 in 2 hours"

CTA: Text any link to [your number]
Link in bio

#Reselling #ThriftFlip #SideHustle
```

**Video 2 - Avoid Trash**:
```
"This looked like a $200 vintage jacket..."
[Show listing]
[ThriftTok analysis: VALUE: $10-15, PASS]
"ThriftTok saved me $185"

#Reseller #ThriftTok
```

**Video 3 - Tutorial**:
```
"How to never buy trash again"
1. Find Marketplace item
2. Copy link
3. Text to [number]
4. Pay $2
5. Get instant analysis

"$2 to avoid $100 mistakes"
```

Post at 7pm CST (peak engagement).

### Facebook Groups (15 min)

Join & post in:
- Facebook Marketplace Resellers
- Thrift Store Flippers
- Side Hustle Nation
- [Your City] Buy/Sell/Trade

**Post template**:
> Built a tool for fellow resellers - text any Marketplace link to [number] and get instant value estimate + profit calc. $2 per check, results in 60 seconds. No app needed.
>
> Already saved me from buying fake vintage worth $10 that seller wanted $150 for 😅

### Reddit (10 min)

- r/Flipping
- r/ThriftStoreHauls
- r/SideHustle

**Post**:
> [Tool] SMS-based Marketplace analyzer - $2 per check
>
> Text any FB Marketplace URL, get AI analysis in 60 seconds:
> - Estimated value
> - Profit potential
> - Buy/negotiate/pass recommendation
>
> No app, no signup. Just text → pay → results.
>
> Text: [your number]

---

## 📁 Project Structure

```
thrifttok-sms/
├── server.js           # Main Express server & SMS webhook
├── database.js         # SQLite wrapper for request tracking
├── scraper.js          # Puppeteer Facebook/eBay scraper
├── analyzer.js         # Claude API integration
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore
├── Procfile            # Railway/Heroku deployment
├── railway.json        # Railway configuration
├── render.yaml         # Render configuration
└── README.md           # This file
```

---

## 🎯 Next Steps

**Immediate (Before Launch)**:
- [ ] Fill in .env with real credentials
- [ ] Deploy to Railway
- [ ] Configure Twilio webhook
- [ ] Test end-to-end flow
- [ ] Record TikTok videos

**Week 1**:
- [ ] Monitor first 100 customers
- [ ] Fix any bugs
- [ ] A/B test pricing ($2 vs $3)
- [ ] Collect testimonials

**Week 2**:
- [ ] Add subscription tier ($50/month unlimited)
- [ ] Implement auto-payment (saved cards)
- [ ] Launch referral program
- [ ] Expand to OfferUp/Craigslist

**Month 2**:
- [ ] Start React Native app development
- [ ] Use revenue to fund proper design
- [ ] Beta test with SMS users

---

## 💡 Revenue Projections

**Conservative (Month 1)**:
```
Week 1:  50 checks/day  × $1.47 profit = $514
Week 2:  100 checks/day × $1.47 profit = $1,029
Week 3:  150 checks/day × $1.47 profit = $1,543
Week 4:  150 checks/day × $1.47 profit = $1,543

Total: $4,629 profit
```

**With 1 Viral TikTok**:
```
Week 1:  50 checks/day   × $1.47 = $514
Week 2:  100 checks/day  × $1.47 = $1,029
Week 3:  500 checks/day  × $1.47 = $5,145  (viral)
Week 4:  300 checks/day  × $1.47 = $3,087  (sustained)

Total: $9,775 profit
```

---

## 🤝 Support

- **Technical issues**: Check Railway logs
- **User support**: Monitor incoming SMS
- **Feature requests**: Create GitHub issue

---

## 📄 License

Private project - All rights reserved

---

**Built with**:
- Node.js + Express
- Twilio SMS API
- Stripe Payments
- Claude (Anthropic API)
- Puppeteer
- SQLite

**Deploy to production in < 30 minutes. Launch marketing in < 2 hours. Start making money today.**

🚀 Let's go!
