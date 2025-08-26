import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import { config } from '../config.js';
import Page from '../models/Page.js';
import { chunkText, cleanText } from '../utils/text.js';
import { embed } from '../services/embeddings.js';

async function scrapeUrls(page, baseUrl) {
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 120000 });
    
    // Get all links from the page
    const links = await page.$$eval('a', as => 
      as.map(a => a.href)
        .filter(h => !!h && !h.includes('#') && !h.includes('mailto:') && !h.includes('tel:'))
    );

    const baseOrigin = new URL(baseUrl).origin;
    
    // Filter for same-origin links and remove duplicates
    const unique = [...new Set(links.filter(h => {
      try {
        return new URL(h).origin === baseOrigin;
      } catch (e) {
        return false;
      }
    }))];

    // Filter out common non-content pages
    const contentPages = unique.filter(url => 
      !url.includes('/cdn-cgi/') &&
      !url.includes('/wp-admin/') &&
      !url.includes('/wp-json/') &&
      !url.includes('/search') &&
      !url.match(/\.(pdf|jpg|jpeg|png|gif|css|js)$/i)
    );

    return contentPages.slice(0, 50); // Increased limit for better coverage
  } catch (error) {
    console.error('Error discovering URLs:', error.message);
    return [baseUrl]; // Fallback to just the base URL
  }
}

async function scrapeOne(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  const title = await page.title();
  const content = await page.$eval('body', el => el.innerText || '');
  const chunks = chunkText(content); // Create chunks from the content
  return { url, title, content, chunks };
}

async function main() {
  if (!config.mongoUri) throw new Error('MONGO_URI missing');
  await mongoose.connect(config.mongoUri);

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const p = await browser.newPage();
  
  // Set user agent to avoid blocking
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  // Use the specific URLs provided by the user for comprehensive scraping
  const urls = [
    'https://www.hk.co/',
    'https://www.hk.co/about-leading-diamond-manufacturer',
    'https://www.hk.co/hari-krishna-group-leaders',
    'https://www.hk.co/diamond-industry-certifications',
    'https://www.hk.co/csr-activity-topmost-diamond-manufacturer',
    'https://www.hk.co/exclusive-diamonds',
    'https://www.hk.co/sustainability',
    'https://www.hk.co/blog/events-news/',
    'https://www.hk.co/contact-global-diamond-manufacturer',
    'https://www.hk.co/privacy-policy',
    'https://www.hk.co/hk-suggestion',
    'https://www.hk.co/concierge-services',
    'https://www.hk.co/terms-and-conditions',
    'https://www.hk.co/business-principles',
    'https://www.hk.co/diamond-education',
    'https://www.hk.co/hari-krishna-exports-achievements',
    'https://www.hk.co/hari-krishna-exports-grading'
  ];
  
  console.log(`📄 Scraping ${urls.length} specific pages for comprehensive data`);

  const results = [];
  for (const u of urls) {
    try {
      console.log(`🔄 Scraping: ${u}`);
      const r = await scrapeOne(p, u);
      results.push(r);
      console.log(`✅ Success: ${u}`);
      
      // Add small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      console.error('❌ Failed to scrape', u, e.message);
    }
  }

  for (const r of results) {
    const text = cleanText(r.content);
    
    // Save the content with chunks (without embeddings for now due to OpenAI quota)
    await Page.findOneAndUpdate(
      { url: r.url },
      {
        url: r.url,
        title: r.title,
        content: text,
        chunks: r.chunks.map(chunk => ({ text: chunk })), // Save chunks with text only
        updatedAt: new Date()
      },
      { upsert: true }
    );
    
    console.log(`💾 Saved content for: ${r.url} (${text.length} chars)`);
  }

  await browser.close();
  await mongoose.disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
