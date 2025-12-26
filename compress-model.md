# Model is Too Large - Optimization Guide

## ⚠️ Current Issue

Your `office_chair.glb` file is **64MB** which is too large for web use!

**Recommended size:** 5-10MB maximum
**Current size:** 64MB
**Loading time:** 30-60 seconds on average connection

## 🔧 Quick Fixes

### Option 1: Use Online Compression Tool (Easiest)

1. Go to: https://gltf.report/
2. Upload your `office_chair.glb`
3. Click "Optimize" or "Compress"
4. Download the optimized version
5. Replace the file

### Option 2: Use gltf-pipeline (Command Line)

```bash
# Install
npm install -g gltf-pipeline

# Compress
gltf-pipeline -i office_chair.glb -o office_chair_compressed.glb -d
```

### Option 3: Use Blender

1. Open `office_chair.glb` in Blender
2. Select all meshes
3. Decimate modifier (reduce polygon count)
4. Export as GLB with compression
5. Settings:
   - Compression: ON
   - Draco compression: ON
   - Texture size: Reduce to 1024x1024

### Option 4: Use glTF-Transform

```bash
npm install -g @gltf-transform/cli

# Optimize
gltf-transform optimize office_chair.glb office_chair_optimized.glb
```

## 📊 Optimization Checklist

- [ ] Reduce polygon count (use decimation)
- [ ] Compress textures (max 2048x2048)
- [ ] Remove unused materials
- [ ] Enable Draco compression
- [ ] Remove animations if not needed
- [ ] Merge duplicate materials
- [ ] Remove hidden geometry

## 🎯 Target Specifications

**For Web:**
- File size: < 10MB
- Polygons: < 100k triangles
- Textures: 1024x1024 or 2048x2048
- Format: GLB with Draco compression

## 🚀 Current Workaround

The viewer now shows:
- Loading progress with MB counter
- Timeout warning after 10 seconds
- Retry button if it fails
- The model WILL load, just takes time

## 💡 Temporary Solution

While you optimize, the current code will:
1. Show loading progress
2. Display file size being loaded
3. Warn if taking too long
4. Eventually load (be patient!)

## ⚡ After Optimization

Once you have a smaller file:
1. Replace `office_chair.glb` with optimized version
2. Reload page
3. Should load in 2-5 seconds!

---

**The model IS loading, it's just very large. Please wait or optimize the file!**
