/**
 * UNIVENS WEBSITE SYSTEM ENGINEERING PROTOCOL (UWSEP)
 * V2: Global Corporate - Motion Precision Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initNavigation();
    initParallax();
});

function initScrollReveals() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initNavigation() {
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Use CSS classes instead of inline styles for cleaner transitions
        if (currentScroll > 100) {
            nav.classList.add('nav-compact');
        } else {
            nav.classList.remove('nav-compact');
        }

        if (currentScroll <= 0) {
            nav.classList.remove('nav-hidden');
            return;
        }
        
        if (currentScroll > lastScroll) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastScroll = currentScroll;
    });
}

function initParallax() {
    window.addEventListener('scroll', () => {
        const visuals = document.querySelectorAll('.visual-lead');
        const scrolled = window.pageYOffset;

        visuals.forEach(visual => {
            const rect = visual.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Reduced parallax factor for "slim" corporate feel (0.05 instead of 0.1)
                const shift = (rect.top * 0.05);
                visual.style.transform = `translateY(${shift}px) scale(1.05)`;
            }
        });
    });
}
