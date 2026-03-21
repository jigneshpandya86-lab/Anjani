const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_ITEMS = 12;

const today = new Date().toISOString().split('T')[0];
const month = new Date().toLocaleString('en-IN', { month: 'long' });
const year = new Date().getFullYear();

// UPDATED PROMPT: Now requests SEO fields (slug, metaDescription, keywords)
const PROMPT = 
"You are a local community reporter and SEO content writer for Anjani Water, a packaged drinking water supplier in Vadodara, Gujarat, India.\n\n" +
"Today's date is " + today + ". Current month: " + month + " " + year + ".\n\n" +
"Using your search capabilities, find one piece of REAL, CURRENT good news or public affecting or an upcoming exciting event happening IN or AROUND Vadodara right now.\n\n" +
"Write ONE short update post about this specific event or news that would be relevant to residents, businesses, or families.\n\n" +
"The post should feel like a helpful, uplifting local news tip — NOT a direct product advertisement. Subtly connect the event/news to staying hydrated or event hydration planning.\n\n" +
"IMPORTANT RULES:\n" +
"- Date field must be exactly: " + today + "\n" +
"- Title: maximum 9 words, catchy, local feel, specific to the real news/event\n" +
"- Body: maximum 25 words, MUST mention Vadodara and the specific event/news, helpful tone\n" +
"- type: must be one of: event, news, local, tip\n" +
"- tag: 2-3 words max\n" +
"- emoji: one single relevant emoji\n" +
"- cta: action-oriented and short\n" +
"- image: a publicly available, relevant image URL related to the event or news (must be a direct image URL ending in .jpg, .jpeg, .png, or .webp). If no suitable public image is found, use empty string\n" +
"- slug: a URL-friendly version of the title (lowercase, hyphen-separated)\n" +
"- metaDescription: an SEO-optimized summary under 150 characters mentioning Vadodara and the event\n" +
"- keywords: 3-5 comma-separated SEO keywords (e.g., 'Vadodara events, summer hydration, local news')\n\n" +
"Return ONLY a single line minified JSON. No markdown, no explanation, no extra text. Start with { end with }.\n" +
'Format: {"title":"...","body":"...","type":"local","tag":"...","emoji":"🌟","date":"' + today + '","cta":"...","ctaLink":"contact.html","image":"<direct public URL or empty string>","slug":"...","metaDescription":"...","keywords":"..."}';

async function generateUpdate() {
  console.log('Calling Gemini API with Search Grounding & SEO...');

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7, 
          topP: 0.95
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error('Gemini API error: ' + response.status + ' ' + await response.text());
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text.trim();
  console.log('Raw response:', text.substring(0, 300));

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in response: ' + text.substring(0, 200));
  }

  const clean = jsonMatch[0].trim();
  const newEntry = JSON.parse(clean);

  // Validate core fields AND SEO fields
  if (!newEntry.title || !newEntry.body || !newEntry.slug || !newEntry.metaDescription) {
    throw new Error('Invalid entry - missing core or SEO fields');
  }
  
  if (newEntry.date !== today) {
    newEntry.date = today;
  }
  if (!newEntry.image) {
    newEntry.image = '';
  }

  console.log('Generated Title:', newEntry.title);
  console.log('Generated SEO Slug:', newEntry.slug);

  let updates = [];
  if (fs.existsSync('updates.json')) {
    updates = JSON.parse(fs.readFileSync('updates.json', 'utf8'));
  }

  updates.unshift(newEntry);
  if (updates.length > MAX_ITEMS) {
    updates = updates.slice(0, MAX_ITEMS);
  }

  fs.writeFileSync('updates.json', JSON.stringify(updates, null, 2));
  console.log('updates.json now has ' + updates.length + ' entries.');
}

generateUpdate().catch(function(err) {
  console.error('Failed:', err);
  process.exit(1);
});
