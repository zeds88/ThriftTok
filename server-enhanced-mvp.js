require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 3000;

// Initialize Twilio (optional - only used if credentials exist)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('✅ Twilio initialized');
} else {
  console.log('⚠️  Twilio not configured - SMS disabled');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage
const waitlist = [];
const smsInquiries = [];
const analytics = { visits: 0, signups: 0, smsReceived: 0 };

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: twilioClient ? 'mvp-with-sms' : 'mvp-waitlist-only',
    message: 'ThriftTok MVP - Demand Validation',
    timestamp: new Date().toISOString(),
    features: {
      waitlist: true,
      sms: !!twilioClient,
      payments: false,
      aiAnalysis: false
    },
    analytics: {
      totalVisits: analytics.visits,
      totalSignups: analytics.signups,
      smsInquiries: analytics.smsReceived
    }
  });
});

// Root - Landing page
app.get('/', (req, res) => {
  analytics.visits++;
  const smsEnabled = !!twilioClient;
  
  res.send(`
