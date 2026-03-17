const fs = require('fs');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_ITEMS = 12;

const today = new Date().toISOString().split('T')[0];
const month = new Date().toLocaleString('en-IN', { month: 'long' });
const year = new Date().getFullYear();

const PROMPT =
"You are a local content writer for Anjani Water, a packaged drinking water supplier in Vadodara, Gujarat, India.\n\n" +

"Today's date is " + today + ". Current month: " + month + " " + year + ".\n\n" +

"Write ONE short update post about something happening IN or AROUND Vadodara that would be relevant to a broad local audience — residents, businesses, event organizers, families.\n\n" +

"The post should feel like a helpful local news tip or community update — NOT just a product advertisement. It should naturally connect to the need for water, hydration, or events where water is needed.\n\n" +

"Topics to pick from based on month and what is real in Vadodara/Gujarat:\n" +
"- March: Holi mela at Sayaji Baug, summer heat starting, school exams ending, wedding season bookings\n" +
"- April: Chaitra Navratri, summer camps, IPL matches watch parties, heat wave alerts\n" +
"- May: Peak summer 42-45C in Vadodara, mango festivals, school summer vacations\n" +
"- June: Pre-monsoon dust storms, Rath Yatra in Ahmedabad nearby, humidity spike\n" +
"- July: Monsoon arrives, Sawan month, flooding in low areas, Janmashtami prep\n" +
"- August: Independence Day events, Janmashtami celebrations in Vadodara, Ganesh Chaturthi prep\n" +
"- September: Ganesh Chaturthi visarjan, Navratri rehearsals starting\n" +
"- October: Navratri in Vadodara, one of Indias biggest, 9 nights, lakhs of people\n" +
"- November: Diwali, post-Navratri weddings, winter starting\n" +
"- December: Winter wedding season, year-end corporate parties, Christmas events\n" +
"- January: Uttarayan kite festival, massive in Gujarat, makar sankranti, corporate events\n" +
"- February: Valentine week events, pre-wedding functions, Vasant Panchami\n\n" +

"IMPORTANT RULES:\n" +
"- Date field must be exactly: " + today + "\n" +
"- Title: maximum 9 words, catchy, local feel\n" +
"- Body: maximum 25 words, mention Vadodara, helpful tone not salesy\n" +
"- The post should feel useful to ANY Vadodara resident not just water customers\n" +
"- type must be one of: offer, news, season, local, tip\n" +
"- tag must be 2-3 words max\n" +
"- emoji must be one single relevant emoji\n" +
"- cta should be action-oriented and short\n" +
"- image must be empty string\n\n" +

"Good example topics:\n" +
"- Uttarayan: Best rooftop spots in Vadodara for kite flying\n" +
"- Summer: Heat wave advisory for Vadodara residents this week\n" +
"- Navratri: Garba venue hydration tips for 9 nights\n" +
"- Wedding season: Checklist for outdoor wedding planners in Vadodara\n" +
"- Monsoon: What to check before hosting an outdoor event in rainy season\n\n" +

"Return ONLY a single line minified JSON. No markdown, no explanation, no extra text. Start with { end with }.\n" +
'Format: {"title":"...","body":"...","type":"local","tag":"Local News","emoji":"🌟","date":"' + today + '","cta":"Read More ->","ctaLink":"contact.html","image":""}';

async function generateUpdate() {
  console.log('Calling Gemini API...');

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
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

  if (!newEntry.title || !newEntry.body) {
    throw new Error('Invalid entry - missing title or body');
  }
  if (newEntry.date !== today) {
    newEntry.date = today;
  }
  if (!newEntry.image) {
    newEntry.image = '';
  }

  console.log('Generated:', newEntry.title);

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
