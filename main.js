document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Menu Toggle
    initMobileMenu();

    // 2. Smooth Scrolling for Anchor Links
    initSmoothScroll();

    // 3. Testimonial Carousel
    initTestimonialCarousel();

    // 4. Animate numbers on scroll (for statistics)
    initNumberCounters();

    // 5. Basic scroll animations for sections/elements
    initScrollRevealAnimations();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && mobileMenu && menuIcon) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden'); // Use Tailwind's hidden class
            // Update icon
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            } else {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            }
        });
    }
}

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerElement = document.querySelector('header');
                    const headerOffset = headerElement ? headerElement.offsetHeight : 70; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    const mobileMenu = document.getElementById('mobile-menu');
                    const menuToggle = document.getElementById('menu-toggle');
                    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;
                    if (mobileMenu && !mobileMenu.classList.contains('hidden') && menuIcon) {
                        mobileMenu.classList.add('hidden');
                        menuIcon.classList.remove('fa-times');
                        menuIcon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
}

function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonial-carousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
    const prevButton = document.getElementById('testimonial-prev');
    const nextButton = document.getElementById('testimonial-next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('hidden');
                setTimeout(() => { // Timeout to allow display property to take effect before transition
                    slide.style.opacity = 1;
                }, 20);
            } else {
                slide.style.opacity = 0;
                setTimeout(() => { // Hide after transition
                    slide.classList.add('hidden');
                }, 700); // Match transition duration
            }
        });
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentIndex);
    }

    if (nextButton) nextButton.addEventListener('click', goToNext);
    if (prevButton) prevButton.addEventListener('click', goToPrev);
    
    // Initialize: show the first slide, ensure others are correctly hidden and ready for transition.
    slides.forEach((slide, i) => {
        if (i !== currentIndex) {
           slide.classList.add('hidden');
           slide.style.opacity = 0; 
        } else {
           slide.classList.remove('hidden');
           slide.style.opacity = 1;
        }
    });
    // showSlide(currentIndex); // Call to ensure correct initial state if logic above is changed
}


function initNumberCounters() {
    const counters = document.querySelectorAll('.number-counter');
    const animationDuration = 1500; // Duration in ms for the counter animation

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const isDecimal = counter.hasAttribute('data-decimal'); // Check for decimal part
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
            let currentValue = progress * target;

            if (isDecimal) {
                 // For decimals, we might want to format them differently or animate whole number part
                 // Assuming data-target for decimals is just the decimal part like "5" for 0.5 or "01" for 0.01
                 // This simple version might need adjustment for complex decimal animations.
                 // For now, if data-target is small (e.g. for percentages), it will animate quickly.
                 // Let's keep it simple: animate the number as is.
                counter.innerText = currentValue.toFixed(0); // Keep as integer for simplicity unless specific formatting
                if (target < 10 && target.toString().includes('.')) { // Simple check for small decimals
                    counter.innerText = currentValue.toFixed(1);
                } else {
                     counter.innerText = Math.floor(currentValue).toLocaleString();
                }

            } else {
                 counter.innerText = Math.floor(currentValue).toLocaleString();
            }


            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final target value is set accurately, especially with toLocaleString()
                counter.innerText = target.toLocaleString();
                 if (isDecimal && target < 10 && target.toString().includes('.')) {
                     counter.innerText = target.toFixed(target.toString().split('.')[1].length || 0);
                 } else if (isDecimal) { // if it's like "2" for "22.2"
                    counter.innerText = target;
                 }
            }
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counter.innerText = isDecimal ? '0' : '0'; // Initial text before animation
                    startTimestamp = null; // Reset timestamp for animation
                    window.requestAnimationFrame(step);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(counter);
    });
}

function initScrollRevealAnimations() {
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // observer.unobserve(entry.target); // Optional: remove if you want animations to re-trigger
            } else {
                // Optional: remove 'revealed' class if element is not intersecting to re-trigger animation on scroll up/down
                // entry.target.classList.remove('revealed');
            }
        });
    }, { threshold: 0.1 }); // Adjust threshold (0.0 to 1.0) for when animation triggers

    elementsToReveal.forEach(element => {
        observer.observe(element);
    });
}