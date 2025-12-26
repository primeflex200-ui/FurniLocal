// ============================================
// PREMIUM FURNITURE MARKETPLACE - SCRIPTS
// ============================================

// Wrap everything in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', function() {

    // Target Cursor is initialized in cursor-standalone.js

    // ============================================
    // AUTH MODAL FUNCTIONALITY
    // ============================================
    
    const authModal = document.getElementById('authModal');
    const authModalOverlay = document.getElementById('authModalOverlay');
    const authModalClose = document.getElementById('authModalClose');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    
    // Get all "Get Started" buttons
    const getStartedButtons = document.querySelectorAll('.btn-primary');
    
    // Open modal when clicking "Get Started"
    getStartedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openAuthModal();
        });
    });
    
    // Close modal functions
    function closeAuthModal() {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function openAuthModal() {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Show login form by default
        showLoginForm();
    }
    
    // Close modal on overlay click
    if (authModalOverlay) {
        authModalOverlay.addEventListener('click', closeAuthModal);
    }
    
    // Close modal on close button click
    if (authModalClose) {
        authModalClose.addEventListener('click', closeAuthModal);
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeAuthModal();
        }
    });
    
    // Switch to signup form
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupForm();
        });
    }
    
    // Switch to login form
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
    
    function showLoginForm() {
        if (loginForm && signupForm) {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        }
    }
    
    function showSignupForm() {
        if (loginForm && signupForm) {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }
    
    // Handle login form submission (placeholder for API integration)
    const loginFormElement = document.querySelector('#loginForm form');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login attempt:', { email, password });
            alert('Login functionality will be integrated with API');
            
            // TODO: Add your API call here
            // Example:
            // fetch('/api/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // })
        });
    }
    
    // Handle signup form submission (placeholder for API integration)
    const signupFormElement = document.querySelector('#signupForm form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            console.log('Signup attempt:', { name, email, password });
            alert('Signup functionality will be integrated with API');
            
            // TODO: Add your API call here
            // Example:
            // fetch('/api/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, password })
            // })
        });
    }
    
    // Handle Google Sign-in (placeholder for API integration)
    const googleButtons = document.querySelectorAll('.btn-google');
    googleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Google Sign-in clicked');
            alert('Google Sign-in will be integrated with Google OAuth API');
            
            // TODO: Add your Google OAuth integration here
            // Example:
            // google.accounts.id.initialize({
            //     client_id: 'YOUR_GOOGLE_CLIENT_ID',
            //     callback: handleGoogleSignIn
            // });
        });
    });

    // ============================================
    // ORIGINAL FUNCTIONALITY
    // ============================================

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    if (navLinks.length > 0) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Chair image error handling (legacy support)
    const chairImage = document.getElementById('chairImage');
    const placeholder = document.querySelector('.placeholder-text');

    if (chairImage) {
        chairImage.addEventListener('error', function() {
            this.style.display = 'none';
            if (placeholder) {
                placeholder.style.display = 'block';
            }
        });

        chairImage.addEventListener('load', function() {
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            this.style.display = 'block';
        });
    }

    // Main chair image handling
    const mainChairImage = document.querySelector('.chair-main-image');
    if (mainChairImage) {
        mainChairImage.addEventListener('load', function() {
            console.log('%c✓ Chair image loaded successfully!', 'color: green; font-weight: bold;');
        });
        
        mainChairImage.addEventListener('error', function() {
            console.warn('⚠️ Chair image failed to load');
        });
    }

    // Parallax effect for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            if (scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Intersection Observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
            featureCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s ease ${index * 0.1}s`;
                observer.observe(card);
            });
        }

        // Observe contact cards
        const contactCards = document.querySelectorAll('.contact-card');
        if (contactCards.length > 0) {
            contactCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s ease ${index * 0.15}s`;
                observer.observe(card);
            });
        }
    }

    // Button click animations
    const buttons = document.querySelectorAll('button');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple && ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });
    }

    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        if (!element) return;
        
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            }
        }, 16);
    }

    // Trigger counter animation when stats come into view
    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    if (statNumbers.length > 0) {
                        statNumbers.forEach(stat => {
                            const text = stat.textContent;
                            const number = parseInt(text.replace(/\D/g, ''));
                            const suffix = text.replace(/[0-9]/g, '');
                            stat.dataset.suffix = suffix;
                            stat.textContent = '0' + suffix;
                            animateCounter(stat, number);
                        });
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            statsObserver.observe(heroStats);
        }
    }

    // Console message for developers
    console.log('%c🪑 Premium Furniture Marketplace', 'font-size: 20px; font-weight: bold; color: #2D1810;');
    console.log('%cChair image loaded from chair-main.jpg', 'font-size: 14px; color: #D4A574;');
    console.log('%cFor best results:', 'font-size: 12px; font-weight: bold;');
    console.log('• Use high-resolution images');
    console.log('• Optimize for web (compress to reasonable size)');
    console.log('• Ensure proper blending with background');

}); // End DOMContentLoaded
