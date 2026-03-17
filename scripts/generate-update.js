const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_ITEMS = 12; // Keep only 12 posts to stay lean

const PROMPT = `You are a content writer for Anjani Water, a packaged drinking water supplier in Vadodara, Gujarat, India. Their brand is "Anjani 200ml" and they also supply Bisleri and Bailley. They serve weddings, party plots, caterers, offices and homes across Vadodara.

Generate ONE new weekly update relevant to Vadodara — it can be about local events (Navratri, Uttarayan, wedding season), weather (summer heat, monsoon), a business offer, new stock, or local area expansion. Keep it natural and local.

Return ONLY a valid JSON object (no markdown, no backticks) with these exact fields:
{
  "title": "Short catchy title (max 10 words)",
  "body": "2-3 sentences. Mention Vadodara. Call 9925997750 if relevant.",
  "type": "offer" or "news" or "season" or "local",
  "tag": "2-3 word tag label",
  "emoji": "one relevant emoji",
  "date": "${new Date().toISOString().split('T')[0]}",
  "cta": "Short CTA text →",
  "ctaLink": "contact.html",
  "image": ""
}`;

async function generateUpdate() {
  console.log('Calling Gemini API...');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: {
          maxOutputTokens: 600,   // Hard cap — keeps cost near zero
          temperature: 0.8,
          topP: 0.9
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text.trim();

  // Strip any accidental markdown fences
// Extract JSON object more aggressively
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('No JSON object found in response: ' + text.substring(0, 200));
}
const clean = jsonMatch[0].trim();
const newEntry = JSON.parse(clean);

  console.log('Generated:', newEntry.title);

  // Load existing updates.json
  let updates = [];
  if (fs.existsSync('updates.json')) {
    updates = JSON.parse(fs.readFileSync('updates.json', 'utf8'));
  }

  // Prepend new entry, trim to MAX_ITEMS
  updates.unshift(newEntry);
  if (updates.length > MAX_ITEMS) {
    updates = updates.slice(0, MAX_ITEMS);
  }

  // Write back
  fs.writeFileSync('updates.json', JSON.stringify(updates, null, 2));
  console.log(`updates.json now has ${updates.length} entries.`);
}

generateUpdate().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
