/**
 * Animation utilities for the website
 * This file contains animation-specific functionality to enhance the user experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initScrollAnimations();
    initHoverAnimations();
    animateHeroElements();
    setupParallaxEffect();
});

/**
 * Scroll-triggered animations
 * Shows elements with fade-in and slide effects as they enter the viewport
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .fade-up, .fade-down, .fade-left, .fade-right');
    
    // Set initial state - hide elements
    animatedElements.forEach(el => {
        if (el.classList.contains('fade-in')) {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.8s ease-out';
        } else {
            el.style.opacity = '0';
            el.style.transform = getInitialTransform(el);
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }
    });

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When element enters viewport, animate it
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate(0, 0)';
                }, 100);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 }); // 15% of the element must be visible
    
    // Start observing elements
    animatedElements.forEach(el => observer.observe(el));
    
    // Helper function to get initial transform based on animation type
    function getInitialTransform(element) {
        if (element.classList.contains('fade-up')) {
            return 'translateY(30px)';
        } else if (element.classList.contains('fade-down')) {
            return 'translateY(-30px)';
        } else if (element.classList.contains('fade-left')) {
            return 'translateX(30px)';
        } else if (element.classList.contains('fade-right')) {
            return 'translateX(-30px)';
        }
        return 'none';
    }
}

/**
 * Hover animations for interactive elements
 */
function initHoverAnimations() {
    // Card hover effects
    const cards = document.querySelectorAll('.feature-item, .service-item, .blog-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--box-shadow-lg)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--box-shadow-sm)';
        });
    });
    
    // Button hover effects with ripple
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            // Add ripple element if it doesn't exist
            if (!this.querySelector('.btn-ripple')) {
                const ripple = document.createElement('span');
                ripple.classList.add('btn-ripple');
                this.appendChild(ripple);
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            // Remove ripple after animation completes
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.addEventListener('animationend', function() {
                    if (ripple.parentNode === btn) {
                        btn.removeChild(ripple);
                    }
                });
                ripple.style.animation = 'ripple-out 0.5s ease-out forwards';
            }
        });
    });
}

/**
 * Hero section specific animations
 */
function animateHeroElements() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    // Staggered animation for hero elements
    const elements = heroContent.querySelectorAll('.animate-slide-up');
    elements.forEach((el, index) => {
        // Add animation delay
        el.style.animation = `slideUp 1s ${index * 0.2}s forwards ease-out`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
    });
    
    // Define keyframe animation
    if (!document.querySelector('#hero-animations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'hero-animations';
        styleSheet.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes ripple-out {
                0% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                }
            }
            
            .btn-ripple {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120%;
                height: 120%;
                background: rgba(255, 255, 255, 0.2);
                border-radius: inherit;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: -1;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

/**
 * Parallax scrolling effect for background elements
 */
function setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.1;
            const offsetY = scrollY * speed;
            element.style.transform = `translateY(${offsetY}px)`;
        });
    });
    
    // Add parallax to hero image if present
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const videoOverlay = heroSection.querySelector('.video-overlay');
        if (videoOverlay) {
            videoOverlay.classList.add('parallax');
            videoOverlay.dataset.speed = '0.05';
        }
    }
}

/**
 * Counters animation for statistics
 * @param {string} selector - CSS selector for counter elements
 * @param {number} duration - Animation duration in milliseconds
 */
function animateCounters(selector = '.stat-number', duration = 2000) {
    const counterElements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get target value from content or data attribute
                const target = parseInt(entry.target.textContent.replace(/[^0-9]/g, '')) || 
                              parseInt(entry.target.dataset.count) || 0;
                
                // Set starting point
                let count = 0;
                
                // Calculate increment step
                const increment = Math.ceil(target / (duration / 16)); // 16ms is approx. 60fps
                
                // Start counter animation
                const timer = setInterval(() => {
                    count += increment;
                    
                    // Stop at target value
                    if (count >= target) {
                        entry.target.textContent = target.toLocaleString() + (entry.target.dataset.suffix || '');
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = count.toLocaleString() + (entry.target.dataset.suffix || '');
                    }
                }, 16);
                
                // Stop observing after animation started
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe counter elements
    counterElements.forEach(el => observer.observe(el));
}

// Export functions for use in other scripts
window.siteAnimations = {
    initScrollAnimations,
    initHoverAnimations,
    animateCounters,
    animateHeroElements,
    setupParallaxEffect
};
