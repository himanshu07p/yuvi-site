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
        
        countryItems.forEach(item => {
            const countryName = item.querySelector('h3').textContent.toLowerCase();
            
            // Remove any existing highlight
            item.classList.remove('countries-highlight');
            
            if (searchTerm.length > 0) {
                // If search term exists, check if country name includes it
                if (countryName.includes(searchTerm)) {
                    item.style.display = '';
                    if (countryName === searchTerm) {
                        item.classList.add('countries-highlight');
                    }
                } else {
                    item.style.display = 'none';
                }
            } else {
                // If search term is empty, show all countries
                item.style.display = '';
            }
        });
    });
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