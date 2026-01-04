// ============================================
// FLOATING DOCK NAVIGATION - TOP NAVBAR
// Replaces the nav-menu in navbar
// ============================================

class FloatingDock {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.replacNavMenu());
        } else {
            this.replaceNavMenu();
        }
    }

    replaceNavMenu() {
        // Find the existing nav-menu
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) {
            console.warn('Nav menu not found');
            return;
        }

        // Create dock container
        const dock = document.createElement('div');
        dock.className = 'floating-dock';

        // Navigation items
        const navItems = [
            { title: 'Browse', href: '#browse' },
            { title: 'Local Stores', href: '#stores' },
            { title: 'Customize', href: '#custom' },
            { title: 'About', href: '#about' }
        ];

        // Create dock items
        navItems.forEach((item, index) => {
            const link = document.createElement('a');
            link.className = 'floating-dock-item';
            link.href = item.href;
            link.textContent = item.title;
            
            // Add active class to first item
            if (index === 0) {
                link.classList.add('active');
            }

            // Click handler
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active from all items
                dock.querySelectorAll('.floating-dock-item').forEach(el => {
                    el.classList.remove('active');
                });
                
                // Add active to clicked item
                link.classList.add('active');
                
                // Smooth scroll to section
                const target = document.querySelector(item.href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            dock.appendChild(link);
        });

        // Replace nav-menu with dock
        navMenu.parentNode.replaceChild(dock, navMenu);

        // Update active state on scroll
        this.updateActiveOnScroll();
    }

    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const dockItems = document.querySelectorAll('.floating-dock-item');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            dockItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
    }
}

// Initialize floating dock
const floatingDock = new FloatingDock();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FloatingDock;
}
