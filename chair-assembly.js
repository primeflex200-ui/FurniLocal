// ============================================
// CHAIR EXPLODED ASSEMBLY ANIMATION
// Parts fly in from different directions and assemble
// ============================================

(function() {
    function playAssemblyAnimation() {
        const parts = document.querySelectorAll('.chair-part');
        
        parts.forEach((part) => {
            // Reset to exploded state
            part.style.opacity = '0';
            part.style.transform = getExplodedTransform(part.classList);
            
            // Force reflow
            part.offsetHeight;
            
            // Animate to assembled position
            setTimeout(() => {
                part.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                part.style.opacity = '1';
                part.style.transform = getAssembledTransform(part.classList);
            }, getDelay(part.classList));
        });
    }

    function getExplodedTransform(classList) {
        if (classList.contains('part-backrest')) {
            return 'translate(0, -200px) rotate(-5deg) scale(0.9)';
        } else if (classList.contains('part-seat')) {
            return 'translate(0, -100px) scale(0.9)';
        } else if (classList.contains('part-base')) {
            return 'translate(0, 100px) scale(0.9)';
        } else if (classList.contains('part-wheels')) {
            return 'translate(0, 180px) scale(0.9)';
        }
        return 'translate(0, 0) scale(0.9)';
    }

    function getAssembledTransform(classList) {
        if (classList.contains('part-backrest')) {
            return 'translate(0, -80px) rotate(0deg) scale(1)';
        } else if (classList.contains('part-seat')) {
            return 'translate(0, 0) scale(1)';
        } else if (classList.contains('part-base')) {
            return 'translate(0, 60px) scale(1)';
        } else if (classList.contains('part-wheels')) {
            return 'translate(0, 120px) scale(1)';
        }
        return 'translate(0, 0) scale(1)';
    }

    function getDelay(classList) {
        if (classList.contains('part-wheels')) return 100;
        if (classList.contains('part-base')) return 300;
        if (classList.contains('part-seat')) return 500;
        if (classList.contains('part-backrest')) return 700;
        return 0;
    }

    // Play animation on load
    window.addEventListener('load', () => {
        setTimeout(playAssemblyAnimation, 800);
    });

    // Replay button
    const replayBtn = document.getElementById('replayAssembly');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            playAssemblyAnimation();
        });
    }
})();
