// ============================================
// 3D CHAIR VIEWER - Three.js Implementation
// Premium 3D model viewer for furniture marketplace
// ============================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

class ChairViewer {
    constructor(containerId, modelPath, options = {}) {
        this.container = document.getElementById(containerId);
        this.modelPath = modelPath;
        this.options = {
            autoRotate: options.autoRotate !== false,
            autoRotateSpeed: options.autoRotateSpeed || 1.0,
            enableZoom: options.enableZoom !== false,
            enablePan: options.enablePan !== false,
            cameraDistance: options.cameraDistance || 3,
            backgroundColor: options.backgroundColor || 0xffffff,
            ...options
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.loadModel();
        this.animate();
        this.handleResize();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);
        
        // Add fog for depth
        // this.scene.fog = new THREE.Fog(0xffffff, 5, 15);
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(
            this.options.cameraDistance * 0.8,
            this.options.cameraDistance * 0.6,
            this.options.cameraDistance
        );
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance" // Optimize for performance
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Key light (main light from top-right)
        const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        this.scene.add(keyLight);

        // Fill light (softer light from left)
        const fillLight = new THREE.DirectionalLight(0xe6f2ff, 0.5);
        fillLight.position.set(-5, 3, 3);
        this.scene.add(fillLight);

        // Rim light (back light for edge definition)
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
        rimLight.position.set(0, 3, -5);
        this.scene.add(rimLight);

        // Hemisphere light for natural look
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        // Add ground plane for shadows (invisible)
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = this.options.enableZoom;
        this.controls.enablePan = this.options.enablePan;
        this.controls.autoRotate = this.options.autoRotate;
        this.controls.autoRotateSpeed = this.options.autoRotateSpeed;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 1.8;
        this.controls.target.set(0, 0.5, 0);
    }

    loadModel() {
        const loader = new GLTFLoader();
        
        // Setup Draco decoder for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);
        
        const loadingElement = document.getElementById('loading-indicator');
        
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }

        // Set a timeout to show error if loading takes too long
        const loadTimeout = setTimeout(() => {
            if (loadingElement) {
                const currentText = loadingElement.querySelector('p');
                if (currentText) {
                    currentText.innerHTML = `Still loading... (Large file)<br><small style="color: #999;">This may take up to 60 seconds</small>`;
                }
            }
        }, 10000); // 10 second warning

        console.log('Starting to load model...');

        loader.load(
            this.modelPath,
            (gltf) => {
                clearTimeout(loadTimeout);
                console.log('Model loaded successfully!');
                
                this.model = gltf.scene;

                // Center and scale the model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                // Center the model
                this.model.position.x = -center.x;
                this.model.position.y = -center.y;
                this.model.position.z = -center.z;

                // Scale to fit
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                this.model.scale.setScalar(scale);

                // Store parts for animation
                this.parts = [];
                this.partOriginalPositions = [];

                // Enable shadows and collect parts
                let meshCount = 0;
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        meshCount++;
                        child.castShadow = true;
                        child.receiveShadow = true;

                        // Enhance materials
                        if (child.material) {
                            child.material.needsUpdate = true;
                            
                            // Add some polish to materials
                            if (child.material.metalness !== undefined) {
                                child.material.metalness = Math.min(child.material.metalness * 1.2, 1);
                            }
                            if (child.material.roughness !== undefined) {
                                child.material.roughness = Math.max(child.material.roughness * 0.8, 0.1);
                            }
                        }

                        // Store parts for explosion animation
                        this.parts.push(child);
                        this.partOriginalPositions.push(child.position.clone());
                    }
                });

                console.log(`Found ${meshCount} mesh parts`);

                this.scene.add(this.model);

                // Setup animations if available
                if (gltf.animations && gltf.animations.length > 0) {
                    this.mixer = new THREE.AnimationMixer(this.model);
                    gltf.animations.forEach((clip) => {
                        this.mixer.clipAction(clip).play();
                    });
                }

                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }

                // Start assembly animation
                this.playAssemblyAnimation();

                // Trigger loaded event
                this.container.dispatchEvent(new CustomEvent('modelLoaded', { detail: { model: this.model } }));

                console.log('✓ 3D Chair model loaded and animated!');
            },
            (progress) => {
                if (progress.lengthComputable) {
                    const percent = (progress.loaded / progress.total) * 100;
                    if (loadingElement) {
                        const progressBar = loadingElement.querySelector('.progress-bar');
                        const loadingText = loadingElement.querySelector('p');
                        if (progressBar) {
                            progressBar.style.width = percent + '%';
                        }
                        if (loadingText) {
                            const mb = (progress.loaded / 1024 / 1024).toFixed(1);
                            const totalMb = (progress.total / 1024 / 1024).toFixed(1);
                            loadingText.innerHTML = `Loading: ${mb}MB / ${totalMb}MB<br><small style="color: #999;">${percent.toFixed(0)}% complete</small>`;
                        }
                    }
                    console.log(`Loading: ${percent.toFixed(0)}%`);
                } else {
                    // If total size unknown, just show loaded amount
                    if (loadingElement) {
                        const loadingText = loadingElement.querySelector('p');
                        if (loadingText) {
                            const mb = (progress.loaded / 1024 / 1024).toFixed(1);
                            loadingText.innerHTML = `Loading: ${mb}MB...<br><small style="color: #999;">Please wait</small>`;
                        }
                    }
                }
            },
            (error) => {
                clearTimeout(loadTimeout);
                console.error('Error loading 3D model:', error);
                if (loadingElement) {
                    loadingElement.innerHTML = `
                        <p style="color: #ff4444; font-weight: 600;">Failed to load 3D model</p>
                        <p style="color: #666; font-size: 14px;">${error.message || 'Unknown error'}</p>
                        <button onclick="location.reload()" style="margin-top: 16px; padding: 12px 24px; background: #2D1810; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit;">Reload Page</button>
                    `;
                }
            }
        );
    }

    playAssemblyAnimation() {
        if (!this.parts || this.parts.length === 0) return;

        // Calculate center of model
        const modelCenter = new THREE.Vector3();
        this.model.getWorldPosition(modelCenter);

        // Explode parts outward first
        this.parts.forEach((part, index) => {
            const originalPos = this.partOriginalPositions[index];
            
            // Calculate direction from center
            const direction = new THREE.Vector3()
                .copy(originalPos)
                .normalize();

            // Explode distance based on part position
            const explosionDistance = 1.5;
            const explodedPos = originalPos.clone().add(
                direction.multiplyScalar(explosionDistance)
            );

            // Set initial exploded position
            part.position.copy(explodedPos);
            part.userData.opacity = 0;

            // Animate assembly with staggered timing
            const delay = index * 0.05; // Stagger each part
            const duration = 1.2;

            setTimeout(() => {
                this.animatePartAssembly(part, originalPos, duration);
            }, delay * 1000);
        });
    }

    animatePartAssembly(part, targetPosition, duration) {
        const startPosition = part.position.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            // Interpolate position
            part.position.lerpVectors(startPosition, targetPosition, eased);

            // Fade in
            if (part.material) {
                part.material.opacity = eased;
                part.material.transparent = true;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Reset material transparency
                if (part.material) {
                    part.material.transparent = false;
                    part.material.opacity = 1;
                }
            }
        };

        animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        const delta = this.clock.getDelta();

        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Render scene
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

    // Public methods
    setAutoRotate(enabled) {
        if (this.controls) {
            this.controls.autoRotate = enabled;
        }
    }

    resetCamera() {
        if (this.camera && this.controls) {
            this.camera.position.set(
                this.options.cameraDistance * 0.8,
                this.options.cameraDistance * 0.6,
                this.options.cameraDistance
            );
            this.controls.target.set(0, 0.5, 0);
            this.controls.update();
        }
    }

    replayAssembly() {
        if (this.parts && this.parts.length > 0) {
            this.playAssemblyAnimation();
        }
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        if (this.model) {
            this.scene.remove(this.model);
        }
    }
}

// Initialize viewer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewer);
} else {
    initViewer();
}

function initViewer() {
    const container = document.getElementById('chair-3d-container');
    if (container) {
        window.chairViewer = new ChairViewer('chair-3d-container', 'office_chair.glb', {
            autoRotate: true,
            autoRotateSpeed: 1.5,
            enableZoom: true,
            enablePan: false,
            cameraDistance: 3.5,
            backgroundColor: 0xffffff
        });

        // Add interaction hints
        setTimeout(() => {
            const hint = document.querySelector('.viewer-hint');
            if (hint) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 500);
            }
        }, 3000);

        // Replay button handler
        const replayBtn = document.getElementById('replayAnimation');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                if (window.chairViewer) {
                    window.chairViewer.replayAssembly();
                }
            });
        }
    }
}

export default ChairViewer;
