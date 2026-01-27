const Anthropic = require('@anthropic-ai/sdk');

class ListingAnalyzer {
  constructor(apiKey) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async analyze(listingData, comps) {
    try {
      const prompt = this.buildPrompt(listingData, comps);

      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 400,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const analysis = message.content[0].text;
      return this.formatForSMS(analysis);

    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error('Analysis failed - please try again');
    }
  }

  buildPrompt(listing, comps) {
    const compsText = comps.length > 0
      ? comps.map((c, i) => `${i + 1}. ${c.title} - ${c.price}`).join('\n')
      : 'No comparable sales data available';

    return `You are an expert reseller analyzing a Facebook Marketplace listing. Be concise and direct.

LISTING DETAILS:
Title: ${listing.title || 'Unknown'}
Asking Price: ${listing.price || 'Not specified'}
Description: ${listing.description?.substring(0, 500) || 'No description'}
Location: ${listing.location || 'Unknown'}

RECENT SOLD COMPARABLES (eBay):
${compsText}

Provide a brief analysis in this EXACT format:

VALUE: $XX-$XX
PROFIT: $XX (XX%)
CONDITION: [1 brief sentence]
VERDICT: [BUY / NEGOTIATE / PASS]
WHY: [1 sentence]

Rules:
- Be realistic and conservative with value estimates
- If comps are unavailable, estimate based on item type and condition
- Keep total response under 500 characters
- Focus on actionable insights
- Consider resale fees (eBay ~13%, shipping, etc.)`;
  }

  formatForSMS(analysis) {
    // Ensure it fits SMS and add branding
    const maxLength = 1400; // Safe SMS limit with multi-part
    let formatted = analysis.trim();

    if (formatted.length > maxLength) {
      formatted = formatted.substring(0, maxLength - 50) + '...';
    }

    // Add footer
    formatted += '\n\n✨ ThriftTok • thrifttok.com';

    return formatted;
  }

  async analyzeListing(url, scraper) {
    // Main orchestration method
    const listingData = await scraper.scrapeListing(url);

    // Get comps if we have a good title
    let comps = [];
    if (listingData.title && listingData.title.length > 5) {
      comps = await scraper.getComparables(listingData.title);
    }

    // Run analysis
    const analysis = await this.analyze(listingData, comps);

    return {
      analysis,
      listingData,
      comps
    };
  }
}

module.exports = ListingAnalyzer;
