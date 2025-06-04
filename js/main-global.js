// ----- Functions from original main.js (for index.html primarily) -----
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Check if it's a valid selector and not just "#"
            if (targetId.length > 1 && targetId.startsWith('#') && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerElement = document.querySelector('header.fixed'); // More specific selector
                    const headerOffset = headerElement ? headerElement.offsetHeight : 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open after clicking a link
                    const mobileMenu = document.getElementById('mobile-menu');
                    const menuToggle = document.getElementById('menu-toggle');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;
                        mobileMenu.classList.add('hidden');
                        if (menuIcon) {
                            menuIcon.classList.remove('fa-times');
                            menuIcon.classList.add('fa-bars');
                        }
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
                slide.classList.remove('hidden'); // Ensure it's not hidden by Tailwind
                setTimeout(() => { // Timeout to allow display property to take effect before transition
                    slide.style.opacity = 1;
                }, 20); // A small delay
            } else {
                slide.style.opacity = 0;
                setTimeout(() => { // Hide after transition
                    slide.classList.add('hidden'); // Add Tailwind hidden after transition
                }, 700); // Match transition duration in CSS
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

    slides.forEach((slide, i) => {
        if (i !== currentIndex) {
            slide.classList.add('hidden');
            slide.style.opacity = 0;
        } else {
            slide.classList.remove('hidden');
            slide.style.opacity = 1;
        }
    });
}

function initNumberCounters() {
    const counters = document.querySelectorAll('.number-counter');
    const animationDuration = 1500; // Duration in ms

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const isDecimalAttribute = counter.hasAttribute('data-decimal');
        let startTimestamp = null;
        let hasAnimated = false;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
            let currentValue = progress * target;

            if (isDecimalAttribute) {
                if (target.toString().length === 1) {
                    counter.innerText = currentValue.toFixed(0);
                } else if (target.toString().length === 2) {
                    counter.innerText = Math.floor(currentValue).toString().padStart(2, '0');
                } else {
                    counter.innerText = Math.floor(currentValue).toLocaleString();
                }
            } else {
                counter.innerText = Math.floor(currentValue).toLocaleString();
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (isDecimalAttribute) {
                    if (target.toString().length === 1) {
                        counter.innerText = target.toFixed(0);
                    } else if (target.toString().length === 2) {
                        counter.innerText = target.toString().padStart(2, '0');
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                } else {
                    counter.innerText = target.toLocaleString();
                }
            }
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    counter.innerText = '0';
                    startTimestamp = null;
                    window.requestAnimationFrame(step);
                    hasAnimated = true;
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(counter);
    });
}

function initScrollRevealAnimations() {
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // obs.unobserve(entry.target); // Uncomment to trigger only once
            } else {
                // Optional: Remove 'revealed' to re-trigger on scroll up/down if not unobserved
                // entry.target.classList.remove('revealed');
            }
        });
    }, { threshold: 0.1 });

    elementsToReveal.forEach(element => {
        observer.observe(element);
    });
}


// ----- Global Utility Functions -----
function initMobileMenuGlobal() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        const menuIcon = menuToggle.querySelector('i');
        menuToggle.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            if (menuIcon) {
                if (isHidden) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                } else {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                }
            }
        });
    }
}

function initUserDropdownGlobal() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');

    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
    }
}

window.addEventListener('click', (event) => {
    const userDropdown = document.getElementById('user-dropdown');
    const userMenuButton = document.getElementById('user-menu-button');

    if (userDropdown && !userDropdown.classList.contains('hidden')) {
        if (userMenuButton && !userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add('hidden');
        }
    }
});


// ----- Authentication Simulation & Navigation Update -----
function getPathPrefix() {
    let pathPrefix = '';
    const pathSegments = window.location.pathname.split('/');
    // Use 'projek-akhir' as the key segment to determine depth
    const projectDirIndex = pathSegments.indexOf('projek-akhir');

    if (projectDirIndex !== -1) {
        const depth = pathSegments.length - (projectDirIndex + 2);
        for (let i = 0; i < depth; i++) {
            pathPrefix += '../';
        }
    }
    return pathPrefix;
}


function checkLoginStatusAndUpdateNav() {
    const isLoggedIn = localStorage.getItem('cyberAwareUserLoggedIn') === 'true';
    const userEmail = localStorage.getItem('cyberAwareUserEmail');

    const navAuthLinksContainer = document.getElementById('nav-auth-links');
    const mobileAuthLinksContainer = document.getElementById('mobile-auth-links');
    const pathPrefix = getPathPrefix();

    if (navAuthLinksContainer && mobileAuthLinksContainer) {
        if (isLoggedIn) {
            navAuthLinksContainer.innerHTML = `
                <div class="relative">
                    <button id="user-menu-button" title="User Profile"
                        class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-nav focus:ring-violet-500 overflow-hidden">
                        <img src="${pathPrefix}assets/Male User.svg" alt="User Profile" class="w-full h-full object-cover">
                    </button>
                    <div id="user-dropdown" class="absolute top-full right-0 mt-2 w-52 bg-cyber-card rounded-md shadow-lg overflow-hidden hidden z-50 border border-gray-700/50">
                        <div class="px-4 py-3 text-center text-xs text-white font-medium truncate">
                            ${userEmail || 'Pengguna Terdaftar'}
                        </div>
                        <div class="text-xs font-medium">
                            <a href="${pathPrefix}profile/userProfile.html" class="flex items-center px-4 py-3 text-white hover:bg-gray-700/50 border-t border-gray-700/50 transition-colors">
                                <img src="${pathPrefix}assets/user.svg" alt="Account" class="w-5 h-5 mr-3 icon-filter-nav"> Detail Akun
                            </a>
                            <a href="${pathPrefix}kontak/contactPage.html" class="flex items-center px-4 py-3 text-white hover:bg-gray-700/50 border-t border-gray-700/50 transition-colors">
                                <img src="${pathPrefix}assets/help.svg" alt="Help" class="w-5 h-5 mr-3 icon-filter-nav"> Pusat Bantuan
                            </a>
                            <a href="#" id="logout-button-desktop" class="flex items-center px-4 py-3 text-white hover:bg-gray-700/50 border-t border-gray-700/50 transition-colors">
                                <img src="${pathPrefix}assets/logout.svg" alt="Logout" class="w-5 h-5 mr-3 icon-filter-nav"> Keluar
                            </a>
                        </div>
                    </div>
                 </div>`;
            mobileAuthLinksContainer.innerHTML = `
                <a href="${pathPrefix}profile/userProfile.html"
                    class="px-4 py-3 border border-gray-600 rounded-md text-center hover:bg-white/10 transition-colors flex-1 flex items-center justify-center">
                    <i class="fas fa-user mr-2"></i> Profil
                </a>
                <a href="#" id="logout-button-mobile"
                    class="px-4 py-3 bg-red-600 text-white rounded-md text-center font-semibold hover:bg-red-700 transition-colors flex-1 flex items-center justify-center">
                     <i class="fas fa-sign-out-alt mr-2"></i> Keluar
                </a>`;

            initUserDropdownGlobal();
            document.getElementById('logout-button-desktop')?.addEventListener('click', handleLogout);
            document.getElementById('logout-button-mobile')?.addEventListener('click', handleLogout);

        } else {
            navAuthLinksContainer.innerHTML = `
                <a href="${pathPrefix}login/loginPage.html" class="px-4 py-2 rounded text-white hover:text-violet-300 transition-colors">Login</a>
                <a href="${pathPrefix}signUp/signUpPage.html"
                    class="btn-primary px-4 py-2 bg-violet-600 text-white rounded-md flex items-center space-x-1 hover:bg-violet-700 transition-colors">
                    <span class="font-medium">Sign up</span>
                    <i class="fas fa-chevron-right text-xs"></i>
                </a>`;
            mobileAuthLinksContainer.innerHTML = `
                <a href="${pathPrefix}login/loginPage.html"
                    class="px-4 py-3 border border-gray-600 rounded-md text-center hover:bg-white/10 transition-colors flex-1">
                    Login
                </a>
                <a href="${pathPrefix}signUp/signUpPage.html"
                    class="px-4 py-3 bg-violet-600 text-white rounded-md text-center font-semibold hover:bg-violet-700 transition-colors flex-1">
                    Sign up
                </a>`;
        }
    }
}

function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('cyberAwareUserLoggedIn');
    localStorage.removeItem('cyberAwareUserEmail');
    const pathPrefix = getPathPrefix();
    // Ensure redirection to index.html at the project root
    let targetUrl;
    if (pathPrefix === "") {
        targetUrl = 'index.html'; // Or './'
    } else {
        targetUrl = pathPrefix; // This will point to the project root directory e.g. '../'
    }
    window.location.href = targetUrl;
}

// ----- Page Specific Initializations & Event Handlers -----
document.addEventListener('DOMContentLoaded', function () {
    // Global initializations for all pages
    initMobileMenuGlobal();
    checkLoginStatusAndUpdateNav();
    if (typeof initSmoothScroll === 'function') initSmoothScroll();
    if (typeof initScrollRevealAnimations === 'function') initScrollRevealAnimations();

    // --- Home Page (index.html) Specific Initializations ---
    if (document.getElementById('hero')) {
        if (typeof initTestimonialCarousel === 'function') initTestimonialCarousel();
        if (typeof initNumberCounters === 'function') initNumberCounters();
    }

    // --- Login Page (loginPage.html) Handler ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailInput = document.getElementById('usernameLogin');
            const passwordInput = document.getElementById('passwordLogin');

            if (emailInput && passwordInput && emailInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
                if (emailInput.value === "user@example.com" && passwordInput.value === "password123") {
                    localStorage.setItem('cyberAwareUserLoggedIn', 'true');
                    localStorage.setItem('cyberAwareUserEmail', emailInput.value);
                    const pathPrefix = getPathPrefix();
                    let targetUrl;
                    if (pathPrefix === "") {
                        targetUrl = '../../';
                    } else {
                        targetUrl = pathPrefix;
                    }
                    window.location.href = targetUrl;
                } else {
                    alert('Email atau password salah. (Hint: user@example.com / password123)');
                }
            } else {
                alert('Silakan masukkan email dan password.');
            }
        });
    }

    // --- Sign Up Page (signUpPage.html) Handler ---
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailInput = document.getElementById('emailSignUp');
            const usernameInput = document.getElementById('usernameSignUp');
            const passwordInput = document.getElementById('passwordSignUp');
            const confirmPasswordInput = document.getElementById('confirmPasswordSignUp');

            if (!emailInput.value || !usernameInput.value || !passwordInput.value || !confirmPasswordInput.value) {
                alert('Harap isi semua field.');
                return;
            }
            if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Password dan konfirmasi password tidak cocok.');
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                alert('Format email tidak valid.');
                return;
            }

            localStorage.setItem('cyberAwareUserLoggedIn', 'true');
            localStorage.setItem('cyberAwareUserEmail', usernameInput.value); // Using username as email for demo
            const pathPrefix = getPathPrefix();
            let targetUrl;
            if (pathPrefix === "") { // If already at project root
                targetUrl = 'index.html'; // Or './'
            } else { // If in a sub-directory
                targetUrl = pathPrefix; // Navigates to project root directory
            }
            window.location.href = targetUrl;
        });
    }
});