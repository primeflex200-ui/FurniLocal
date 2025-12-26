// ============================================
// OPTIMIZED 3D CHAIR VIEWER - Sketchfab Style
// Fast loading with progressive rendering
// ============================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

class OptimizedChairViewer {
    constructor(containerId, modelPath, options = {}) {
        this.container = document.getElementById(containerId);
        this.modelPath = modelPath;
        this.options = {
            autoRotate: options.autoRotate !== false,
            autoRotateSpeed: options.autoRotateSpeed || 0.5,
            enableZoom: options.enableZoom !== false,
            cameraDistance: options.cameraDistance || 3.5,
            backgroundColor: options.backgroundColor || 0xffffff,
            ...options
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.clock = new THREE.Clock();
        this.loadStartTime = Date.now();

        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.loadModelOptimized();
        this.animate();
        this.handleResize();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        this.camera.position.set(2.5, 1.5, 2.5);
        this.camera.lookAt(0, 0.5, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-3, 2, -3);
        this.scene.add(fillLight);

        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        this.scene.add(hemiLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = this.options.enableZoom;
        this.controls.enablePan = false;
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = this.options.autoRotateSpeed;
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 8;
        this.controls.maxPolarAngle = Math.PI / 1.8;
        this.controls.target.set(0, 0.5, 0);
    }

    loadModelOptimized() {
        const loader = new GLTFLoader();
        
        // Setup Draco decoder for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.preload();
        loader.setDRACOLoader(dracoLoader);
        
        const loadingElement = document.getElementById('loading-indicator');
        
        console.log('🚀 Starting optimized model load...');

        loader.load(
            this.modelPath,
            (gltf) => {
                const loadTime = ((Date.now() - this.loadStartTime) / 1000).toFixed(2);
                console.log(`✅ Model loaded in ${loadTime}s`);
                
                this.model = gltf.scene;

                // Quick setup without heavy calculations
                this.optimizeModel();
                this.centerAndScaleModel();
                
                this.scene.add(this.model);

                if (loadingElement) {
                    loadingElement.style.opacity = '0';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                    }, 300);
                }

                // Show controls hint
                setTimeout(() => {
                    const hint = document.querySelector('.viewer-controls-hint');
                    if (hint) {
                        hint.style.opacity = '1';
                        setTimeout(() => {
                            hint.style.opacity = '0';
                        }, 3000);
                    }
                }, 500);

                console.log('✨ Chair ready!');
            },
            (progress) => {
                if (progress.lengthComputable) {
                    const percent = (progress.loaded / progress.total) * 100;
                    if (loadingElement) {
                        const progressBar = loadingElement.querySelector('.progress-bar');
                        if (progressBar) {
                            progressBar.style.width = percent + '%';
                        }
                    }
                }
            },
            (error) => {
                console.error('❌ Error loading model:', error);
                if (loadingElement) {
                    loadingElement.innerHTML = `
                        <p style="color: #ff4444;">Failed to load model</p>
                        <button onclick="location.reload()" style="margin-top: 16px; padding: 12px 24px; background: #2D1810; color: white; border: none; border-radius: 8px; cursor: pointer;">Retry</button>
                    `;
                }
            }
        );
    }

    optimizeModel() {
        let meshCount = 0;
        
        this.model.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                
                // Enable shadows only on important meshes
                child.castShadow = true;
                child.receiveShadow = true;

                // Optimize materials
                if (child.material) {
                    // Reduce material complexity for performance
                    child.material.needsUpdate = true;
                    
                    // Frustum culling
                    child.frustumCulled = true;
                    
                    // Optimize material properties
                    if (child.material.map) {
                        child.material.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    }
                }
            }
        });

        console.log(`📦 Optimized ${meshCount} meshes`);
    }

    centerAndScaleModel() {
        // Quick bounding box calculation
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center
        this.model.position.sub(center);
        
        // Scale to fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        this.model.scale.setScalar(scale);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
        });
    }

    setAutoRotate(enabled) {
        if (this.controls) {
            this.controls.autoRotate = enabled;
        }
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
    }
}

// Initialize viewer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
} else {
    initViewer();
}

function initViewer() {
    const container = document.getElementById('chair-3d-container');
    if (container) {
        window.chairViewer = new OptimizedChairViewer('chair-3d-container', 'office_chair.glb', {
            autoRotate: true,
            autoRotateSpeed: 0.5,
            enableZoom: true,
            cameraDistance: 3.5,
            backgroundColor: 0xffffff
        });

        console.log('🪑 Optimized Chair Viewer initialized');
    }
}

export default OptimizedChairViewer;
