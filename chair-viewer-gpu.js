// ============================================
// GPU-OPTIMIZED 3D CHAIR VIEWER
// WebGL hardware acceleration
// Optimized for high traffic and smooth 60+ FPS
// ============================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

class GPUChairViewer {
    constructor(containerId, modelPath) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.rafId = null;
        this.isAnimating = false;
        this.autoRotate = true;
        this.rotationSpeed = 0.003;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.loadModel();
        this.handleResize();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        
        // Optimize scene
        this.scene.matrixAutoUpdate = false;
        this.scene.autoUpdate = false;
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(3, 1.5, 3);
        this.camera.lookAt(0, 0.5, 0);
        this.camera.matrixAutoUpdate = false;
        this.camera.updateMatrix();
    }

    setupRenderer() {
        // Maximum GPU optimization
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false
        });

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Optimize renderer settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.autoUpdate = false; // Static shadows
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Performance optimizations
        this.renderer.info.autoReset = false;
        this.renderer.sortObjects = false;
        
        this.container.appendChild(this.renderer.domElement);
        
        console.log('🎮 GPU Renderer initialized:', this.renderer.capabilities);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        ambientLight.matrixAutoUpdate = false;
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.matrixAutoUpdate = false;
        mainLight.updateMatrix();
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-3, 2, -3);
        fillLight.matrixAutoUpdate = false;
        fillLight.updateMatrix();
        this.scene.add(fillLight);

        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        hemiLight.matrixAutoUpdate = false;
        this.scene.add(hemiLight);
    }

    loadModel() {
        const loader = new GLTFLoader();
        
        // Draco compression for faster loading
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);
        
        const startTime = performance.now();

        loader.load(
            this.modelPath,
            (gltf) => {
                const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
                console.log(`✅ Model loaded in ${loadTime}s`);
                
                this.model = gltf.scene;
                this.optimizeModelForGPU();
                this.centerAndScaleModel();
                this.scene.add(this.model);
                
                // Update shadows once
                this.renderer.shadowMap.needsUpdate = true;
                
                // Start animation
                this.startAnimation();
                
                console.log('🚀 GPU-optimized chair ready');
            },
            (progress) => {
                if (progress.lengthComputable) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    console.log(`Loading: ${percent}%`);
                }
            },
            (error) => {
                console.error('❌ Error loading model:', error);
            }
        );
    }

    optimizeModelForGPU() {
        let meshCount = 0;
        let materialCount = 0;

        this.model.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                
                // Disable auto-updates for static geometry
                child.matrixAutoUpdate = false;
                child.frustumCulled = true;
                
                // Shadow optimization
                child.castShadow = true;
                child.receiveShadow = true;

                // Material optimization
                if (child.material) {
                    materialCount++;
                    
                    // Reduce material updates
                    child.material.needsUpdate = false;
                    
                    // Optimize textures
                    if (child.material.map) {
                        child.material.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                        child.material.map.generateMipmaps = true;
                        child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
                        child.material.map.magFilter = THREE.LinearFilter;
                    }
                    
                    // Disable unnecessary features
                    child.material.flatShading = false;
                    child.material.fog = false;
                }
                
                // Optimize geometry
                if (child.geometry) {
                    child.geometry.computeBoundingSphere();
                    child.geometry.computeBoundingBox();
                }
            }
        });

        // Disable auto-updates on model
        this.model.matrixAutoUpdate = false;
        this.model.updateMatrix();

        console.log(`⚡ Optimized ${meshCount} meshes, ${materialCount} materials`);
    }

    centerAndScaleModel() {
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        this.model.position.sub(center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        this.model.scale.setScalar(scale);
        
        this.model.updateMatrix();
    }

    animate = () => {
        if (!this.isAnimating) return;

        // Auto-rotate
        if (this.autoRotate && this.model) {
            this.model.rotation.y += this.rotationSpeed;
            this.model.updateMatrix();
        }

        // Render
        this.renderer.render(this.scene, this.camera);

        // Continue loop
        this.rafId = requestAnimationFrame(this.animate);
    }

    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
            console.log('▶️ Animation started');
        }
    }

    stopAnimation() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.isAnimating = false;
            console.log('⏸️ Animation stopped');
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            if (!this.container) return;

            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.camera.updateMatrix();

            this.renderer.setSize(width, height);
        });
    }

    dispose() {
        this.stopAnimation();
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
        }
        
        if (this.model) {
            this.model.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
        }
        
        console.log('🗑️ Viewer disposed');
    }
}

// Auto-initialize if container exists
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGPUViewer);
} else {
    initGPUViewer();
}

function initGPUViewer() {
    const container = document.getElementById('chair-3d-container');
    if (container) {
        window.gpuChairViewer = new GPUChairViewer('chair-3d-container', 'office_chair.glb');
        console.log('🪑 GPU Chair Viewer initialized');
    }
}

export default GPUChairViewer;
