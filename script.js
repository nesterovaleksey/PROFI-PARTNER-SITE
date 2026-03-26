// Force page to top on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll reveal animation
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    fadeElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.padding = '20px 0';
        }
    });

    // Spotlight glow effect for cards
    const glowItems = document.querySelectorAll('.adv-card');
    glowItems.forEach(item => {
        item.addEventListener('pointermove', (e) => {
            const rect = item.getBoundingClientRect();
            // Move ::before shadow using css vars var(--x) and var(--y)
            item.style.setProperty('--x', e.clientX - rect.left);
            item.style.setProperty('--y', e.clientY - rect.top);
        });
    });

    // Floating Action Button Menu
    const fabContainer = document.querySelector('.fab-container');
    const fabMain = document.querySelector('.fab-main');
    if (fabContainer && fabMain) {
        fabMain.addEventListener('click', () => {
            fabContainer.classList.toggle('active');
        });
        
        // Add ripple to fab main and items
        const addRipple = function(e) {
            const rect = this.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            this.appendChild(circle);
        };
        
        fabMain.addEventListener('mousedown', addRipple);
        document.querySelectorAll('.fab-item').forEach(item => {
            item.addEventListener('mousedown', addRipple);
        });
    }

    // Handle 3D model specific configurations if needed
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
        modelViewer.addEventListener('load', () => {
            console.log('3D Model loaded successfully');
            // We can trigger an intro animation here
        });
    }

    // Optimized Canvas Stars Background
    const canvas = document.createElement('canvas');
    canvas.id = 'star-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    let w, h;
    const stars = [];
    const numStars = 60;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.5 + 0.1, // Parallax depth
            alpha: Math.random(),
            alphaChange: (Math.random() * 0.02) - 0.01 // Twinkle speed
        });
    }

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener('scroll', () => {
        scrollVelocity = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
    });

    function animateStars() {
        ctx.clearRect(0, 0, w, h);
        
        // Decay velocity smoothly back to 0
        scrollVelocity *= 0.9;
        
        stars.forEach(star => {
            const stretchAmount = Math.abs(scrollVelocity) * star.speed * 0.5;
            const stretch = Math.max(0, stretchAmount);
            
            // Move opposite to scroll direction
            star.y -= scrollVelocity * star.speed;

            // Wrap around edges
            if (star.y < -50) star.y = h + 50;
            if (star.y > h + 50) star.y = -50;
            
            // Twinkle logic
            star.alpha += star.alphaChange;
            if(star.alpha <= 0.2) {
                star.alpha = 0.2;
                star.alphaChange *= -1;
            } else if (star.alpha >= 1) {
                star.alpha = 1;
                star.alphaChange *= -1;
            }

            ctx.globalAlpha = star.alpha;
            ctx.fillStyle = '#ffffff';
            
            ctx.beginPath();
            if (stretch > 0.5 && ctx.ellipse) {
                // Draw stretched ellipse (Warp effect)
                ctx.ellipse(star.x, star.y, star.radius, star.radius + stretch, 0, 0, Math.PI * 2);
            } else {
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            }
            ctx.fill();
        });
        
        requestAnimationFrame(animateStars);
    }
    animateStars();
});
