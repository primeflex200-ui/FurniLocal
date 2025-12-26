# GPU Optimization Guide

## 🚀 Overview

This project is fully optimized for GPU-accelerated rendering to achieve ultra-smooth 60-120 FPS performance even under high traffic loads.

## ⚡ Key Optimizations

### 1. Hardware Acceleration
- All animations use `transform` and `opacity` only (GPU-composited properties)
- `will-change` hints for browser optimization
- `translateZ(0)` forces GPU layer creation
- `backface-visibility: hidden` prevents unnecessary repaints

### 2. WebGL Optimization (3D Viewer)
- High-performance power preference
- Disabled auto-updates on static objects
- Optimized shadow maps (static, 1024x1024)
- Reduced material complexity
- Frustum culling enabled
- Texture anisotropy optimization

### 3. Animation Loop Optimization
- Single `requestAnimationFrame` loop
- Smooth lerp interpolation for buttery animations
- No layout-triggering properties (width, height, top, left)
- Passive event listeners
- Debounced resize handlers

### 4. Layout Stability
- CSS containment (`contain: layout style paint`)
- No layout shifts during animations
- Fixed dimensions for animated elements
- Preloaded critical assets

### 5. Memory Management
- Efficient object pooling
- Proper disposal of Three.js resources
- Texture compression with Draco
- Minimal DOM manipulation

## 📊 Performance Targets

- **Target FPS**: 60+ (up to 120 on high-refresh displays)
- **Frame Time**: < 16.67ms (60 FPS) or < 8.33ms (120 FPS)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: 0

## 🎮 GPU-Optimized Files

### Core Files
1. **hero-gpu-optimized.js** - GPU-accelerated hero animations
2. **chair-viewer-gpu.js** - WebGL 3D viewer with GPU optimization
3. **styles-gpu-optimized.css** - Hardware-accelerated CSS
4. **performance-monitor.js** - Real-time FPS monitoring

### How They Work Together

```
index.html
├── styles.css (base styles)
├── styles-gpu-optimized.css (GPU overrides)
├── script.js (base functionality)
├── hero-gpu-optimized.js (hero animations)
├── chair-viewer-gpu.js (3D rendering)
└── performance-monitor.js (monitoring)
```

## 🔧 Usage

### Basic Setup
```html
<!-- In <head> -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="styles-gpu-optimized.css">
<link rel="preload" href="chair-main.jpg" as="image">

<!-- Before </body> -->
<script type="module" src="hero-gpu-optimized.js"></script>
<script type="module" src="chair-viewer-gpu.js"></script>
<script type="module" src="performance-monitor.js"></script>
```

### Enable Performance Monitoring (Development)
```javascript
// Automatically enabled on localhost
// Access via console:
window.perfMonitor.logReport();
window.perfMonitor.destroy(); // Hide overlay
```

### GPU Detection
```javascript
import { GPUDetector } from './performance-monitor.js';

GPUDetector.log(); // Log GPU info
const isHighPerf = GPUDetector.isHighPerformance(); // Check GPU tier
```

## 🎯 Animation Best Practices

### ✅ DO (GPU-Friendly)
```css
.element {
    transform: translate3d(10px, 20px, 0);
    opacity: 0.5;
    will-change: transform, opacity;
}
```

### ❌ DON'T (CPU-Heavy)
```css
.element {
    left: 10px;  /* Triggers layout */
    top: 20px;   /* Triggers layout */
    width: 100%; /* Triggers layout */
}
```

## 📈 Performance Monitoring

### Real-Time Metrics
- **FPS**: Frames per second
- **Frame Time**: Time per frame in milliseconds
- **Memory**: JavaScript heap usage
- **Status**: Color-coded performance indicator
  - 🟢 Green: 60+ FPS (Excellent)
  - 🟡 Yellow: 50-59 FPS (Good)
  - 🔴 Red: <50 FPS (Poor)

### Console Commands
```javascript
// Get current metrics
perfMonitor.getMetrics();

// Log detailed report
perfMonitor.logReport();

// Stop monitoring
perfMonitor.stop();

// Resume monitoring
perfMonitor.start();

// Remove overlay
perfMonitor.destroy();
```

## 🌐 Browser Compatibility

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Graceful Degradation
- Older browsers fall back to CSS animations
- WebGL fallback for 3D viewer
- Performance monitoring disabled on unsupported browsers

## 🔍 Debugging Performance Issues

### Check GPU Usage
```javascript
GPUDetector.log();
// Look for dedicated GPU (NVIDIA, AMD) vs integrated (Intel HD)
```

### Monitor Frame Rate
```javascript
perfMonitor.logReport();
// Check if FPS is consistently above 60
```

### Identify Bottlenecks
1. Open Chrome DevTools
2. Go to Performance tab
3. Record while scrolling/interacting
4. Look for:
   - Long tasks (>50ms)
   - Layout thrashing
   - Excessive paint operations

### Common Issues & Solutions

**Low FPS (<30)**
- Reduce animation complexity
- Disable auto-rotate on 3D model
- Lower texture quality
- Reduce shadow map size

**High Memory (>100MB)**
- Dispose unused Three.js objects
- Compress textures
- Reduce model complexity

**Layout Shifts**
- Set explicit dimensions
- Use CSS containment
- Preload images

## 🚀 Production Optimization

### Before Deployment
1. **Minify Assets**
   ```bash
   # Minify JavaScript
   terser hero-gpu-optimized.js -o hero-gpu-optimized.min.js
   
   # Minify CSS
   cssnano styles-gpu-optimized.css styles-gpu-optimized.min.css
   ```

2. **Compress Images**
   ```bash
   # Use WebP format
   cwebp chair-main.jpg -q 85 -o chair-main.webp
   ```

3. **Enable Gzip/Brotli**
   - Configure server to compress text assets
   - Typical compression: 70-80% size reduction

4. **CDN Delivery**
   - Serve static assets from CDN
   - Enable HTTP/2 or HTTP/3
   - Set proper cache headers

### Performance Checklist
- [ ] All animations use GPU-composited properties
- [ ] Images are preloaded and optimized
- [ ] 3D models use Draco compression
- [ ] No layout shifts during page load
- [ ] FPS consistently above 60
- [ ] Memory usage stable over time
- [ ] Lighthouse score >90

## 📱 Mobile Optimization

### Responsive Adjustments
```css
@media (max-width: 768px) {
    /* Reduce animation complexity */
    .float-element {
        display: none; /* Remove decorative animations */
    }
    
    /* Simplify 3D viewer */
    #chair-3d-container {
        pointer-events: none; /* Disable interactions */
    }
}
```

### Touch Optimization
- Passive touch event listeners
- Reduced animation on mobile
- Simplified 3D rendering

## 🎓 Advanced Techniques

### Custom Animation Loop
```javascript
class CustomAnimator {
    constructor() {
        this.rafId = null;
        this.elements = [];
    }
    
    add(element, updateFn) {
        this.elements.push({ element, updateFn });
    }
    
    animate = () => {
        this.elements.forEach(({ element, updateFn }) => {
            updateFn(element);
        });
        this.rafId = requestAnimationFrame(this.animate);
    }
    
    start() {
        this.animate();
    }
}
```

### Intersection Observer for Lazy Animation
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
```

## 📚 Resources

- [GPU vs CPU Rendering](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [Three.js Performance Tips](https://discoverthreejs.com/tips-and-tricks/)
- [Web Performance Best Practices](https://web.dev/performance/)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)

## 🤝 Contributing

When adding new animations:
1. Use only `transform` and `opacity`
2. Add `will-change` hints
3. Test on low-end devices
4. Monitor FPS impact
5. Document performance characteristics

## 📄 License

MIT License - Feel free to use in your projects!

---

**Built for Performance** 🚀 | **Optimized for GPU** 🎮 | **Smooth as Butter** 🧈
