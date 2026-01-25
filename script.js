// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 26, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 26, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    lastScrollY = window.scrollY;
});

// ===== Animated Counter =====
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger counter animation when stats are visible
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .mentor-card, .testimonial-card, .service-item, .info-card, .hero-stats').forEach(el => {
    observer.observe(el);
});

// ===== Countdown Timer =====
const updateCountdown = () => {
    // Set next session to next Saturday at 10:00 AM
    const now = new Date();
    const nextSaturday = new Date();
    
    // Calculate days until next Saturday (6 = Saturday)
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    nextSaturday.setHours(10, 0, 0, 0);
    
    // If it's Saturday and past 10 AM, set to next Saturday
    if (now.getDay() === 6 && now.getHours() >= 10) {
        nextSaturday.setDate(nextSaturday.getDate() + 7);
    }
    
    const diff = nextSaturday - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
};

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
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

// ===== Form Submission =====
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    
    try {
        const formData = new FormData(this);
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const result = await response.json();
        
        if (result.success) {
            // Success
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.reset();
            
            // Show success message
            showFormMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.');
        } else {
            throw new Error(result.message || 'Form submission failed');
        }
    } catch (error) {
        // Error
        btn.innerHTML = '<span>Failed to Send ✗</span>';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        // Specific message for timeout
        const errorMsg = error.name === 'AbortError' 
            ? 'Request timed out. Please check your connection and try again.'
            : 'Oops! Something went wrong. Please try again or email us directly at hello@skillcompass.io';
        
        showFormMessage('error', errorMsg);
    }
    
    // Reset button after 4 seconds
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
    }, 4000);
});

// Helper function to show form messages
function showFormMessage(type, message) {
    // Remove any existing message
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    
    // Create message element
    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message form-message-${type}`;
    msgDiv.innerHTML = `
        <span class="form-message-icon">${type === 'success' ? '✓' : '✗'}</span>
        <span class="form-message-text">${message}</span>
    `;
    
    // Insert after the form
    contactForm.parentNode.insertBefore(msgDiv, contactForm.nextSibling);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        msgDiv.classList.add('form-message-fade');
        setTimeout(() => msgDiv.remove(), 500);
    }, 8000);
}

// ===== Parallax Effect for Floating Cards =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
    
    cards.forEach((card, index) => {
        const factor = (index + 1) * 0.5;
        card.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
    });
});

// ===== Add CSS for animate-in class =====
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .mentor-card,
    .testimonial-card,
    .service-item,
    .info-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate-in,
    .mentor-card.animate-in,
    .testimonial-card.animate-in,
    .service-item.animate-in,
    .info-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card:nth-child(1) { transition-delay: 0s; }
    .feature-card:nth-child(2) { transition-delay: 0.1s; }
    .feature-card:nth-child(3) { transition-delay: 0.2s; }
    .feature-card:nth-child(4) { transition-delay: 0.3s; }
    
    .mentor-card:nth-child(1) { transition-delay: 0s; }
    .mentor-card:nth-child(2) { transition-delay: 0.1s; }
    .mentor-card:nth-child(3) { transition-delay: 0.2s; }
    .mentor-card:nth-child(4) { transition-delay: 0.3s; }
    
    .testimonial-card:nth-child(1) { transition-delay: 0s; }
    .testimonial-card:nth-child(2) { transition-delay: 0.15s; }
    .testimonial-card:nth-child(3) { transition-delay: 0.3s; }
    
    .info-card:nth-child(1) { transition-delay: 0s; }
    .info-card:nth-child(2) { transition-delay: 0.1s; }
    .info-card:nth-child(3) { transition-delay: 0.2s; }
    .info-card:nth-child(4) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);

// ===== Mentor Carousel =====
const mentorCarousel = document.querySelector('.mentor-carousel-track');
const mentorSlides = document.querySelectorAll('.mentor-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentSlide = 0;

// Create dots
if (mentorSlides.length > 0 && dotsContainer) {
    mentorSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

const updateCarousel = () => {
    if (mentorCarousel) {
        mentorCarousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
};

const goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
};

const nextSlide = () => {
    currentSlide = (currentSlide + 1) % mentorSlides.length;
    updateCarousel();
};

const prevSlide = () => {
    currentSlide = (currentSlide - 1 + mentorSlides.length) % mentorSlides.length;
    updateCarousel();
};

prevBtn?.addEventListener('click', prevSlide);
nextBtn?.addEventListener('click', nextSlide);

// Auto-advance carousel every 5 seconds
let carouselInterval = setInterval(nextSlide, 5000);

// Pause auto-advance on hover
document.querySelector('.mentor-carousel-wrapper')?.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

document.querySelector('.mentor-carousel-wrapper')?.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 5000);
});

// ===== Easter Egg: Konami Code =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===== Initialize =====
console.log('🧭 SkillCompass - Navigate Your Tech Career');
console.log('💡 Tip: Try the Konami code for a surprise!');
