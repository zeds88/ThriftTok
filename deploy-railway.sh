#!/bin/bash

echo "🚀 ThriftTok MVP Deployment Script"
echo "===================================="
echo ""

# Change to project directory
cd ~/Downloads/thrifttok-sms

echo "✅ Step 1: Railway Login"
echo "Running: railway login"
railway login

echo ""
echo "✅ Step 2: Initialize Railway Project"  
echo "Running: railway init"
railway init

echo ""
echo "✅ Step 3: Deploy to Railway"
echo "Running: railway up"
railway up

echo ""
echo "✅ Step 4: Set Environment Variables"
railway variables set PORT=3000
railway variables set NODE_ENV=production

echo ""
echo "✅ Step 5: Generate Domain"
railway domain

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Run: railway status"
echo "2. Get your URL: railway domain"
echo "3. Test: curl https://your-url.railway.app/health"
echo ""
