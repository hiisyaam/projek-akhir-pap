// ----- Functions from original main.js (for index.html primarily) -----
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // Initialize: show the first slide, ensure others are correctly hidden and ready for transition.
    slides.forEach((slide, i) => {
        if (i !== currentIndex) {
           slide.classList.add('hidden'); // Start hidden
           slide.style.opacity = 0; 
        } else {
           slide.classList.remove('hidden'); // Start visible
           slide.style.opacity = 1;
        }
    });
    // showSlide(currentIndex); // Call to ensure correct initial state if logic above is changed
}

function initNumberCounters() {
    const counters = document.querySelectorAll('.number-counter');
    const animationDuration = 1500; // Duration in ms

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const isDecimalAttribute = counter.hasAttribute('data-decimal'); // if true, target is the decimal part
        let startTimestamp = null;
        let hasAnimated = false; // Flag to ensure animation runs only once per element

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
            let currentValue = progress * target;

            if (isDecimalAttribute) {
                // If it's for a decimal part like "2" in "22.2" or "01" in "13.01"
                // This assumes the integer part is handled by a separate counter or static text.
                // For simplicity, we'll format it as is, assuming target is small for decimals.
                if (target.toString().length === 1) { // e.g. data-target="2" for 0.2 or .2
                    counter.innerText = currentValue.toFixed(0); // Display as single digit
                } else if (target.toString().length === 2) { // e.g. data-target="01" for .01
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
                // Ensure final target value is set accurately
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
                    counter.innerText = '0'; // Initial text
                    startTimestamp = null; // Reset timestamp for animation
                    window.requestAnimationFrame(step);
                    hasAnimated = true; // Set flag
                    obs.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% visible

        observer.observe(counter);
    });
}

function initScrollRevealAnimations() {
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // obs.unobserve(entry.target); // Uncomment if you want animations to trigger only once
            } else {
                // Optional: Remove 'revealed' to re-trigger on scroll up/down
                // entry.target.classList.remove('revealed');
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% visible

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
            event.stopPropagation(); // Prevent window click from immediately closing
            userDropdown.classList.toggle('hidden');
        });
    }
}

// Global click listener to close dropdowns when clicking outside
window.addEventListener('click', (event) => {
    const userDropdown = document.getElementById('user-dropdown');
    const userMenuButton = document.getElementById('user-menu-button'); // Assuming this ID is on the button triggering the dropdown

    if (userDropdown && !userDropdown.classList.contains('hidden')) {
        if (userMenuButton && !userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add('hidden');
        }
    }
    // Add similar logic for other dropdowns if any
});


// ----- Authentication Simulation & Navigation Update -----
function getPathPrefix() {
    let pathPrefix = '';
    const pathSegments = window.location.pathname.split('/');
    const projectDirIndex = pathSegments.indexOf('projek-akhir-pap');

    if (projectDirIndex !== -1) {
        // Calculate depth relative to 'projek-akhir-pap'
        // If current page is index.html, depth is 0.
        // If current page is login/loginPage.html, depth is 1.
        const depth = pathSegments.length - (projectDirIndex + 2); // +2 because projectDirIndex is the index of 'projek-akhir-pap', and we want depth *inside* it
        for (let i = 0; i < depth; i++) {
            pathPrefix += '../';
        }
    } else {
        // Fallback or error handling if 'projek-akhir-pap' is not in path
        // This might happen if served from root or different structure
        // For this project, assume 'projek-akhir-pap' is always part of the deployment path
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
            
            initUserDropdownGlobal(); // Initialize dropdown for logged-in users
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
    window.location.href = `${pathPrefix}index.html`; 
}

// ----- Page Specific Initializations & Event Handlers -----
document.addEventListener('DOMContentLoaded', function() {
    // Global initializations for all pages
    initMobileMenuGlobal();
    checkLoginStatusAndUpdateNav(); // This will also init user dropdown if logged in

    // --- Home Page (index.html) Specific Initializations ---
    // Check for a unique element on index.html to confirm it's the home page
    if (document.getElementById('hero')) { 
        if (typeof initSmoothScroll === 'function') initSmoothScroll();
        if (typeof initTestimonialCarousel === 'function') initTestimonialCarousel();
        if (typeof initNumberCounters === 'function') initNumberCounters();
        if (typeof initScrollRevealAnimations === 'function') initScrollRevealAnimations();
    }

    // --- Login Page (loginPage.html) Handler ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = document.getElementById('usernameLogin'); // Changed ID
            const passwordInput = document.getElementById('passwordLogin'); // Changed ID
            
            if (emailInput && passwordInput && emailInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
                // Simple validation (replace with actual backend validation)
                // For demo, using "user@example.com" and "password123"
                if (emailInput.value === "user@example.com" && passwordInput.value === "password123") {
                    localStorage.setItem('cyberAwareUserLoggedIn', 'true');
                    localStorage.setItem('cyberAwareUserEmail', emailInput.value);
                    const pathPrefix = getPathPrefix();
                    window.location.href = `${pathPrefix}index.html`; 
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
        signUpForm.addEventListener('submit', function(event) {
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
            // Basic email validation
            if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                alert('Format email tidak valid.');
                return;
            }

            // Simulasi pendaftaran berhasil
            localStorage.setItem('cyberAwareUserLoggedIn', 'true');
            // Storing username as email for simplicity in this demo, adjust as needed
            localStorage.setItem('cyberAwareUserEmail', usernameInput.value); 
            const pathPrefix = getPathPrefix();
            window.location.href = `${pathPrefix}index.html`;
        });
    }
    
    // --- Contact Page (kontak/contactPage.html) Handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            if (!name || !email || !subject || !message) {
                 alert('Harap isi semua field pada form kontak.');
                 return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('Format email tidak valid.');
                return;
            }
            // Simulasi pengiriman
            alert(`Pesan Anda telah diterima (simulasi).\nNama: ${name}\nEmail: ${email}\nSubjek: ${subject}\nPesan: ${message}\nTerima kasih!`);
            contactForm.reset();
        });
    }

    // --- Detector Page (detector/detectorPage.html) Handler ---
    const analysisForm = document.getElementById('analysis-form');
    const urlInput = document.getElementById('url-input'); // For URL tab
    const fileInput = document.getElementById('file-input'); // For File tab (to be added in HTML)
    const searchInput = document.getElementById('search-input'); // For Search tab (to be added in HTML)
    
    const tabFile = document.getElementById('tab-file');
    const tabUrl = document.getElementById('tab-url');
    const tabSearch = document.getElementById('tab-search');
    const analysisInputContainer = document.getElementById('analysis-input-container'); // Container for inputs


    function updateActiveTab(activeTab) {
        const tabs = [tabFile, tabUrl, tabSearch];
        const pathPrefix = getPathPrefix();

        tabs.forEach(tab => {
            if (tab) {
                tab.classList.remove('text-violet-300', 'border-violet-300', 'font-semibold');
                tab.classList.add('text-white', 'border-transparent');
            }
        });
        if (activeTab) {
            activeTab.classList.add('text-violet-300', 'border-violet-300', 'font-semibold');
            activeTab.classList.remove('text-white', 'border-transparent');
        }

        // Update input field based on active tab
        if (analysisInputContainer) {
            if (activeTab === tabUrl) {
                analysisInputContainer.innerHTML = `
                    <input type="text" id="url-input" placeholder="Masukkan URL yang mencurigakan di sini"
                           class="w-full h-14 px-6 py-4 bg-cyber-card rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-gray-700" />`;
            } else if (activeTab === tabFile) {
                analysisInputContainer.innerHTML = `
                    <label for="file-input" class="w-full h-14 px-6 py-4 bg-cyber-card rounded-lg text-gray-400 text-lg border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-700/30">
                        <span id="file-name-display">Pilih atau jatuhkan file di sini</span>
                        <i class="fas fa-upload ml-3 text-violet-400"></i>
                    </label>
                    <input type="file" id="file-input" class="hidden" />`;
                document.getElementById('file-input')?.addEventListener('change', function(e){
                    const fileNameDisplay = document.getElementById('file-name-display');
                    if(e.target.files.length > 0 && fileNameDisplay){
                        fileNameDisplay.textContent = e.target.files[0].name;
                        fileNameDisplay.classList.remove('text-gray-400');
                        fileNameDisplay.classList.add('text-white');
                    }
                });

            } else if (activeTab === tabSearch) {
                 analysisInputContainer.innerHTML = `
                    <input type="text" id="search-input" placeholder="Cari domain, IP, hash file, atau URL"
                           class="w-full h-14 px-6 py-4 bg-cyber-card rounded-lg text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-gray-700" />`;
            }
        }
    }
    
    if (tabFile && tabUrl && tabSearch && analysisInputContainer) {
        // Default to URL tab active
        updateActiveTab(tabUrl);

        tabUrl.addEventListener('click', () => updateActiveTab(tabUrl));
        tabFile.addEventListener('click', () => updateActiveTab(tabFile));
        tabSearch.addEventListener('click', () => updateActiveTab(tabSearch));
    }


    if (analysisForm) {
        analysisForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const currentUrlInput = document.getElementById('url-input'); // Re-fetch in case DOM changed
            const currentFileInput = document.getElementById('file-input');
            const currentSearchInput = document.getElementById('search-input');
            let submissionValue = "";
            let submissionType = "";

            if (currentUrlInput && currentUrlInput.offsetParent !== null) { // Check if URL input is visible/active
                submissionValue = currentUrlInput.value.trim();
                submissionType = "URL";
            } else if (currentFileInput && currentFileInput.offsetParent !== null && currentFileInput.files.length > 0) {
                submissionValue = currentFileInput.files[0].name;
                submissionType = "File";
            } else if (currentSearchInput && currentSearchInput.offsetParent !== null) {
                submissionValue = currentSearchInput.value.trim();
                submissionType = "Search";
            }


            if (submissionValue !== "") {
                alert(`${submissionType} "${submissionValue}" akan dianalisis (simulasi). Mengarahkan ke halaman hasil analisis default.`);
                const pathPrefix = getPathPrefix();
                window.location.href = `${pathPrefix}analisis/analisisPage.html`; // Static page for now
            } else {
                alert('Masukkan input yang valid untuk dianalisis.');
            }
        });
    }
});