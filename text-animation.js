// ============================================
// TEXT SPLIT ANIMATION - Custom Implementation
// Animates text character by character on scroll
// ============================================

// Wait for GSAP to be loaded from CDN
function initTextAnimations() {
    if (typeof gsap === 'undefined') {
        console.log('⏳ Waiting for GSAP to load...');
        setTimeout(initTextAnimations, 100);
        return;
    }

    // Register ScrollTrigger
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        console.log('✓ GSAP and ScrollTrigger loaded');
    } else {
        console.warn('⚠️ ScrollTrigger not available, animations will play immediately');
    }

    class TextAnimator {
        constructor() {
            this.init();
        }

        init() {
            // Wait for fonts and DOM to be ready
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    setTimeout(() => this.animateTexts(), 100);
                });
            } else {
                setTimeout(() => this.animateTexts(), 200);
            }
        }

        // Custom split text function - preserves word structure
        splitTextIntoChars(element) {
            if (!element || !element.textContent) return [];
            
            const text = element.textContent;
            const words = text.split(' ');
            element.innerHTML = '';
            
            const allChars = [];
            
            words.forEach((word, wordIndex) => {
                if (!word) return; // Skip empty strings
                
                // Create a word wrapper to keep words together
                const wordWrapper = document.createElement('span');
                wordWrapper.style.display = 'inline-block';
                wordWrapper.style.whiteSpace = 'nowrap';
                wordWrapper.style.marginRight = '0.25em';
                
                // Split word into characters
                const chars = word.split('');
                chars.forEach((char) => {
                    const span = document.createElement('span');
                    span.style.display = 'inline-block';
                    span.style.position = 'relative';
                    span.style.willChange = 'transform, opacity';
                    span.textContent = char;
                    
                    wordWrapper.appendChild(span);
                    allChars.push(span);
                });
                
                element.appendChild(wordWrapper);
            });
            
            return allChars;
        }

        splitTextIntoWords(element) {
            if (!element || !element.textContent) return [];
            
            const text = element.textContent;
            element.innerHTML = '';
            
            const words = text.split(' ');
            const wordSpans = [];
            
            words.forEach((word, index) => {
                if (!word) return; // Skip empty strings
                
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.position = 'relative';
                wordSpan.style.marginRight = '0.25em';
                wordSpan.style.willChange = 'transform, opacity';
                wordSpan.textContent = word;
                
                element.appendChild(wordSpan);
                wordSpans.push(wordSpan);
            });
            
            return wordSpans;
        }

        animateTexts() {
            console.log('🎬 Starting text animations...');

            const useScrollTrigger = typeof ScrollTrigger !== 'undefined';

            // Animate hero title - character by character
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                const chars = this.splitTextIntoChars(heroTitle);
                console.log(`✓ Split hero title into ${chars.length} characters`);
                
                gsap.set(chars, { 
                    opacity: 0, 
                    y: 50,
                    scale: 0.8
                });
                
                const animConfig = {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.03
                };

                if (useScrollTrigger) {
                    animConfig.scrollTrigger = {
                        trigger: heroTitle,
                        start: 'top 80%',
                        once: true
                    };
                }

                gsap.to(chars, animConfig);
            }

            // Animate hero description - word by word
            const heroDesc = document.querySelector('.hero-description');
            if (heroDesc) {
                const words = this.splitTextIntoWords(heroDesc);
                console.log(`✓ Split description into ${words.length} words`);
                
                gsap.set(words, { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.9
                });
                
                const animConfig = {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: 0.05
                };

                if (useScrollTrigger) {
                    animConfig.scrollTrigger = {
                        trigger: heroDesc,
                        start: 'top 85%',
                        once: true
                    };
                }

                gsap.to(words, animConfig);
            }

            // Animate section titles - character by character
            document.querySelectorAll('.section-title').forEach(title => {
                const chars = this.splitTextIntoChars(title);
                
                gsap.set(chars, { 
                    opacity: 0, 
                    y: 40,
                    scale: 0.7
                });
                
                const animConfig = {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: 0.02
                };

                if (useScrollTrigger) {
                    animConfig.scrollTrigger = {
                        trigger: title,
                        start: 'top 85%',
                        once: true
                    };
                }

                gsap.to(chars, animConfig);
            });

            // Animate feature card titles - character by character
            document.querySelectorAll('.feature-card h3').forEach(title => {
                const chars = this.splitTextIntoChars(title);
                
                gsap.set(chars, { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.5
                });
                
                const animConfig = {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                    stagger: 0.03
                };

                if (useScrollTrigger) {
                    animConfig.scrollTrigger = {
                        trigger: title,
                        start: 'top 90%',
                        once: true
                    };
                }

                gsap.to(chars, animConfig);
            });

            // Animate stat labels - character by character
            document.querySelectorAll('.stat-label').forEach(label => {
                const chars = this.splitTextIntoChars(label);
                
                gsap.set(chars, { 
                    opacity: 0, 
                    y: 20,
                    scale: 0.8
                });
                
                const animConfig = {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    stagger: 0.02
                };

                if (useScrollTrigger) {
                    animConfig.scrollTrigger = {
                        trigger: label,
                        start: 'top 90%',
                        once: true
                    };
                }

                gsap.to(chars, animConfig);
            });

            // Animate CTA section title
            const ctaTitle = document.querySelector('.cta-content h2');
            if (ctaTitle) {
                const chars = this.splitTextIntoChars(ctaTitle);
                
                gsap.set(chars, { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.8
                });
                
                const animConfig = {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                    stagger: 0.025
                };

                if (useScrollTrigger) {
                    animConfig.scrollTrigger = {
                        trigger: ctaTitle,
                        start: 'top 85%',
                        once: true
                    };
                }

                gsap.to(chars, animConfig);
            }

            console.log('✨ All text animations initialized!');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new TextAnimator();
        });
    } else {
        new TextAnimator();
    }
}

// Start initialization
initTextAnimations();
