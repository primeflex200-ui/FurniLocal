// ============================================
// PERFORMANCE MONITOR
// Real-time FPS tracking and optimization
// ============================================

class PerformanceMonitor {
    constructor(options = {}) {
        this.options = {
            showOverlay: options.showOverlay !== false,
            targetFPS: options.targetFPS || 60,
            warningThreshold: options.warningThreshold || 50,
            ...options
        };

        this.metrics = {
            fps: 0,
            frameTime: 0,
            memory: 0,
            drawCalls: 0
        };

        this.frameCount = 0;
        this.lastTime = performance.now();
        this.rafId = null;
        this.overlay = null;

        if (this.options.showOverlay) {
            this.createOverlay();
        }

        this.start();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'perf-monitor';
        this.overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 99999;
            pointer-events: none;
            line-height: 1.6;
            min-width: 200px;
        `;
        document.body.appendChild(this.overlay);
    }

    measure = () => {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            // Calculate FPS
            this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.metrics.frameTime = (deltaTime / this.frameCount).toFixed(2);

            // Get memory usage (if available)
            if (performance.memory) {
                this.metrics.memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            }

            // Update overlay
            if (this.overlay) {
                this.updateOverlay();
            }

            // Check performance
            this.checkPerformance();

            // Reset counters
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        this.rafId = requestAnimationFrame(this.measure);
    }

    updateOverlay() {
        const fpsColor = this.getFPSColor(this.metrics.fps);
        
        this.overlay.innerHTML = `
            <div style="color: ${fpsColor}; font-weight: bold; font-size: 14px;">
                FPS: ${this.metrics.fps}
            </div>
            <div style="color: #888;">
                Frame: ${this.metrics.frameTime}ms
            </div>
            ${this.metrics.memory ? `
            <div style="color: #888;">
                Memory: ${this.metrics.memory}MB
            </div>
            ` : ''}
            <div style="color: #888; margin-top: 4px; font-size: 10px;">
                Target: ${this.options.targetFPS} FPS
            </div>
        `;
    }

    getFPSColor(fps) {
        if (fps >= this.options.targetFPS) return '#00ff00';
        if (fps >= this.options.warningThreshold) return '#ffaa00';
        return '#ff0000';
    }

    checkPerformance() {
        if (this.metrics.fps < this.options.warningThreshold) {
            console.warn(`⚠️ Low FPS detected: ${this.metrics.fps}`);
            this.suggestOptimizations();
        }
    }

    suggestOptimizations() {
        const suggestions = [];

        if (this.metrics.fps < 30) {
            suggestions.push('Consider reducing animation complexity');
            suggestions.push('Disable auto-rotate on 3D models');
            suggestions.push('Reduce particle effects');
        }

        if (this.metrics.memory > 100) {
            suggestions.push('High memory usage detected');
            suggestions.push('Consider disposing unused resources');
        }

        if (suggestions.length > 0) {
            console.log('💡 Optimization suggestions:');
            suggestions.forEach(s => console.log(`  - ${s}`));
        }
    }

    start() {
        if (!this.rafId) {
            this.lastTime = performance.now();
            this.measure();
            console.log('📊 Performance monitoring started');
        }
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
            console.log('📊 Performance monitoring stopped');
        }
    }

    destroy() {
        this.stop();
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }

    // Get current metrics
    getMetrics() {
        return { ...this.metrics };
    }

    // Log performance report
    logReport() {
        console.log('📊 Performance Report:');
        console.log(`  FPS: ${this.metrics.fps}`);
        console.log(`  Frame Time: ${this.metrics.frameTime}ms`);
        if (this.metrics.memory) {
            console.log(`  Memory: ${this.metrics.memory}MB`);
        }
        
        const status = this.metrics.fps >= this.options.targetFPS ? '✅ Excellent' :
                       this.metrics.fps >= this.options.warningThreshold ? '⚠️ Good' : '❌ Poor';
        console.log(`  Status: ${status}`);
    }
}

// GPU Detection and Optimization
class GPUDetector {
    static detect() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            console.warn('⚠️ WebGL not supported');
            return null;
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const info = {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            version: gl.getParameter(gl.VERSION),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
        };

        if (debugInfo) {
            info.unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            info.unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        return info;
    }

    static log() {
        const info = this.detect();
        if (info) {
            console.log('🎮 GPU Information:');
            console.log(`  Vendor: ${info.vendor}`);
            console.log(`  Renderer: ${info.renderer}`);
            console.log(`  Version: ${info.version}`);
            if (info.unmaskedRenderer) {
                console.log(`  GPU: ${info.unmaskedRenderer}`);
            }
        }
    }

    static isHighPerformance() {
        const info = this.detect();
        if (!info) return false;

        const renderer = (info.unmaskedRenderer || info.renderer).toLowerCase();
        
        // Check for dedicated GPU indicators
        const highPerformanceKeywords = ['nvidia', 'geforce', 'rtx', 'gtx', 'amd', 'radeon', 'rx'];
        const isHighPerf = highPerformanceKeywords.some(keyword => renderer.includes(keyword));
        
        console.log(`🎮 GPU Performance: ${isHighPerf ? 'High' : 'Integrated'}`);
        return isHighPerf;
    }
}

// Auto-initialize in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        // Show performance monitor
        window.perfMonitor = new PerformanceMonitor({
            showOverlay: true,
            targetFPS: 60,
            warningThreshold: 50
        });

        // Log GPU info
        GPUDetector.log();
        GPUDetector.isHighPerformance();

        // Log report every 10 seconds
        setInterval(() => {
            window.perfMonitor.logReport();
        }, 10000);

        console.log('💡 Performance monitoring active (development mode)');
        console.log('💡 Type perfMonitor.destroy() to disable overlay');
    });
}

export { PerformanceMonitor, GPUDetector };
