# Target Cursor - Interactive GSAP Cursor

## 🎯 What It Does

Premium interactive cursor that:
- Replaces default cursor with a custom animated dot
- Spins continuously when idle
- Targets hoverable elements with animated corners
- Creates a "focus frame" around buttons and interactive elements
- Adds premium feel to the website

## ✨ Features

- **Spinning Animation**: Cursor rotates 360° continuously
- **Target Detection**: Automatically detects `.cursor-target` elements
- **Corner Animation**: Four corners expand to frame the target
- **Parallax Effect**: Smooth following motion
- **Click Feedback**: Scales down on click
- **Mobile Detection**: Automatically disabled on mobile devices
- **Mix Blend Mode**: White cursor works on any background

## 🎨 How It Works

### Visual States

1. **Idle State**
   - Small white dot in center
   - Four corners spinning around it
   - Follows mouse smoothly

2. **Hover State**
   - Corners expand to frame the target element
   - Spinning stops
   - Corners align with element edges

3. **Click State**
   - Dot and cursor scale down slightly
   - Returns to normal on release

## 🔧 Configuration

Edit `cursor-standalone.js` to customize:

```javascript
new TargetCursor({
    targetSelector: '.cursor-target',  // CSS selector for targets
    spinDuration: 2,                   // Rotation speed (seconds)
    hideDefaultCursor: true,           // Hide system cursor
    hoverDuration: 0.2,                // Hover animation speed
    parallaxOn: true                   // Enable smooth following
});
```

## 🎯 Adding Targets

Add the `cursor-target` class to any element:

```html
<!-- Buttons -->
<button class="cursor-target">Click Me</button>

<!-- Links -->
<a href="#" class="cursor-target">Link</a>

<!-- Divs -->
<div class="cursor-target">Hover Area</div>

<!-- Cards -->
<div class="feature-card cursor-target">
    <h3>Feature</h3>
</div>
```

## 📱 Mobile Behavior

Cursor automatically detects mobile devices and:
- Doesn't render on touch devices
- Doesn't hide default cursor
- No performance impact on mobile

Detection checks:
- Touch screen capability
- Screen size (≤768px)
- User agent (mobile browsers)

## 🎨 Styling

Cursor styles in `styles.css`:

```css
.target-cursor-wrapper {
    mix-blend-mode: difference;  /* White on any background */
    z-index: 9999;               /* Always on top */
}

.target-cursor-dot {
    width: 4px;
    height: 4px;
    background: #fff;
}

.target-cursor-corner {
    width: 12px;
    height: 12px;
    border: 3px solid #fff;
}
```

### Customizing Colors

Change cursor color:
```css
.target-cursor-dot,
.target-cursor-corner {
    background: #D4A574;  /* Gold */
    border-color: #D4A574;
}
```

Remove blend mode for solid color:
```css
.target-cursor-wrapper {
    mix-blend-mode: normal;
}
```

## ⚡ Performance

Optimizations included:
- Uses GSAP ticker for smooth 60fps
- `will-change` CSS for GPU acceleration
- Passive event listeners
- Mobile detection to avoid unnecessary rendering
- Efficient DOM queries

## 🐛 Troubleshooting

**Cursor not showing:**
- Check browser console for errors
- Ensure GSAP CDN is loaded
- Verify `cursor-standalone.js` is loaded after GSAP

**Cursor not targeting elements:**
- Add `cursor-target` class to elements
- Check selector in configuration
- Ensure elements are visible and not `pointer-events: none`

**Cursor lagging:**
- Reduce `spinDuration` value
- Disable `parallaxOn`
- Check for other heavy animations

**Cursor showing on mobile:**
- Clear browser cache
- Check mobile detection logic
- Test in actual mobile browser (not desktop responsive mode)

## 🎯 Current Targets

Elements with cursor interaction:
- ✓ Navigation links
- ✓ "Get Started" button
- ✓ Hero CTA buttons
- ✓ Feature cards
- ✓ "Start Shopping" button

## 🔄 Advanced Usage

### Programmatic Control

Access cursor instance:
```javascript
// Cursor is available as window.furnitureCursor
const cursor = window.furnitureCursor;

// Destroy cursor
cursor.destroy();

// Create new cursor with different settings
const newCursor = new TargetCursor({
    spinDuration: 3,
    targetSelector: '.custom-target'
});
```

### Dynamic Targets

For dynamically added elements:
```javascript
// Just add the class - cursor auto-detects on mouseover
element.classList.add('cursor-target');
```

### Temporary Disable

```javascript
// Hide cursor temporarily
document.querySelector('.target-cursor-wrapper').style.display = 'none';

// Show again
document.querySelector('.target-cursor-wrapper').style.display = 'block';
```

## 🎨 Design Inspiration

Inspired by:
- Apple product pages (smooth, premium feel)
- Awwwards winning sites (creative interactions)
- Modern portfolio sites (unique cursors)
- Luxury brand websites (attention to detail)

## 📊 Browser Support

Works on:
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Opera (latest)

Requires:
- CSS `mix-blend-mode` support
- GSAP 3.x
- Modern JavaScript (ES6+)

## 💡 Tips

1. **Don't overuse**: Only add to important interactive elements
2. **Test thoroughly**: Check on different backgrounds
3. **Consider accessibility**: Some users prefer default cursor
4. **Performance**: Monitor on lower-end devices
5. **Feedback**: Ensure users understand elements are clickable

## 🚀 Future Enhancements

Ideas to extend:
- Different cursor styles per element type
- Color change based on background
- Trail effect
- Magnetic attraction to targets
- Custom shapes (not just corners)
- Sound effects on interaction

---

**Enjoy your premium cursor experience!** 🎯✨
