import fs from 'fs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_ITEMS = 12;

const today = new Date();
const start = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const endDate = new Date(today);
endDate.setDate(today.getDate() + 6);
const end = endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const weekRange = start + " – " + end;

// UPDATED PROMPT: Now requests SEO fields (slug, metaDescription, keywords)
const PROMPT = 
"You are a local community reporter and SEO content writer for Anjani Water, a packaged drinking water supplier in Vadodara, Gujarat, India.\n\n" +
"Today's date is " + today + ". Current week: " + weekRange + ". Month: " + month + " " + year + ".\n\n" +
"Using your search capabilities, find 3 REAL, CURRENT news stories or upcoming events happening IN or AROUND Vadodara this week — covering local events, civic developments, festivals, infrastructure, sports, or anything publicly relevant.\n\n" +
"For each story, write ONE short update paragraph (60–80 words) that feels like a helpful local news tip. Each post should subtly connect to staying hydrated or event hydration planning — but NEVER sound like a product advertisement.\n\n" +
"Format your response as:\n" +
"STORY 1: [Headline]\n[Post body]\n\n" +
"STORY 2: [Headline]\n[Post body]\n\n" +
"STORY 3: [Headline]\n[Post body]\n\n" +
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
const purgeUrl = 'https://purge.jsdelivr.net/gh/jigneshpandya86-lab/Anjani@main/updates.json';
const purgeRes = await fetch(purgeUrl);
console.log('jsDelivr purge status:', purgeRes.status);
generateUpdate().catch(function(err) {
  console.error('Failed:', err);
  process.exit(1);
});
