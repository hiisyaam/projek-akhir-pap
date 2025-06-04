
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const subject = document.getElementById("contact-subject").value;
        const message = document.getElementById("contact-message").value;

        if (name && email && subject && message) {
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('Format email tidak valid.');
                return;
            }
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