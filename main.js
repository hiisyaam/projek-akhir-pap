document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }
    });
});