// ============================================
// CONFIGURATION
// GPU optimization and performance settings
// ============================================

const CONFIG = {
    // Performance settings
    performance: {
        targetFPS: 60,
        maxFPS: 120,
        enableMonitoring: true, // Auto-disabled in production
        showOverlay: false, // FPS overlay disabled
        adaptiveQuality: true // Reduce quality on low FPS
    },

    // GPU settings
    gpu: {
        powerPreference: 'high-performance', // 'high-performance' | 'low-power' | 'default'
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2), // Cap at 2x for performance
        shadowMapSize: 1024, // 512 | 1024 | 2048
        enableShadows: true
    },

    // Animation settings
    animation: {
        enableParallax: true,
        enableMouseFollow: true,
        enableAutoRotate: true,
        autoRotateSpeed: 0.003,
        parallaxStrength: 0.1,
        smoothingFactor: 0.05 // Lower = smoother but slower response
    },

    // 3D Viewer settings
    viewer: {
        modelPath: 'office_chair.glb',
        cameraDistance: 3.5,
        fov: 45,
        enableControls: true,
        enableZoom: true,
        minDistance: 1.5,
        maxDistance: 8
    },

    // Image optimization
    images: {
        preload: ['chair-main.jpg'],
        lazyLoad: true,
        useWebP: false, // Enable if WebP versions available
        quality: 85
    },

    // Mobile optimization
    mobile: {
        reduceAnimations: true,
        disableParallax: true,
        simplify3D: true,
        lowerPixelRatio: true
    },

    // Development settings
    dev: {
        enableLogging: true,
        showFPS: true,
        showGPUInfo: true,
        logPerformance: true
    }
};

// Environment detection
const ENV = {
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1',
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isHighRefreshRate: window.screen && window.screen.refreshRate > 60,
    supportsWebGL: (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    })()
};

// Apply environment-specific settings
if (ENV.isDevelopment) {
    CONFIG.performance.enableMonitoring = true;
    CONFIG.performance.showOverlay = true;
    CONFIG.dev.enableLogging = true;
} else {
    CONFIG.performance.showOverlay = false;
    CONFIG.dev.enableLogging = false;
}

if (ENV.isMobile) {
    CONFIG.animation.enableParallax = !CONFIG.mobile.disableParallax;
    CONFIG.animation.enableMouseFollow = false;
    CONFIG.gpu.pixelRatio = CONFIG.mobile.lowerPixelRatio ? 1 : CONFIG.gpu.pixelRatio;
    CONFIG.gpu.shadowMapSize = 512;
    CONFIG.gpu.antialias = false;
}

if (ENV.isHighRefreshRate) {
    CONFIG.performance.targetFPS = 120;
}

// Adaptive quality based on performance
class AdaptiveQuality {
    constructor() {
        this.currentQuality = 'high';
        this.fpsHistory = [];
        this.checkInterval = null;
    }

    start() {
        if (!CONFIG.performance.adaptiveQuality) return;

        this.checkInterval = setInterval(() => {
            this.checkPerformance();
        }, 5000);
    }

    checkPerformance() {
        if (!window.perfMonitor) return;

        const metrics = window.perfMonitor.getMetrics();
        this.fpsHistory.push(metrics.fps);

        if (this.fpsHistory.length > 10) {
            this.fpsHistory.shift();
        }

        const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

        if (avgFPS < 30 && this.currentQuality !== 'low') {
            this.setQuality('low');
        } else if (avgFPS < 50 && this.currentQuality === 'high') {
            this.setQuality('medium');
        } else if (avgFPS > 55 && this.currentQuality !== 'high') {
            this.setQuality('high');
        }
    }

    setQuality(level) {
        this.currentQuality = level;
        console.log(`🎨 Quality adjusted to: ${level}`);

        switch (level) {
            case 'low':
                CONFIG.gpu.shadowMapSize = 512;
                CONFIG.gpu.antialias = false;
                CONFIG.animation.enableParallax = false;
                CONFIG.animation.enableAutoRotate = false;
                break;
            case 'medium':
                CONFIG.gpu.shadowMapSize = 1024;
                CONFIG.gpu.antialias = true;
                CONFIG.animation.enableParallax = true;
                CONFIG.animation.enableAutoRotate = true;
                break;
            case 'high':
                CONFIG.gpu.shadowMapSize = 2048;
                CONFIG.gpu.antialias = true;
                CONFIG.animation.enableParallax = true;
                CONFIG.animation.enableAutoRotate = true;
                break;
        }

        // Notify components of quality change
        window.dispatchEvent(new CustomEvent('qualitychange', { detail: { level } }));
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}

// Initialize adaptive quality
if (ENV.isDevelopment) {
    console.log('⚙️ Configuration:', CONFIG);
    console.log('🌍 Environment:', ENV);
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ENV, AdaptiveQuality };
}

// Global access
window.APP_CONFIG = CONFIG;
window.APP_ENV = ENV;

// Auto-start adaptive quality
document.addEventListener('DOMContentLoaded', () => {
    if (CONFIG.performance.adaptiveQuality) {
        window.adaptiveQuality = new AdaptiveQuality();
        window.adaptiveQuality.start();
        console.log('🎨 Adaptive quality enabled');
    }
});
