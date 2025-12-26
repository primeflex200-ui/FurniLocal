// ============================================
// TARGET CURSOR - Standalone Version (No Module)
// Premium interactive cursor for furniture marketplace
// ============================================

(function() {
    // Import GSAP from CDN (will be loaded in HTML)
    const { gsap } = window;

    class TargetCursor {
        constructor(options = {}) {
            this.options = {
                targetSelector: options.targetSelector || '.cursor-target',
                spinDuration: options.spinDuration || 2,
                hideDefaultCursor: options.hideDefaultCursor !== false,
                hoverDuration: options.hoverDuration || 0.2,
                parallaxOn: options.parallaxOn !== false
            };

            this.constants = {
                borderWidth: 3,
                cornerSize: 12
            };

            this.cursorRef = null;
            this.cornersRef = [];
            this.dotRef = null;
            this.spinTl = null;
            this.isActive = false;
            this.targetCornerPositions = null;
            this.activeStrength = { current: 0 };
            this.activeTarget = null;
            this.currentLeaveHandler = null;
            this.resumeTimeout = null;

            // Check if mobile
            this.isMobile = this.checkMobile();

            if (!this.isMobile) {
                this.init();
            }
        }

        checkMobile() {
            const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 768;
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
            const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
            return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
        }

        init() {
            // Create cursor HTML
            this.createCursor();

            // Hide default cursor
            if (this.options.hideDefaultCursor) {
                document.body.style.cursor = 'none';
            }

            // Set initial position
            gsap.set(this.cursorRef, {
                xPercent: -50,
                yPercent: -50,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });

            // Create spin animation
            this.createSpinTimeline();

            // Add event listeners
            this.addEventListeners();
        }

        createCursor() {
            const wrapper = document.createElement('div');
            wrapper.className = 'target-cursor-wrapper';
            wrapper.innerHTML = `
                <div class="target-cursor-dot"></div>
                <div class="target-cursor-corner corner-tl"></div>
                <div class="target-cursor-corner corner-tr"></div>
                <div class="target-cursor-corner corner-br"></div>
                <div class="target-cursor-corner corner-bl"></div>
            `;

            document.body.appendChild(wrapper);

            this.cursorRef = wrapper;
            this.dotRef = wrapper.querySelector('.target-cursor-dot');
            this.cornersRef = Array.from(wrapper.querySelectorAll('.target-cursor-corner'));
        }

        createSpinTimeline() {
            if (this.spinTl) {
                this.spinTl.kill();
            }

            this.spinTl = gsap.timeline({ repeat: -1 })
                .to(this.cursorRef, {
                    rotation: '+=360',
                    duration: this.options.spinDuration,
                    ease: 'none'
                });
        }

        moveCursor(x, y) {
            if (!this.cursorRef) return;

            gsap.to(this.cursorRef, {
                x,
                y,
                duration: 0.1,
                ease: 'power3.out'
            });
        }

        tickerFn = () => {
            if (!this.targetCornerPositions || !this.cursorRef || !this.cornersRef.length) {
                return;
            }

            const strength = this.activeStrength.current;
            if (strength === 0) return;

            const cursorX = gsap.getProperty(this.cursorRef, 'x');
            const cursorY = gsap.getProperty(this.cursorRef, 'y');

            this.cornersRef.forEach((corner, i) => {
                const currentX = gsap.getProperty(corner, 'x');
                const currentY = gsap.getProperty(corner, 'y');

                const targetX = this.targetCornerPositions[i].x - cursorX;
                const targetY = this.targetCornerPositions[i].y - cursorY;

                const finalX = currentX + (targetX - currentX) * strength;
                const finalY = currentY + (targetY - currentY) * strength;

                const duration = strength >= 0.99 ? (this.options.parallaxOn ? 0.2 : 0) : 0.05;

                gsap.to(corner, {
                    x: finalX,
                    y: finalY,
                    duration: duration,
                    ease: duration === 0 ? 'none' : 'power1.out',
                    overwrite: 'auto'
                });
            });
        }

        handleMouseMove = (e) => {
            this.moveCursor(e.clientX, e.clientY);
        }

        handleMouseDown = () => {
            if (!this.dotRef) return;
            gsap.to(this.dotRef, { scale: 0.7, duration: 0.3 });
            gsap.to(this.cursorRef, { scale: 0.9, duration: 0.2 });
        }

        handleMouseUp = () => {
            if (!this.dotRef) return;
            gsap.to(this.dotRef, { scale: 1, duration: 0.3 });
            gsap.to(this.cursorRef, { scale: 1, duration: 0.2 });
        }

        handleMouseOver = (e) => {
            const directTarget = e.target;
            const allTargets = [];
            let current = directTarget;

            while (current && current !== document.body) {
                if (current.matches(this.options.targetSelector)) {
                    allTargets.push(current);
                }
                current = current.parentElement;
            }

            const target = allTargets[0] || null;
            if (!target || !this.cursorRef || !this.cornersRef.length) return;
            if (this.activeTarget === target) return;

            if (this.activeTarget) {
                this.cleanupTarget(this.activeTarget);
            }

            if (this.resumeTimeout) {
                clearTimeout(this.resumeTimeout);
                this.resumeTimeout = null;
            }

            this.activeTarget = target;

            // Kill existing animations
            this.cornersRef.forEach(corner => gsap.killTweensOf(corner));
            gsap.killTweensOf(this.cursorRef, 'rotation');
            this.spinTl?.pause();
            gsap.set(this.cursorRef, { rotation: 0 });

            const rect = target.getBoundingClientRect();
            const { borderWidth, cornerSize } = this.constants;
            const cursorX = gsap.getProperty(this.cursorRef, 'x');
            const cursorY = gsap.getProperty(this.cursorRef, 'y');

            this.targetCornerPositions = [
                { x: rect.left - borderWidth, y: rect.top - borderWidth },
                { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
                { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
                { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
            ];

            this.isActive = true;
            gsap.ticker.add(this.tickerFn);

            gsap.to(this.activeStrength, {
                current: 1,
                duration: this.options.hoverDuration,
                ease: 'power2.out'
            });

            this.cornersRef.forEach((corner, i) => {
                gsap.to(corner, {
                    x: this.targetCornerPositions[i].x - cursorX,
                    y: this.targetCornerPositions[i].y - cursorY,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });

            // Create leave handler
            const leaveHandler = () => {
                gsap.ticker.remove(this.tickerFn);
                this.isActive = false;
                this.targetCornerPositions = null;
                gsap.set(this.activeStrength, { current: 0, overwrite: true });
                this.activeTarget = null;

                if (this.cornersRef.length) {
                    gsap.killTweensOf(this.cornersRef);
                    const { cornerSize } = this.constants;
                    const positions = [
                        { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
                        { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
                        { x: cornerSize * 0.5, y: cornerSize * 0.5 },
                        { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
                    ];

                    const tl = gsap.timeline();
                    this.cornersRef.forEach((corner, index) => {
                        tl.to(corner, {
                            x: positions[index].x,
                            y: positions[index].y,
                            duration: 0.3,
                            ease: 'power3.out'
                        }, 0);
                    });
                }

                this.resumeTimeout = setTimeout(() => {
                    if (!this.activeTarget && this.cursorRef && this.spinTl) {
                        const currentRotation = gsap.getProperty(this.cursorRef, 'rotation');
                        const normalizedRotation = currentRotation % 360;

                        this.spinTl.kill();
                        this.spinTl = gsap.timeline({ repeat: -1 })
                            .to(this.cursorRef, {
                                rotation: '+=360',
                                duration: this.options.spinDuration,
                                ease: 'none'
                            });

                        gsap.to(this.cursorRef, {
                            rotation: normalizedRotation + 360,
                            duration: this.options.spinDuration * (1 - normalizedRotation / 360),
                            ease: 'none',
                            onComplete: () => {
                                this.spinTl?.restart();
                            }
                        });
                    }
                    this.resumeTimeout = null;
                }, 50);

                this.cleanupTarget(target);
            };

            this.currentLeaveHandler = leaveHandler;
            target.addEventListener('mouseleave', leaveHandler);
        }

        handleScroll = () => {
            if (!this.activeTarget || !this.cursorRef) return;

            const mouseX = gsap.getProperty(this.cursorRef, 'x');
            const mouseY = gsap.getProperty(this.cursorRef, 'y');
            const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);

            const isStillOverTarget = elementUnderMouse &&
                (elementUnderMouse === this.activeTarget ||
                 elementUnderMouse.closest(this.options.targetSelector) === this.activeTarget);

            if (!isStillOverTarget && this.currentLeaveHandler) {
                this.currentLeaveHandler();
            }
        }

        cleanupTarget(target) {
            if (this.currentLeaveHandler) {
                target.removeEventListener('mouseleave', this.currentLeaveHandler);
            }
            this.currentLeaveHandler = null;
        }

        addEventListeners() {
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('mouseover', this.handleMouseOver, { passive: true });
            window.addEventListener('scroll', this.handleScroll, { passive: true });
            window.addEventListener('mousedown', this.handleMouseDown);
            window.addEventListener('mouseup', this.handleMouseUp);
        }

        destroy() {
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('mouseover', this.handleMouseOver);
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('mousedown', this.handleMouseDown);
            window.removeEventListener('mouseup', this.handleMouseUp);

            if (this.activeTarget) {
                this.cleanupTarget(this.activeTarget);
            }

            if (this.tickerFn) {
                gsap.ticker.remove(this.tickerFn);
            }

            this.spinTl?.kill();

            if (this.cursorRef) {
                this.cursorRef.remove();
            }

            if (this.options.hideDefaultCursor) {
                document.body.style.cursor = '';
            }
        }
    }

    // Make it globally available
    window.TargetCursor = TargetCursor;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.furnitureCursor = new TargetCursor({
                targetSelector: '.cursor-target',
                spinDuration: 2,
                hideDefaultCursor: true,
                hoverDuration: 0.2,
                parallaxOn: true
            });
        });
    } else {
        window.furnitureCursor = new TargetCursor({
            targetSelector: '.cursor-target',
            spinDuration: 2,
            hideDefaultCursor: true,
            hoverDuration: 0.2,
            parallaxOn: true
        });
    }
})();
