"""
BLENDER AUTOMATION SCRIPT
Premium Furniture Visualization for Landing Page Hero Section

PURPOSE: Automates the setup of camera, lighting, materials, and scene
for creating ultra-premium wooden chair visualization with exploded/assembly view.

USAGE:
1. Open Blender
2. Import your wooden chair 3D model
3. Select all chair parts
4. Go to Scripting tab
5. Open this script
6. Run script (Alt+P or click Run)
7. Adjust exploded distances if needed
8. Render (F12)

REQUIREMENTS:
- Blender 3.0 or higher
- Chair model with separate parts (legs, seat, backrest)
"""

import bpy
import math

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    # Render Settings
    'resolution_x': 3840,  # 4K width
    'resolution_y': 2160,  # 4K height
    'samples': 256,  # Higher = better quality, slower render
    'use_denoising': True,
    
    # Camera Settings
    'camera_distance': 5.0,
    'camera_angle_horizontal': 45,  # 3/4 view
    'camera_angle_vertical': 20,
    'camera_focal_length': 85,  # Portrait lens for product photography
    
    # Lighting
    'key_light_strength': 1000,
    'fill_light_strength': 300,
    'rim_light_strength': 500,
    
    # Explosion/Assembly
    'explosion_distance': 0.3,  # Distance between parts
    'enable_animation': False,  # Set True for animated assembly
    'animation_frames': 120,
    
    # Background
    'background_color': (1.0, 1.0, 1.0, 1.0),  # Pure white
}

# ============================================================================
# SCENE CLEANUP
# ============================================================================

def cleanup_scene():
    """Remove default objects"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    # Remove default lights
    for light in bpy.data.lights:
        bpy.data.lights.remove(light)
    
    print("✓ Scene cleaned")

# ============================================================================
# CAMERA SETUP
# ============================================================================

def setup_camera():
    """Create and position camera for 3/4 product view"""
    
    # Create camera
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.name = "ProductCamera"
    
    # Calculate position (3/4 view, 45 degrees)
    distance = CONFIG['camera_distance']
    h_angle = math.radians(CONFIG['camera_angle_horizontal'])
    v_angle = math.radians(CONFIG['camera_angle_vertical'])
    
    camera.location.x = distance * math.cos(h_angle) * math.cos(v_angle)
    camera.location.y = distance * math.sin(h_angle) * math.cos(v_angle)
    camera.location.z = distance * math.sin(v_angle)
    
    # Point camera at origin
    direction = camera.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    camera.rotation_euler = rot_quat.to_euler()
    
    # Camera settings
    camera.data.lens = CONFIG['camera_focal_length']
    camera.data.sensor_width = 36  # Full frame sensor
    
    # Set as active camera
    bpy.context.scene.camera = camera
    
    print(f"✓ Camera created at 3/4 view ({CONFIG['camera_angle_horizontal']}°)")
    return camera

# ============================================================================
# LIGHTING SETUP (Studio HDR Style)
# ============================================================================

def setup_lighting():
    """Create professional studio lighting setup"""
    
    # KEY LIGHT (Main light from top-right)
    bpy.ops.object.light_add(type='AREA', location=(3, -3, 4))
    key_light = bpy.context.object
    key_light.name = "KeyLight"
    key_light.data.energy = CONFIG['key_light_strength']
    key_light.data.size = 3
    key_light.data.color = (1.0, 0.98, 0.95)  # Slightly warm
    
    # Point at origin
    key_light.rotation_euler = (math.radians(45), 0, math.radians(-45))
    
    # FILL LIGHT (Softer light from opposite side)
    bpy.ops.object.light_add(type='AREA', location=(-2, 2, 2))
    fill_light = bpy.context.object
    fill_light.name = "FillLight"
    fill_light.data.energy = CONFIG['fill_light_strength']
    fill_light.data.size = 4
    fill_light.data.color = (0.95, 0.97, 1.0)  # Slightly cool
    
    # RIM LIGHT (Back light for depth)
    bpy.ops.object.light_add(type='SPOT', location=(0, -4, 3))
    rim_light = bpy.context.object
    rim_light.name = "RimLight"
    rim_light.data.energy = CONFIG['rim_light_strength']
    rim_light.data.spot_size = math.radians(60)
    rim_light.rotation_euler = (math.radians(60), 0, 0)
    
    print("✓ Studio lighting created (Key + Fill + Rim)")

# ============================================================================
# WOOD MATERIAL (Premium Polished Wood)
# ============================================================================

def create_wood_material():
    """Create realistic polished wood material with grain"""
    
    mat = bpy.data.materials.new(name="PremiumWood")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    nodes.clear()
    
    # Output node
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (400, 0)
    
    # Principled BSDF
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    
    # Wood settings for rich brown polished wood
    bsdf.inputs['Base Color'].default_value = (0.25, 0.15, 0.08, 1.0)  # Rich brown
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Specular'].default_value = 0.5
    bsdf.inputs['Roughness'].default_value = 0.15  # Polished finish
    bsdf.inputs['Clearcoat'].default_value = 0.3  # Extra polish layer
    bsdf.inputs['Clearcoat Roughness'].default_value = 0.1
    
    # Wood texture (procedural)
    tex_coord = nodes.new(type='ShaderNodeTexCoord')
    tex_coord.location = (-800, 0)
    
    mapping = nodes.new(type='ShaderNodeMapping')
    mapping.location = (-600, 0)
    mapping.inputs['Scale'].default_value = (5, 5, 5)
    
    wood_tex = nodes.new(type='ShaderNodeTexWave')
    wood_tex.location = (-400, 0)
    wood_tex.wave_type = 'BANDS'
    wood_tex.inputs['Scale'].default_value = 15.0
    wood_tex.inputs['Distortion'].default_value = 2.0
    wood_tex.inputs['Detail'].default_value = 3.0
    
    color_ramp = nodes.new(type='ShaderNodeValToRGB')
    color_ramp.location = (-200, 0)
    color_ramp.color_ramp.elements[0].color = (0.2, 0.12, 0.06, 1.0)
    color_ramp.color_ramp.elements[1].color = (0.35, 0.20, 0.10, 1.0)
    
    # Connect nodes
    links.new(tex_coord.outputs['Object'], mapping.inputs['Vector'])
    links.new(mapping.outputs['Vector'], wood_tex.inputs['Vector'])
    links.new(wood_tex.outputs['Color'], color_ramp.inputs['Fac'])
    links.new(color_ramp.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    print("✓ Premium wood material created")
    return mat

# ============================================================================
# BACKGROUND SETUP
# ============================================================================

def setup_background():
    """Create clean white background"""
    
    world = bpy.data.worlds.new("WhiteBackground")
    bpy.context.scene.world = world
    
    world.use_nodes = True
    nodes = world.node_tree.nodes
    nodes.clear()
    
    # Background node
    bg = nodes.new(type='ShaderNodeBackground')
    bg.inputs['Color'].default_value = CONFIG['background_color']
    bg.inputs['Strength'].default_value = 1.0
    
    # Output
    output = nodes.new(type='ShaderNodeOutputWorld')
    world.node_tree.links.new(bg.outputs['Background'], output.inputs['Surface'])
    
    print("✓ White background created")

# ============================================================================
# RENDER SETTINGS
# ============================================================================

def setup_render_settings():
    """Configure render settings for 4K premium output"""
    
    scene = bpy.context.scene
    
    # Resolution
    scene.render.resolution_x = CONFIG['resolution_x']
    scene.render.resolution_y = CONFIG['resolution_y']
    scene.render.resolution_percentage = 100
    
    # Engine
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = CONFIG['samples']
    scene.cycles.use_denoising = CONFIG['use_denoising']
    
    # Device (use GPU if available)
    scene.cycles.device = 'GPU'
    
    # Film (transparency for web)
    scene.render.film_transparent = True
    
    # Color management
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'High Contrast'
    
    print(f"✓ Render settings: {CONFIG['resolution_x']}x{CONFIG['resolution_y']}, {CONFIG['samples']} samples")

# ============================================================================
# EXPLODED VIEW SETUP
# ============================================================================

def create_exploded_view(selected_objects):
    """Create exploded/assembly view of chair parts"""
    
    if not selected_objects:
        print("⚠ No objects selected. Please select chair parts first.")
        return
    
    # Calculate center of all objects
    center = sum((obj.location for obj in selected_objects), bpy.mathutils.Vector()) / len(selected_objects)
    
    explosion_distance = CONFIG['explosion_distance']
    
    for obj in selected_objects:
        # Calculate direction from center
        direction = (obj.location - center).normalized()
        
        # Move object outward
        obj.location += direction * explosion_distance
        
        print(f"  → Exploded: {obj.name}")
    
    print(f"✓ Exploded view created ({len(selected_objects)} parts)")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main setup function"""
    
    print("\n" + "="*60)
    print("PREMIUM FURNITURE VISUALIZATION SETUP")
    print("="*60 + "\n")
    
    # Store selected objects (chair parts)
    selected_objects = list(bpy.context.selected_objects)
    
    if not selected_objects:
        print("⚠ WARNING: No objects selected!")
        print("Please select your chair parts before running this script.\n")
    
    # Setup scene
    # cleanup_scene()  # Commented out to preserve imported chair
    setup_camera()
    setup_lighting()
    setup_background()
    setup_render_settings()
    
    # Create and apply wood material
    wood_mat = create_wood_material()
    
    if selected_objects:
        for obj in selected_objects:
            if obj.type == 'MESH':
                # Apply wood material
                if obj.data.materials:
                    obj.data.materials[0] = wood_mat
                else:
                    obj.data.materials.append(wood_mat)
        
        print(f"✓ Wood material applied to {len(selected_objects)} objects")
        
        # Create exploded view
        create_exploded_view(selected_objects)
    
    print("\n" + "="*60)
    print("✓ SETUP COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Adjust camera angle if needed")
    print("2. Fine-tune explosion distances")
    print("3. Press F12 to render")
    print("4. Save as PNG with transparency\n")

# Run the script
if __name__ == "__main__":
    main()
