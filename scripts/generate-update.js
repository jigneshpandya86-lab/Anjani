const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_ITEMS = 12; // Keep only 12 posts to stay lean

const today = new Date().toISOString().split('T')[0];
const month = new Date().toLocaleString('en-IN', { month: 'long' });
const year = new Date().getFullYear();

const PROMPT = `You are a content writer for Anjani Water, a packaged drinking water supplier in Vadodara, Gujarat, India. Their brand is "Anjani 200ml" and they also supply Bisleri and Bailley. They serve weddings, party plots, caterers, offices and homes across Vadodara.

Today's date is ${today}. The current month is ${month} ${year}.

Write ONE realistic update that connects a current Vadodara/Gujarat event, festival, season or local news to Anjani Water's business. 

Examples of topics to pick from based on the month:
- March: Holi celebrations, summer starting, wedding bookings
- April: Summer heat wave, IPL season, Navratri prep
- May: Peak summer, mango season, school events
- June: Pre-monsoon, humidity, office hydration
- July-September: Monsoon season, Ganesh Chaturthi
- October: Navratri in Vadodara (very big!), Diwali prep
- November: Wedding season peak, Diwali
- December: Winter weddings, year end parties
- January: Uttarayan kite festival, corporate events
- February: Valentine events, pre-wedding season

IMPORTANT RULES:
- Use today's date ${today} as the "date" field — never a future date
- Keep body to 2 sentences maximum
- Must mention Vadodara specifically
- Must feel like a real local business post

Return ONLY a single-line minified JSON object with no line breaks, no markdown, no backticks. Just raw JSON starting with { and ending with }:
{"title":"...","body":"...","type":"offer or news or season or local","tag":"2-3 word tag","emoji":"one emoji","date":"${today}","cta":"Short CTA →","ctaLink":"contact.html","image":""}`;

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
          maxOutputTokens: 1024,   // Hard cap — keeps cost near zero
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
