const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_ITEMS = 12;

const today = new Date().toISOString().split('T')[0];
const month = new Date().toLocaleString('en-IN', { month: 'long' });
const year = new Date().getFullYear();

const PROMPT = "You are a content writer for Anjani Water, a packaged drinking water supplier in Vadodara, Gujarat, India. Their brand is Anjani 200ml and they also supply Bisleri and Bailley. They serve weddings, party plots, caterers, offices and homes across Vadodara.\n\n" +
"Today's date is " + today + ". The current month is " + month + " " + year + ".\n\n" +
"Write ONE realistic update that connects a current Vadodara/Gujarat event, festival, season or local news.\n\n" +
"Examples of topics based on the month:\n" +
"- March: Holi celebrations, summer starting, wedding bookings\n" +
"- April: Summer heat wave, IPL season, Navratri prep\n" +
"- May: Peak summer, mango season, school events\n" +
"- June: Pre-monsoon, humidity, office hydration\n" +
"- July-September: Monsoon season, Ganesh Chaturthi\n" +
"- October: Navratri in Vadodara (very big!), Diwali prep\n" +
"- November: Wedding season peak, Diwali\n" +
"- December: Winter weddings, year end parties\n" +
"- January: Uttarayan kite festival, corporate events\n" +
"- February: Valentine events, pre-wedding season\n\n" +
"IMPORTANT RULES:\n" +
"- Use today date " + today + " as the date field\n" +
"- Body must be maximum 20 words — very short\n" +
"- Title must be maximum 8 words\n" +
"- Must mention Vadodara\n" +
"- Must feel like a real local business post\n\n" +
"Return ONLY a single line minified JSON object. No markdown, no explanation, no extra text. Start with { and end with }.\n" +
'Example format: {"title":"Short title here","body":"Short body here. Max 20 words.","type":"offer","tag":"Special Offer","emoji":"💧","date":"' + today + '","cta":"Order Now ->","ctaLink":"contact.html","image":""}';

async function generateUpdate() {
  console.log('Calling Gemini API...');

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9
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

  // Extract JSON object
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

  fs.writeFileSync('updates.json', JSON.stringify(updates, null, 2));
  console.log('updates.json now has ' + updates.length + ' entries.');
}

generateUpdate().catch(function(err) {
  console.error('Failed:', err);
  process.exit(1);
});
