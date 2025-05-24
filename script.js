// Initialize AOS with proper error handling
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            mirror: false // Changed from true to prevent constant re-animations
        });
    }
});

// Mobile Menu Toggle with better error handling
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn, .icon');
    const navLinks = document.querySelector('.nav-links, .navbar');
    
    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = navLinks.classList.toggle('active') || navLinks.classList.toggle('responsive');
        
        // Update button icon and aria attributes
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        }
        mobileMenuBtn.setAttribute('aria-expanded', isActive.toString());
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active', 'responsive');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when clicking a link
    const navLinksElements = document.querySelectorAll('.nav-links a, .navbar a');
    navLinksElements.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active', 'responsive');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Loading Screen with better performance
function initLoadingScreen() {
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    });
}

// Back to Top Button with throttling
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    let isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollPosition > 300) {
                    backToTopButton.style.display = 'flex';
                    backToTopButton.style.opacity = '1';
                } else {
                    backToTopButton.style.opacity = '0';
                    setTimeout(() => {
                        if ((window.pageYOffset || document.documentElement.scrollTop) <= 300) {
                            backToTopButton.style.display = 'none';
                        }
                    }, 300);
                }
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Image Modal Functionality
function openModal(imgs) {
    const modal = document.getElementById("imgModal");
    const expandedImg = document.getElementById("expandedImg");
    const imgText = document.getElementById("imgtext");
    
    if (!modal || !expandedImg || !imgText || !imgs) return;
    
    modal.style.display = "flex";
    modal.setAttribute('aria-hidden', 'false');
    expandedImg.src = imgs.src;
    expandedImg.alt = imgs.alt || '';
    imgText.textContent = imgs.alt || '';
    
    // Add animation with proper cleanup
    requestAnimationFrame(() => {
        expandedImg.classList.add('modal-zoom-in');
    });
    
    // Focus management for accessibility
    modal.focus();
}

function closeModal() {
    const modal = document.getElementById("imgModal");
    const expandedImg = document.getElementById("expandedImg");
    
    if (!modal || !expandedImg) return;
    
    expandedImg.classList.remove('modal-zoom-in');
    expandedImg.classList.add('modal-zoom-out');
    modal.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
        modal.style.display = "none";
        expandedImg.classList.remove('modal-zoom-out');
    }, 300);
}

// Initialize Modal Events
function initModal() {
    // Close modal when clicking outside the image
    const modal = document.getElementById("imgModal");
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }
}

// Enhanced Service Cards Animation with performance optimization
function initServiceAnimations() {
    const services = document.querySelectorAll('.service');
    
    services.forEach(service => {
        service.addEventListener('mouseenter', () => {
            service.style.transform = 'translateY(-5px)';
            service.style.transition = 'transform 0.3s ease';
            
            const icon = service.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        service.addEventListener('mouseleave', () => {
            service.style.transform = 'translateY(0)';
            
            const icon = service.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced Button Hover Effects with better performance
function initButtonEffects() {
    const buttons = document.querySelectorAll('.request-btn, .message-btn, .more-btn, .availability, .pricing-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            button.style.transition = 'all 0.3s ease';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
    });
}

// Optimized Parallax Effect
function initParallax() {
    const bg = document.querySelector('.bg');
    if (!bg) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        bg.style.transform = `translateY(${scrolled * 0.5}px)`;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Enhanced Dropdown Menu
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const content = dropdown.querySelector('.dropdown-content');
        if (!content) return;
        
        dropdown.addEventListener('mouseenter', () => {
            content.style.display = 'block';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            content.style.transition = 'all 0.3s ease';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (content.style.opacity === '0') {
                    content.style.display = 'none';
                }
            }, 300);
        });
    });
}

// Responsive Navigation with better implementation
function initResponsiveNav() {
    const actions = document.querySelector('.actions');
    if (!actions) return;
    
    function handleResize() {
        if (window.innerWidth <= 768) {
            actions.style.flexDirection = 'column';
            actions.style.gap = '10px';
        } else {
            actions.style.flexDirection = 'row';
            actions.style.gap = '15px';
        }
    }
    
    // Use ResizeObserver if available, otherwise fallback to resize event
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(document.body);
    } else {
        window.addEventListener('resize', handleResize);
    }
    
    handleResize(); // Initial call
}

// Profile Image Hover Effect
function initProfileImageEffect() {
    const profileImg = document.querySelector('.profile-img');
    if (!profileImg) return;
    
    profileImg.addEventListener('mouseenter', () => {
        profileImg.style.transform = 'scale(1.05) rotate(2deg)'; // Reduced rotation for better UX
        profileImg.style.transition = 'transform 0.3s ease';
    });
    
    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.transform = 'scale(1) rotate(0)';
    });
}

// Intersection Observer for better performance
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.8s ease 0.2s';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Only observe elements that don't already have AOS
    document.querySelectorAll('[data-aos]').forEach(element => {
        if (!element.hasAttribute('data-aos')) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            observer.observe(element);
        }
    });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLoadingScreen();
    initBackToTop();
    initModal();
    initServiceAnimations();
    initSmoothScroll();
    initButtonEffects();
    initParallax();
    initDropdowns();
    initResponsiveNav();
    initProfileImageEffect();
    initScrollAnimations();
});

// Global functions for HTML onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleMenu = function() {
    // Fallback for the HTML onclick handler
    const event = new Event('click');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn, .icon');
    if (mobileMenuBtn) {
        mobileMenuBtn.dispatchEvent(event);
    }
};