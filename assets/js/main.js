// This file contains the main JavaScript functionality for the website, including event listeners and DOM manipulation.

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Add dropdown toggle functionality for mobile
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        
        // Only on mobile view, make the parent link toggle the dropdown
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                // Prevent navigating to "#" href
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                
                // Toggle active class on parent
                this.parentElement.classList.toggle('active');
                
                // Close other open dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // Update dropdown behavior when screen size changes
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            dropdownItems.forEach(item => {
                // Remove click event handlers for larger screens
                const link = item.querySelector('a');
                link.removeEventListener('click', function(){});
                
                // Remove active class that might have been applied
                item.classList.remove('active');
            });
        }
    });

    // Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Service tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            const tabId = this.getAttribute('data-tab');
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Testimonial slider - completely redesigned
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotBtns = document.querySelectorAll('.dot-btn');
    let currentSlide = 0;
    const slideCount = testimonials.length;

    if (testimonials.length > 0 && prevBtn && nextBtn) {
        // Initialize first slide
        updateSlides();

        // Event listeners for navigation
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });

        // Dot navigation
        dotBtns.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Functions to control slider
        function goToSlide(index) {
            // Handle index wrapping
            if (index < 0) {
                index = slideCount - 1;
            } else if (index >= slideCount) {
                index = 0;
            }
            
            // Skip if already on this slide
            if (currentSlide === index) return;
            
            // Update current slide
            currentSlide = index;
            updateSlides();
        }

        function updateSlides() {
            // Update testimonial classes
            testimonials.forEach((slide, i) => {
                // Remove all classes
                slide.classList.remove('active', 'prev');
                
                // Set appropriate class based on position relative to current slide
                if (i === currentSlide) {
                    slide.classList.add('active');
                } else if (i === ((currentSlide - 1 + slideCount) % slideCount)) {
                    slide.classList.add('prev');
                }
            });
            
            // Update dot buttons
            dotBtns.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
                dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
            });
        }

        // Auto-advance slides
        let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

        // Pause auto-advance on hover or focus
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
            });
            
            sliderContainer.addEventListener('focusin', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('focusout', () => {
                slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
            });
        }
    }

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Form validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const message = document.querySelector('#message').value;

            if (name && email && message) {
                // Show success message with animation
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Form submitted successfully!';
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => successMessage.remove(), 500);
                }, 3000);
            } else {
                // Show error message with animation
                const errorFields = [];
                if (!name) errorFields.push('name');
                if (!email) errorFields.push('email');
                if (!message) errorFields.push('message');
                
                errorFields.forEach(field => {
                    const input = document.querySelector(`#${field}`);
                    input.classList.add('error');
                    
                    // Remove error class on input
                    input.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                });
            }
        });
    }
    
    // Add image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});