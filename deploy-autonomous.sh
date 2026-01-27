#!/bin/bash
# ThriftTok MVP - Autonomous Railway Deployment with Token
set -e

echo "🚀 ThriftTok MVP - Autonomous Railway Deployment"
echo "=================================================="
echo ""

# Set Railway token from environment
export RAILWAY_TOKEN="10824da7-2944-4874-b1cd-49fea5f2358d"

# Navigate to project
cd ~/Downloads/thrifttok-sms

echo "✅ Step 1/4: Initialize Railway Project"
railway init --name "thrifttok-mvp"

echo ""
echo "✅ Step 2/4: Set Environment Variables"
railway variables set PORT=3000
railway variables set NODE_ENV=production

echo ""
echo "✅ Step 3/4: Deploy Application"
railway up --detach

echo ""
echo "✅ Step 4/4: Generate Domain"
railway domain

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "================================"
echo ""

# Get deployment info
echo "📊 Deployment Status:"
railway status

echo ""
echo "🌐 Getting your URL..."
DOMAIN=$(railway domain 2>&1 | grep -o 'https://[^ ]*' | head -1)

if [ -n "$DOMAIN" ]; then
  echo ""
  echo "✅ Your ThriftTok MVP is LIVE at:"
  echo "   $DOMAIN"
  echo ""
  echo "📋 Quick Links:"
  echo "   Landing Page: $DOMAIN"
  echo "   Health Check: ${DOMAIN}/health"
  echo "   Admin Panel:  ${DOMAIN}/admin"
  echo ""
else
  echo "Run 'railway domain' to get your URL"
fi

echo ""
echo "🎯 Next Steps:"
echo "   1. Test: curl ${DOMAIN}/health"
echo "   2. Share your URL in Facebook groups"
echo "   3. Monitor: ${DOMAIN}/admin"
echo "   4. Target: 50 signups = validated!"
echo ""
