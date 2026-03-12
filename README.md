# 📁 /images — Anjani Water GitHub Image Folder

Upload all website images to this folder in the GitHub repo.
The site reads images from:
`https://raw.githubusercontent.com/jigneshpandya86-lab/Anjani/main/images/<filename>`

---

## 🖼️ Required Image Files

| Filename | Used For | Notes |
|---|---|---|
| `anjani-hero.png` | Hero section + OG image | Glamour shot of Anjani 200ml bottle |
| `anjani-200ml.png` | Products page – featured card | Product photo, transparent bg preferred |
| `bisleri-bottle.jpg` | Products page – Bisleri card | Bisleri bottle photo |
| `bailley-bottle.png` | Products page – Bailley card | Bailley bottle photo |
| `clear-bottle.jpg` | Products page – Clear card | Clear water bottle photo |
| `update-summer-offer.jpg` | Update card 1 | Summer deal / offer banner photo |
| `update-new-stock.jpg` | Update card 2 | Warehouse / stock arrival photo |
| `update-wedding-supply.jpg` | Update card 3 | Wedding event / supply photo |
| `update-office-delivery.jpg` | Update card 4 | Office delivery photo |

---

## ✅ How to Upload

1. Go to your repo: https://github.com/jigneshpandya86-lab/Anjani
2. Click **Add file → Upload files**
3. Drag all images into the `/images/` folder
4. Commit with message: `Add website images`

---

## 📐 Recommended Sizes

| Type | Ideal Size |
|---|---|
| Product images (bottles) | 400×500px, transparent PNG |
| Hero image | 600×800px |
| Update card images | 800×400px landscape JPG |

---

## 🔗 To add more update images later

1. Upload the image to this `/images/` folder
2. Edit `updates.json` — add the filename in the `"image"` field:
```json
"image": "https://raw.githubusercontent.com/jigneshpandya86-lab/Anjani/main/images/your-new-image.jpg"
```
