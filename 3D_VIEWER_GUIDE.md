# 3D Chair Viewer Guide

## 🪑 Interactive 3D Model Display

Your office chair GLB model is now displayed as an interactive 3D viewer in the hero section!

## ✨ Features

- **Interactive Rotation**: Drag to rotate the chair 360°
- **Zoom**: Scroll to zoom in/out
- **Auto-Rotate**: Slowly spins when idle
- **Premium Lighting**: Studio-quality 3-point lighting setup
- **Shadows**: Realistic soft shadows
- **Responsive**: Works on all screen sizes
- **Loading Progress**: Shows loading indicator with progress bar

## 🎮 Controls

### Mouse/Trackpad
- **Left Click + Drag**: Rotate the chair
- **Scroll Wheel**: Zoom in/out
- **Auto-rotate**: Enabled by default (pauses when you interact)

### Touch (Mobile/Tablet)
- **One Finger Drag**: Rotate
- **Pinch**: Zoom in/out

## 🎨 Current Setup

```javascript
{
    autoRotate: true,           // Slowly rotates when idle
    autoRotateSpeed: 1.5,       // Rotation speed
    enableZoom: true,           // Allow zoom
    enablePan: false,           // Disable panning
    cameraDistance: 3.5,        // Initial camera distance
    backgroundColor: 0xffffff   // White background
}
```

## 🔧 Customization

### Change Auto-Rotate Speed

Edit `chair-viewer.js`:
```javascript
autoRotateSpeed: 2.0,  // Faster rotation
// or
autoRotateSpeed: 0.5,  // Slower rotation
```

### Disable Auto-Rotate

```javascript
autoRotate: false,
```

### Change Camera Angle

```javascript
cameraDistance: 4.0,  // Further away
// or
cameraDistance: 2.5,  // Closer
```

### Change Background Color

```javascript
backgroundColor: 0xf5f5f5,  // Light gray
// or
backgroundColor: 0x000000,  // Black
```

### Enable Panning

```javascript
enablePan: true,  // Allow dragging to move
```

## 💡 Lighting Setup

The viewer uses professional studio lighting:

1. **Ambient Light**: Overall soft illumination
2. **Key Light**: Main directional light (top-right, warm)
3. **Fill Light**: Softer light from left (cool tone)
4. **Rim Light**: Back light for edge definition
5. **Hemisphere Light**: Natural sky/ground lighting

## 🎯 Model Optimization

The viewer automatically:
- Centers the model
- Scales to fit the viewport
- Enables shadows
- Enhances material properties (metalness, roughness)
- Optimizes for performance

## 📱 Mobile Performance

- Auto-detects device pixel ratio
- Limits to 2x for performance
- Smooth 60fps on most devices
- Touch-optimized controls

## 🔄 Programmatic Control

Access the viewer instance:

```javascript
// Available as window.chairViewer

// Disable auto-rotate
window.chairViewer.setAutoRotate(false);

// Enable auto-rotate
window.chairViewer.setAutoRotate(true);

// Reset camera to initial position
window.chairViewer.resetCamera();
```

## 🎨 Styling

The viewer container can be styled in `styles.css`:

```css
.chair-3d-viewer {
    border-radius: 24px;  /* Rounded corners */
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);  /* Add shadow */
}
```

## 🐛 Troubleshooting

**Model not loading:**
- Check browser console for errors
- Verify `office_chair.glb` is in the root folder
- Check file path in `chair-viewer.js`
- Ensure Three.js CDN is accessible

**Model too small/large:**
- Adjust `cameraDistance` value
- Model auto-scales, but you can modify the scale factor in `loadModel()`

**Performance issues:**
- Reduce `renderer.setPixelRatio()` value
- Disable shadows: `renderer.shadowMap.enabled = false`
- Lower anti-aliasing quality

**Controls not working:**
- Check if OrbitControls is loaded
- Verify no CSS `pointer-events: none` on container
- Check browser console for errors

## 📊 Browser Support

Works on:
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

Requires:
- WebGL support
- ES6 modules support
- Three.js r160+

## 🚀 Advanced Features

### Add Animations

If your GLB has animations:
```javascript
// Automatically plays all animations in the model
// Already implemented in the viewer
```

### Change Materials

```javascript
window.chairViewer.model.traverse((child) => {
    if (child.isMesh) {
        child.material.color.set(0xff0000);  // Red
        child.material.metalness = 0.8;
        child.material.roughness = 0.2;
    }
});
```

### Add Environment Map

```javascript
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envMap = pmremGenerator.fromScene(new RoomEnvironment()).texture;
scene.environment = envMap;
```

### Screenshot/Export

```javascript
// Take screenshot
const screenshot = renderer.domElement.toDataURL('image/png');
// Download or display
```

## 💡 Tips

1. **Lighting**: Adjust light positions for different moods
2. **Camera**: Change FOV for different perspectives
3. **Materials**: Enhance materials for more realism
4. **Shadows**: Adjust shadow quality vs performance
5. **Background**: Try gradient or environment maps

## 🎯 Model Requirements

For best results, your GLB should:
- Be optimized (< 10MB recommended)
- Have proper materials (PBR preferred)
- Be centered at origin
- Have reasonable polygon count
- Include textures if needed

## 📝 File Structure

```
project/
├── office_chair.glb        # Your 3D model
├── chair-viewer.js         # Viewer implementation
├── index.html              # Main page
└── styles.css              # Styles including viewer
```

## 🌟 Future Enhancements

Ideas to extend:
- Multiple chair models (color variants)
- Exploded view animation
- AR view (WebXR)
- Material customization UI
- Measurement tools
- 360° product photography mode
- Share/embed functionality

---

**Enjoy your interactive 3D chair viewer!** 🪑✨

## 🔗 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GLTFLoader Guide](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
