# 🚀 Quick Start Guide - 5 Minutes to First Render

## Step-by-Step Checklist

### ☐ 1. Install Blender (5 minutes)
- Go to https://www.blender.org/download/
- Download for your OS (Windows/Mac/Linux)
- Install and open Blender

### ☐ 2. Get a Chair Model (10 minutes)

**Easiest Option - Free Models:**

1. Go to https://free3d.com/
2. Search "wooden chair"
3. Download a model with separate parts
4. Recommended formats: .blend, .fbx, .obj

**Quick Links:**
- Free3D: https://free3d.com/3d-models/chair
- BlendSwap: https://www.blendswap.com/blends/furniture
- Sketchfab: https://sketchfab.com/search?q=chair&type=models

### ☐ 3. Import Chair (2 minutes)

1. Open Blender
2. Delete default cube: Select it → Press X → Delete
3. File → Import → Choose your file format
4. Navigate to downloaded chair file
5. Import

### ☐ 4. Prepare Chair (3 minutes)

**Check if parts are separate:**
- Look at Outliner panel (top right)
- Should see: Leg_1, Leg_2, Seat, Backrest, etc.

**If chair is one solid object:**
1. Select chair
2. Press Tab (Edit mode)
3. Press P → "By Loose Parts"
4. Press Tab (back to Object mode)

### ☐ 5. Run the Script (1 minute)

1. **Select all chair parts:** Press A
2. **Open Scripting workspace:** Click "Scripting" at top
3. **Load script:** Click "Open" → Select `blender_furniture_setup.py`
4. **Run:** Click "Run Script" button (or Alt+P)

**You should see:**
```
✓ Camera created at 3/4 view
✓ Studio lighting created
✓ Premium wood material created
✓ White background created
✓ Render settings configured
✓ Exploded view created
✓ SETUP COMPLETE!
```

### ☐ 6. Preview (30 seconds)

1. Press **Numpad 0** (camera view)
2. Press **Z** → Select "Rendered"
3. You should see your chair with lighting!

### ☐ 7. Render (5-30 minutes depending on PC)

1. Press **F12** to start render
2. Wait for completion
3. Image → Save As → PNG
4. Choose location and save

---

## 🎯 Expected Result

You should now have:
- ✓ Premium wooden chair visual
- ✓ 4K resolution (3840x2160)
- ✓ Professional studio lighting
- ✓ Exploded/assembly view
- ✓ Clean white background
- ✓ Ready for landing page

---

## ⚡ Troubleshooting

**"No objects selected" error:**
→ Select all chair parts (Press A) before running script

**Render is black:**
→ Make sure you're in camera view (Numpad 0)

**Can't see chair in viewport:**
→ Press Home key to frame all objects

**Script won't run:**
→ Make sure you opened the .py file, not copied text

**Render too slow:**
→ Edit script: Change `samples: 256` to `samples: 128`

---

## 📱 Need Help?

1. Check **README.md** for detailed instructions
2. Check **BLENDER_TIPS.md** for Blender shortcuts
3. Check **chair_specifications.txt** for technical details

---

## ⏭️ Next Steps

After your first render:

1. **Adjust explosion distance** if parts too close/far
2. **Fine-tune camera angle** for better composition
3. **Tweak lighting** for desired mood
4. **Render higher quality** (increase samples to 512)
5. **Create animation** (set `enable_animation: True`)

---

## 🎨 Quick Adjustments

**Make parts more separated:**
```python
# In script, change:
'explosion_distance': 0.5  # (was 0.3)
```

**Faster preview render:**
```python
# In script, change:
'samples': 64  # (was 256)
```

**Different camera angle:**
```python
# In script, change:
'camera_angle_horizontal': 30  # (was 45)
```

---

**Total Time: ~30 minutes (including render)**

Good luck! 🎉
