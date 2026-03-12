# Anjani Water – anjaniwater.in

Multi-page website for **Anjani Water by Annapurna Foods**, Vadodara's trusted packaged drinking water supplier.

## 📁 File Structure

```
/
├── index.html          ← Home page
├── products.html       ← Products (Anjani, Bisleri, Bailley, Clear)
├── updates.html        ← News & Offers (reads from updates.json)
├── serve.html          ← Who We Serve
├── why.html            ← Why Choose Us
├── contact.html        ← Order Form, Free Sample, FAQ
├── style.css           ← Shared stylesheet (all pages)
├── site.js             ← Shared JS config, nav, footer, helpers
├── updates.json        ← Edit this to add/update news cards
└── images/
    ├── README.md       ← Image upload guide
    ├── anjani-hero.png
    ├── anjani-200ml.png
    ├── bisleri-bottle.jpg
    ├── bailley-bottle.png
    ├── clear-bottle.jpg
    ├── update-summer-offer.jpg
    ├── update-new-stock.jpg
    ├── update-wedding-supply.jpg
    └── update-office-delivery.jpg
```

## 🚀 Hosted on GitHub Pages

Site URL: https://anjaniwater.in  
GitHub Pages branch: `main`

## ✏️ How to Update Content

### Add a new update/offer card:
Edit `updates.json` — add a new entry at the top of the array:
```json
{
  "title": "Your Update Title",
  "body": "Description of the update...",
  "type": "offer",
  "tag": "Special Offer",
  "emoji": "🎉",
  "date": "2025-05-01",
  "cta": "Order Now →",
  "ctaLink": "contact.html",
  "image": "https://raw.githubusercontent.com/jigneshpandya86-lab/Anjani/main/images/your-image.jpg"
}
```

### Add/change images:
Upload image files to the `/images/` folder. See `/images/README.md` for details.

### Update contact number / sheet URL:
Edit the `SITE` config at the top of `site.js`.

## 📞 Contact
- Phone: 9925997750
- Email: annapurnafoods27@gmail.com
- WhatsApp: https://wa.me/919925997750
