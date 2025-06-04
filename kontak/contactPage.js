const userMenuButton = document.getElementById("user-menu-button");
const userDropdown = document.getElementById("user-dropdown");

if (userMenuButton && userDropdown) {
    userMenuButton.addEventListener("click", (event) => {
        event.stopPropagation();
        userDropdown.classList.toggle("hidden");
    });

    window.addEventListener("click", (event) => {
        if (
            userDropdown &&
            !userDropdown.classList.contains("hidden") &&
            userMenuButton &&
            !userMenuButton.contains(event.target) &&
            !userDropdown.contains(event.target)
        ) {
            userDropdown.classList.add("hidden");
        }
    });
}

const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });
}

function adjustBodyPadding() {
    const header = document.querySelector("header.fixed");
    if (header) {
        document.body.style.paddingTop = header.offsetHeight + "px";
    }
}
window.addEventListener("resize", adjustBodyPadding);
window.addEventListener("DOMContentLoaded", adjustBodyPadding);

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const subject = document.getElementById("contact-subject").value;
        const message = document.getElementById("contact-message").value;

        if (name && email && subject && message) {
            console.log({
                name: name,
                email: email,
                subject: subject,
                message: message,
            });
            alert("Pesan Anda telah terkirim! (Simulasi)");
            contactForm.reset();
        } else {
            alert("Harap isi semua kolom yang wajib diisi.");
        }
    });
}