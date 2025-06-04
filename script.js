// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100,
    mirror: true
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.icon');
    const navLinks = document.querySelector('#myNavbar');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
});
// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'flex';
        backToTopButton.style.opacity = '1';
    } else {
        backToTopButton.style.opacity = '0';
        setTimeout(() => {
            if (window.pageYOffset <= 300) {
                backToTopButton.style.display = 'none';
            }
        }, 300);
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Image Modal Functionality
function myFunction(imgs) {
    const modal = document.getElementById("imgModal");
    const expandedImg = document.getElementById("expandedImg");
    const imgText = document.getElementById("imgtext");
    
    modal.style.display = "flex";
    expandedImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;
    
    // Add animation class
    setTimeout(() => {
        expandedImg.classList.add('modal-zoom-in');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById("imgModal");
    const expandedImg = document.getElementById("expandedImg");
    
    expandedImg.classList.remove('modal-zoom-in');
    expandedImg.classList.add('modal-zoom-out');
    
    setTimeout(() => {
        modal.style.display = "none";
        expandedImg.classList.remove('modal-zoom-out');
    }, 300);
}

// Close modal when clicking outside the image
window.addEventListener('click', (event) => {
    const modal = document.getElementById("imgModal");
    if (event.target === modal) {
        closeModal();
    }
});

// Enhanced Service Cards Animation
const services = document.querySelectorAll('.service');
services.forEach(service => {
    service.addEventListener('mouseenter', () => {
        service.style.transform = 'translateY(-5px)';
        const icon = service.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
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

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced Button Hover Effects
const buttons = document.querySelectorAll('.request-btn, .message-btn, .more-btn, .availability, .pricing');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
        button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    });
});

// Parallax Effect for Background
window.addEventListener('scroll', () => {
    const bg = document.querySelector('.bg');
    const scrolled = window.pageYOffset;
    bg.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Enhanced Dropdown Menu
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const content = dropdown.querySelector('.dropdown-content');
        content.style.display = 'block';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    });
    
    dropdown.addEventListener('mouseleave', () => {
        const content = dropdown.querySelector('.dropdown-content');
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            content.style.display = 'none';
        }, 300);
    });
});

// Responsive Navigation
const mediaQuery = window.matchMedia('(max-width: 768px)');
function handleTabletChange(e) {
    if (e.matches) {
        // Mobile-specific code
        const actions = document.querySelector('.actions');
        actions.style.flexDirection = 'column';
    } else {
        // Desktop-specific code
        const actions = document.querySelector('.actions');
        actions.style.flexDirection = 'row';
    }
}
mediaQuery.addListener(handleTabletChange);
handleTabletChange(mediaQuery);

// Add scroll reveal animations
const scrollReveal = {
    distance: '50px',
    duration: 1000,
    delay: 200,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    scale: 1
};

// Initialize scroll reveal for elements
document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = `all ${scrollReveal.duration}ms ${scrollReveal.easing} ${scrollReveal.delay}ms`;
            }
        });
    });
    
    observer.observe(element);
});

// Add hover effect to profile image
const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    profileImg.addEventListener('mouseenter', () => {
        profileImg.style.transform = 'scale(1.05) rotate(5deg)';
    });
    
    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.transform = 'scale(1) rotate(0)';
    });
}

// Add typing effect to headings
const headings = document.querySelectorAll('h1, h2');
headings.forEach(heading => {
    const text = heading.textContent;
    heading.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heading.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(heading);
});
