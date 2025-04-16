/**
 * Main JavaScript file for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Handle header scroll effect
    handleHeaderScroll();
    
    // Initialize country search functionality if element exists
    if (document.getElementById('countrySearch')) {
        initCountrySearch();
    }
    
    // Initialize country slider functionality
    initCountrySlider();
    
    // Initialize testimonials if they exist
    if (document.querySelector('.testimonials-slider')) {
        initTestimonials();
    }
    
    // Initialize form validation if form exists
    if (document.getElementById('contact-form')) {
        initFormValidation();
    }
});

/**
 * Mobile navigation functionality
 */
function initMobileNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (!mobileMenuBtn || !nav) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
        
        // Toggle aria-expanded attribute for accessibility
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
    });
    
    // Setup dropdown toggles for mobile
    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentNode.classList.toggle('dropdown-active');
            }
        });
    });
}

/**
 * Handle header scroll effect
 */
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Set initial state
    checkHeaderScroll();
    
    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                checkHeaderScroll();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip dropdown toggles
            if (this.parentNode.classList.contains('has-dropdown')) return;
            
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            
            e.preventDefault();
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Country search functionality
 */
function initCountrySearch() {
    const searchInput = document.getElementById('countrySearch');
    const countryItems = document.querySelectorAll('.country-item');
    
    if (!searchInput || countryItems.length === 0) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            // Reset all countries to visible
            countryItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('countries-highlight');
            });
            
            // Make sure rows are animated
            document.querySelectorAll('.countries-row').forEach(row => {
                row.style.animation = '';
            });
            return;
        }
        
        // Pause animations when searching
        document.querySelectorAll('.countries-row').forEach(row => {
            row.style.animation = 'none';
        });
        
        let anyVisible = false;
        
        countryItems.forEach(item => {
            const countryName = item.querySelector('h3').textContent.toLowerCase();
            item.classList.remove('countries-highlight');
            
            if (countryName.includes(searchTerm)) {
                item.style.display = '';
                anyVisible = true;
                if (countryName === searchTerm) {
                    item.classList.add('countries-highlight');
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // If no matches found, show a message
        const noResultsMsg = document.getElementById('noCountriesFound');
        if (!anyVisible && !noResultsMsg) {
            const msg = document.createElement('div');
            msg.id = 'noCountriesFound';
            msg.className = 'countries-note';
            msg.textContent = 'No countries found matching your search.';
            document.querySelector('.countries-slider-container').appendChild(msg);
        } else if (anyVisible && noResultsMsg) {
            noResultsMsg.remove();
        }
    });
}

/**
 * Country slider functionality
 */
function initCountrySlider() {
    // Clone items for seamless scrolling if needed
    const row1 = document.getElementById('countriesRow1');
    const row2 = document.getElementById('countriesRow2');
    
    if (!row1 || !row2) return;
    
    // Fix for search interaction with animations
    const resetAnimations = () => {
        // Only reset if not currently searching
        if (document.getElementById('countrySearch')?.value?.trim() === '') {
            row1.style.animation = '';
            row2.style.animation = '';
        }
    };
    
    // Reset animations after window resize to prevent jumpiness
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        
        // Pause during resize
        row1.style.animation = 'none';
        row2.style.animation = 'none';
        
        resizeTimer = setTimeout(() => {
            resetAnimations();
        }, 250);
    });
    
    // Ensure animations restart properly after browser tab becomes active
    document.addEventListener('visibilitychange', resetAnimations);
}

/**
 * Testimonial slider functionality
 */
function initTestimonials() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    
    // Set initial state
    updateSlideStates();
    
    // Add click handlers for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlideStates();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlideStates();
        });
    }
    
    // Add click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlideStates();
        });
    });
    
    function updateSlideStates() {
        slides.forEach((slide, index) => {
            // Remove all classes
            slide.classList.remove('active', 'prev', 'next');
            
            // Add appropriate class
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === ((currentIndex - 1 + slides.length) % slides.length)) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

/**
 * Basic form validation
 */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                // Add error styling
                field.classList.add('error');
                // Remove error styling on input
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                }, { once: true });
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
        }
        
        if (!isValid) {
            e.preventDefault();
        }
    });
}