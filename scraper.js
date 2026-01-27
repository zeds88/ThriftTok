const puppeteer = require('puppeteer');

class MarketplaceScraper {
  async scrapeListing(url) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for content to load
      await page.waitForSelector('span', { timeout: 10000 });

      // Extract listing data
      const listingData = await page.evaluate(() => {
        // Helper to get text safely
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.innerText.trim() : '';
        };

        // Get all text spans and divs to find data
        const allText = Array.from(document.querySelectorAll('span, div')).map(el => el.innerText?.trim()).filter(Boolean);

        // Try multiple selectors for title
        const title = getText('h1') ||
                     getText('[class*="title"]') ||
                     getText('span[dir="auto"]') ||
                     allText.find(t => t.length > 10 && t.length < 200) ||
                     '';

        // Find price (look for $ followed by numbers)
        const priceText = allText.find(t => /\$[\d,]+/.test(t)) || '';
        const priceMatch = priceText.match(/\$[\d,]+/);
        const price = priceMatch ? priceMatch[0] : '';

        // Get description (longer text blocks)
        const description = allText.find(t => t.length > 50 && t.length < 2000) || '';

        // Get location
        const location = allText.find(t => {
          const lower = t.toLowerCase();
          return (lower.includes('miles') || lower.includes('km')) && t.length < 100;
        }) || '';

        // Get images
        const images = Array.from(document.querySelectorAll('img'))
          .map(img => img.src)
          .filter(src => src && !src.includes('icon') && !src.includes('logo'))
          .slice(0, 5);

        return {
          title,
          price,
          description,
          location,
          images,
          rawText: allText.slice(0, 20).join(' | ') // First 20 text elements for debugging
        };
      });

      await browser.close();

      // Validate we got something useful
      if (!listingData.title && !listingData.price) {
        throw new Error('Could not extract listing data - page structure may have changed');
      }

      return listingData;

    } catch (error) {
      if (browser) await browser.close();
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  async getComparables(searchTerm) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}&LH_Sold=1&LH_Complete=1&_sop=13`;

      await page.goto(ebayUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      const soldItems = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.s-item').forEach((item, index) => {
          if (index === 0) return; // Skip first "Shop on eBay" item

          const titleEl = item.querySelector('.s-item__title');
          const priceEl = item.querySelector('.s-item__price');

          if (titleEl && priceEl) {
            items.push({
              title: titleEl.innerText.trim(),
              price: priceEl.innerText.trim()
            });
          }
        });
        return items.slice(0, 10);
      });

      await browser.close();
      return soldItems;

    } catch (error) {
      if (browser) await browser.close();
      console.error('Comps scraping failed:', error.message);
      return []; // Return empty array if comps fail - analysis can still work
    }
  }

  validateMarketplaceUrl(url) {
    const marketplacePatterns = [
      /facebook\.com\/marketplace/i,
      /fb\.com\/marketplace/i,
      /m\.facebook\.com\/marketplace/i
    ];

    return marketplacePatterns.some(pattern => pattern.test(url));
  }
}

module.exports = MarketplaceScraper;
