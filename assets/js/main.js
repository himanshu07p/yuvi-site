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
    
    // Mobile navigation drawer logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    let menuOverlay = document.querySelector('.menu-overlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }
    // Add close button if not present
    let closeBtn = document.querySelector('.mobile-menu-close');
    if (!closeBtn) {
        closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', 'Close menu');
        navMenu.parentNode.appendChild(closeBtn); // Place close button as sibling to nav ul
    }

    function openMenu() {
        navMenu.classList.add('active');
        mobileMenuBtn.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        closeBtn.style.display = 'flex';
        mobileMenuBtn.style.display = 'none';
        closeBtn.focus();
    }
    function closeMenu() {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        closeBtn.style.display = 'none';
        mobileMenuBtn.style.display = 'flex';
        mobileMenuBtn.focus();
    }
    // Initial state
    closeBtn.style.display = 'none';

    mobileMenuBtn.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) closeMenu();
        else openMenu();
    });
    closeBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    // Mobile dropdown logic - completely revised for working links
    function setupMobileDropdowns() {
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        // Remove old toggles if any
        document.querySelectorAll('.dropdown-toggle').forEach(btn => btn.remove());
        
        dropdownItems.forEach(item => {
            const link = item.querySelector('a');
            const dropdownMenu = item.querySelector('.dropdown-menu');
            
            // Important: Keep desktop chevron visible on mobile
            // Don't remove the chevron icon as it helps users understand it's a dropdown
            
            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'dropdown-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            toggleBtn.setAttribute('aria-label', 'Expand submenu');
            
            // Add toggle button to item (not interfering with link)
            item.appendChild(toggleBtn);
            
            // Fix #1: Ensure link is actually clickable by removing any click handlers from parent
            item.onclick = null;
            
            // Fix #2: Make sure toggle button is positioned correctly
            toggleBtn.style.position = 'absolute';
            toggleBtn.style.right = '0';
            toggleBtn.style.top = '0';
            toggleBtn.style.height = '100%';
            toggleBtn.style.width = '50px';
            toggleBtn.style.background = 'transparent';
            toggleBtn.style.zIndex = '3'; // Higher than the link
            
            // Fix #3: Make the link and toggle button have separate click events
            link.onclick = function(e) {
                // If it's a real link (not just a #), allow default action
                if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                    // Allow link to work normally
                    return true;
                }
                // Otherwise prevent default
                e.preventDefault();
            };
            
            // Add event listener to toggle button only
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Stop event from bubbling to prevent link clicks
                
                // Close other dropdowns
                dropdownItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherMenu = other.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.style.maxHeight = '0px';
                        }
                    }
                });
                
                // Toggle current dropdown
                item.classList.toggle('active');
                if (dropdownMenu) {
                    if (item.classList.contains('active')) {
                        dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + 'px';
                    } else {
                        dropdownMenu.style.maxHeight = '0px';
                    }
                }
            });
        });
        
        // Fix #4: Ensure dropdown menu links are clickable
        document.querySelectorAll('.dropdown-menu a').forEach(subLink => {
            subLink.onclick = function(e) {
                // Allow the link to work normally
                return true;
            };
        });
    }

    function teardownMobileDropdowns() {
        document.querySelectorAll('.dropdown-toggle').forEach(btn => btn.remove());
        document.querySelectorAll('.has-dropdown').forEach(item => {
            item.classList.remove('active');
            const menu = item.querySelector('.dropdown-menu');
            if (menu) menu.style.maxHeight = '';
            // Restore chevron if missing
            const link = item.querySelector('a');
            if (link && !link.querySelector('i.fa-chevron-down')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-down';
                link.appendChild(document.createTextNode(' '));
                link.appendChild(icon);
            }
        });
    }

    // Enhance menu close when clicking a link
    function enhanceMenuLinks() {
        // Fix #5: Improved function to handle link clicks properly
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            // Remove any existing click handlers
            link.onclick = null;
            
            // Add new click handler
            link.addEventListener('click', function(e) {
                // Important: Only close menu if it's not a dropdown parent
                // or if we're clicking a link in the dropdown menu
                const isDropdownLink = this.parentElement.classList.contains('has-dropdown');
                const isInDropdown = this.closest('.dropdown-menu') !== null;
                
                if ((!isDropdownLink || isInDropdown) && window.innerWidth <= 768) {
                    // Add small delay to allow the navigation to happen
                    setTimeout(closeMenu, 100);
                }
            });
        });
    }

    function handleNavResize() {
        if (window.innerWidth <= 768) {
            setupMobileDropdowns();
            enhanceMenuLinks(); // Add this to ensure links work on resize
            // Ensure correct button visibility on resize
            if (navMenu.classList.contains('active')) {
                closeBtn.style.display = 'flex';
                mobileMenuBtn.style.display = 'none';
            } else {
                closeBtn.style.display = 'none';
                mobileMenuBtn.style.display = 'flex';
            }
        } else {
            teardownMobileDropdowns();
            closeMenu();
        }
    }
    handleNavResize();
    window.addEventListener('resize', handleNavResize);

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