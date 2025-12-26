# Premium Furniture Visualization - Blender Setup

Ultra-premium, high-resolution furniture visual for landing page hero section of a modern, location-based furniture marketplace website.

## 🎯 Project Goal

Create a dynamic, exploded-view visualization of a premium wooden chair with:
- 4K ultra high-resolution output
- Professional studio lighting (HDR style)
- Polished wood material with natural grain
- Clean white background
- Semi-exploded assembly state (parts floating, ready to animate)

## 📋 Requirements

- **Blender 3.0+** (Download: https://www.blender.org/download/)
- **3D Chair Model** (separate parts: legs, seat, backrest)
- **GPU recommended** for faster rendering

## 🚀 Quick Start Workflow

### Step 1: Get a Chair Model

**Option A - Download Premium Model:**
- [TurboSquid](https://www.turbosquid.com/) - Search "wooden chair"
- [CGTrader](https://www.cgtrader.com/) - Filter by "furniture"
- [Sketchfab](https://sketchfab.com/) - Look for downloadable models

**Option B - Use Free Models:**
- [Free3D](https://free3d.com/)
- [BlendSwap](https://www.blendswap.com/)

**Important:** Make sure the chair model has **separate parts** (not a single merged object)

### Step 2: Import Chair into Blender

1. Open Blender
2. Delete default cube (X key → Delete)
3. Import your chair model:
   - File → Import → (choose format: .fbx, .obj, .blend, etc.)
4. Scale and position at origin (0, 0, 0)

### Step 3: Prepare Chair Parts

1. Select all chair parts (A key)
2. Make sure parts are separate objects:
   - In Outliner panel (top right), you should see:
     - Chair_Leg_1
     - Chair_Leg_2
     - Chair_Leg_3
     - Chair_Leg_4
     - Chair_Seat
     - Chair_Backrest
3. If chair is one object, separate it:
   - Tab (Edit mode) → P → By Loose Parts

### Step 4: Run the Automation Script

1. Keep all chair parts **selected** (A key)
2. Switch to **Scripting** workspace (top menu)
3. Click **Open** → Select `blender_furniture_setup.py`
4. Click **Run Script** button (or Alt+P)

**The script will automatically:**
- ✓ Create camera at 3/4 view (45° angle)
- ✓ Set up studio lighting (key + fill + rim lights)
- ✓ Apply premium polished wood material
- ✓ Configure white background
- ✓ Set 4K render settings
- ✓ Create exploded view (parts floating)

### Step 5: Fine-Tune (Optional)

**Adjust Explosion Distance:**
- Select individual parts
- Move them manually (G key) to adjust spacing
- Or edit `CONFIG['explosion_distance']` in script and re-run

**Adjust Camera:**
- Select camera
- Press G (move) or R (rotate)
- Or change `camera_distance` and `camera_angle_*` in script

**Adjust Lighting:**
- Select lights in Outliner
- Change strength in Light Properties panel
- Or edit `*_light_strength` values in script

### Step 6: Render

1. Press **F12** to render single image
2. Wait for render to complete (5-30 minutes depending on PC)
3. Image → Save As → PNG (with transparency)
4. Save to your project folder

**For Animation (Optional):**
- Set `enable_animation: True` in script
- Render → Render Animation (Ctrl+F12)
- Export as image sequence or video

## ⚙️ Configuration Options

Edit these values in `blender_furniture_setup.py`:

```python
CONFIG = {
    # Render Quality
    'resolution_x': 3840,        # 4K width (change to 1920 for HD)
    'resolution_y': 2160,        # 4K height (change to 1080 for HD)
    'samples': 256,              # Higher = better quality (128-512)
    
    # Camera
    'camera_distance': 5.0,      # Distance from chair
    'camera_angle_horizontal': 45,  # 3/4 view angle
    'camera_angle_vertical': 20,    # Height angle
    
    # Explosion
    'explosion_distance': 0.3,   # Space between parts (0.2-0.5)
    
    # Lighting
    'key_light_strength': 1000,  # Main light intensity
    'fill_light_strength': 300,  # Fill light intensity
}
```

## 🎨 Expected Output

**Visual Style:**
- Premium luxury product photography
- Apple-level quality
- Modern digital showroom aesthetic
- Clean, minimal, professional

**Technical Specs:**
- Resolution: 3840 x 2160 (4K)
- Format: PNG with transparency
- Color: Rich brown wood with natural grain
- Background: Pure white
- Lighting: Soft, realistic shadows and reflections

## 📁 Project Structure

```
furniture-visualization/
├── blender_furniture_setup.py    # Main automation script
├── README.md                      # This file
├── chair_model/                   # Your imported chair (create this)
│   └── wooden_chair.fbx
└── renders/                       # Output renders (create this)
    └── chair_hero_4k.png
```

## 🔧 Troubleshooting

**Problem: Script says "No objects selected"**
- Solution: Select all chair parts (A key) before running script

**Problem: Render is too dark**
- Solution: Increase light strength values in CONFIG

**Problem: Render is too slow**
- Solution: Reduce samples to 128 or resolution to 1920x1080

**Problem: Wood doesn't look realistic**
- Solution: Adjust wood texture scale in material nodes

**Problem: Parts are too far apart**
- Solution: Decrease `explosion_distance` value

**Problem: GPU not being used**
- Solution: Edit → Preferences → System → Cycles Render Devices → Enable GPU

## 🌐 Next Steps: Website Integration

After rendering, you can use the image in your landing page:

1. Export PNG with transparency
2. Optimize for web (use TinyPNG or similar)
3. Implement in HTML/CSS hero section
4. Add CSS animations for "parts coming together" effect
5. Make responsive for mobile/tablet

**Need help with website code?** Let me know and I can create the landing page HTML/CSS/JS!

## 📝 Notes

- First render will take longer (Blender compiles shaders)
- Use Viewport Shading (Z → Rendered) to preview before final render
- Save your .blend file frequently
- Render in layers if you want to composite later

## 🎯 Brand Context

This visualization represents a **location-based digital furniture marketplace** that connects customers with nearby local furniture stores, focused on:
- Premium quality
- Customization options
- Fast local delivery
- Modern shopping experience

---

**Questions or issues?** Check Blender documentation or reach out for help!
