# Website Preview Guide

## 🌐 How to View the Website

### Option 1: Direct File Open (Quickest)
1. Navigate to your project folder
2. Double-click `index.html`
3. Opens in your default browser

### Option 2: Live Server (Recommended for Development)
If you have VS Code:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Auto-refreshes on file changes

### Option 3: Local Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server
```
Then open: http://localhost:8000

## 📸 Adding Your Blender Render

### Step 1: Render in Blender
1. Complete the Blender workflow (see QUICK_START.md)
2. Render your chair (F12)
3. Save as PNG: `chair_hero_4k.png`

### Step 2: Add to Website
1. Place `chair_hero_4k.png` in the same folder as `index.html`
2. Refresh the website
3. Your chair should appear in the hero section!

### Image Requirements
- **Format:** PNG (with transparency)
- **Resolution:** 3840x2160 (4K) recommended
- **File size:** Optimize to ~500KB for web
  - Use TinyPNG.com or similar
  - Or create multiple sizes (see below)

## 🎨 Responsive Images (Optional)

Create multiple sizes for better performance:

```
chair_hero_4k.png      → 3840x2160 (Desktop)
chair_hero_2k.png      → 1920x1080 (Tablet)
chair_hero_mobile.png  → 1080x607 (Mobile)
```

Then update `index.html`:
```html
<img 
    src="chair_hero_4k.png" 
    srcset="
        chair_hero_mobile.png 1080w,
        chair_hero_2k.png 1920w,
        chair_hero_4k.png 3840w
    "
    sizes="(max-width: 640px) 1080px, 
           (max-width: 968px) 1920px, 
           3840px"
    alt="Premium Wooden Chair" 
    class="chair-image" 
    id="chairImage"
>
```

## ✨ Current Features

### Hero Section
- ✓ Premium headline with gradient text
- ✓ Call-to-action buttons
- ✓ Stats counter animation
- ✓ Floating chair animation
- ✓ Decorative floating elements
- ✓ Scroll indicator

### Interactions
- ✓ Smooth scroll navigation
- ✓ Navbar scroll effects
- ✓ Button ripple effects
- ✓ Parallax scrolling
- ✓ Fade-in animations
- ✓ Hover effects

### Responsive Design
- ✓ Mobile-friendly (320px+)
- ✓ Tablet optimized
- ✓ Desktop full experience

## 🎯 Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary: #2D1810;        /* Main brown */
    --accent: #D4A574;         /* Gold accent */
    --primary-light: #4A2818;  /* Lighter brown */
}
```

### Change Text
Edit `index.html`:
- Hero title: Line 23-26
- Description: Line 27-30
- Stats: Line 37-49
- Features: Line 78-103

### Change Animations
Edit `script.js`:
- Parallax speed: Line 48 (change `0.3`)
- Counter duration: Line 95 (change `2000`)
- Fade-in timing: Line 68 (change `0.1`)

## 🚀 Deployment

### Deploy to Netlify (Free)
1. Go to netlify.com
2. Drag and drop your project folder
3. Get instant live URL
4. Auto-deploys on updates

### Deploy to Vercel (Free)
1. Go to vercel.com
2. Import your project
3. Deploy with one click

### Deploy to GitHub Pages (Free)
1. Create GitHub repository
2. Push your files
3. Settings → Pages → Enable
4. Get yourname.github.io/project URL

## 📱 Testing Checklist

Before going live:
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Check image loads correctly
- [ ] Verify all buttons work
- [ ] Test smooth scrolling
- [ ] Check responsive breakpoints
- [ ] Optimize images for web
- [ ] Test loading speed

## 🎨 Design Inspiration

Current design inspired by:
- Apple product pages (clean, minimal)
- Stripe landing pages (modern, professional)
- Airbnb (friendly, approachable)
- Premium furniture brands (luxury feel)

## 📊 Performance Tips

### Optimize Images
```bash
# Using ImageMagick
magick chair_hero_4k.png -quality 85 -strip chair_hero_optimized.png

# Or use online tools:
# - TinyPNG.com
# - Squoosh.app
# - Compressor.io
```

### Lazy Loading
Add to image tag:
```html
<img loading="lazy" ...>
```

### Preload Critical Assets
Add to `<head>`:
```html
<link rel="preload" as="image" href="chair_hero_4k.png">
```

## 🔧 Troubleshooting

**Image not showing:**
- Check filename matches exactly: `chair_hero_4k.png`
- Ensure image is in same folder as `index.html`
- Check browser console for errors (F12)

**Animations not working:**
- Ensure `script.js` is loaded
- Check browser console for JavaScript errors
- Try hard refresh (Ctrl+Shift+R)

**Layout broken on mobile:**
- Clear browser cache
- Test in incognito/private mode
- Check viewport meta tag is present

**Slow loading:**
- Compress images (aim for <500KB)
- Use WebP format for better compression
- Enable browser caching

## 📁 Project Structure

```
furniture-marketplace/
├── index.html              # Main HTML file
├── styles.css              # All styles
├── script.js               # Interactions & animations
├── chair_hero_4k.png       # Your Blender render (add this)
├── WEBSITE_GUIDE.md        # This file
└── blender_files/          # Blender project files
    ├── blender_furniture_setup.py
    ├── README.md
    └── ...
```

## 🎯 Next Steps

1. **Complete Blender render** (see QUICK_START.md)
2. **Add chair image** to website folder
3. **Preview website** in browser
4. **Customize** colors, text, images
5. **Test** on different devices
6. **Optimize** images for web
7. **Deploy** to hosting platform

## 💡 Enhancement Ideas

Want to take it further?

- Add product gallery section
- Implement search functionality
- Add store locator with map
- Create product detail pages
- Add shopping cart
- Implement user reviews
- Add 3D chair viewer (Three.js)
- Create chair customization tool

---

**Need help?** Check the browser console (F12) for any errors or warnings.
