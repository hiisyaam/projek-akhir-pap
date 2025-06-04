// Mobile Menu Toggle - Dipertahankan untuk halaman ini karena struktur header berbeda
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", function () {
    const isHidden = mobileMenu.classList.toggle("hidden");
    const icon = menuToggle.querySelector('i');
    if (icon) {
        if (isHidden) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
  });
}

// User Dropdown Toggle - Dipertahankan untuk halaman ini
const userMenuButton = document.getElementById("user-menu-button");
const userDropdown = document.getElementById("user-dropdown");
if (userMenuButton && userDropdown) {
  userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("hidden");
  });
  // Penutupan dropdown saat klik di luar - ini bisa bentrok jika main-global.js juga punya,
  // namun karena userMenuButton di sini unik, event.stopPropagation() seharusnya mencegah masalah.
  window.addEventListener("click", (event) => {
    if (
      userDropdown && !userDropdown.classList.contains("hidden") &&
      userMenuButton && !userMenuButton.contains(event.target) &&
      !userDropdown.contains(event.target)
    ) {
      userDropdown.classList.add("hidden");
    }
  });
}

// Logout Button Handler - Dipertahankan untuk halaman ini
document.querySelectorAll(".logout-button").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    // Di sini Anda bisa meniru logika dari main-global.js jika diperlukan
    // atau biarkan seperti ini jika simulasi alert sudah cukup untuk halaman ini.
    localStorage.removeItem('cyberAwareUserLoggedIn');
    localStorage.removeItem('cyberAwareUserEmail');
    // Redirect ke halaman utama (menggunakan path relatif dari dokumentasiPage.html)
    // Perlu fungsi getPathPrefix jika ingin lebih dinamis, atau hardcode path relatif
    // Untuk sekarang, asumsikan redirect ke index.html di root proyek.
    alert("Anda telah logout (simulasi dari dokumentasiPage.js).");
    window.location.href = "../index.html";
  });
});


function adjustLayoutForHeader() {
  const header = document.querySelector("header.fixed"); // Lebih spesifik
  const sidebar = document.getElementById("documentation-sidebar");
  if (header) {
    const headerHeight = header.offsetHeight;
    // document.body.style.paddingTop = headerHeight + "px"; // Dihapus, ditangani oleh CSS .has-fixed-header
    document.documentElement.style.setProperty(
      "--header-height",
      headerHeight + "px"
    );

    if (sidebar && window.innerWidth >= 768) { // md breakpoint Tailwind
      sidebar.style.top = `calc(var(--header-height) + 2.5rem)`; // 2.5rem = pt-10 pada main
      sidebar.style.maxHeight = `calc(100vh - var(--header-height) - 2.5rem - 4rem)`; // 2.5rem top, 4rem approx bottom padding/margin
    } else if (sidebar) {
      sidebar.style.top = ""; // Reset untuk mobile
      sidebar.style.maxHeight = ""; // Reset untuk mobile
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar-nav-link");
  const documentationSections = document.querySelectorAll(
    ".documentation-section"
  );
  const mainContentArea = document.getElementById("main-content-area");
  const defaultSectionId = "introduction";

  function setActiveLink(targetId) {
    sidebarLinks.forEach((link) => {
      link.classList.remove("sidebar-link-active");
      const dot = link.querySelector("span:first-child"); // Asumsi dot adalah span pertama
      if (dot && dot.tagName === 'SPAN') { // Pastikan itu adalah elemen span yang kita targetkan
        dot.classList.remove("bg-custom-violet");
        dot.classList.add("bg-neutral-500");
      }

      // Cek untuk sub-link dan parent link-nya
      let currentLinkIsActive = false;
      if (link.dataset.content === targetId) {
        currentLinkIsActive = true;
      } else {
        // Cek apakah ada sub-link yang aktif di dalam div setelah link ini
        const nextDiv = link.nextElementSibling;
        if (nextDiv && nextDiv.matches('div.pl-10')) {
          const activeSubLink = nextDiv.querySelector(`.sidebar-nav-link[data-content="${targetId}"]`);
          if (activeSubLink) currentLinkIsActive = true; // Jika sub-link aktif, parent juga "aktif"
        }
      }

      if (currentLinkIsActive) {
        link.classList.add("sidebar-link-active");
        if (dot && dot.tagName === 'SPAN') {
          dot.classList.remove("bg-neutral-500");
          dot.classList.add("bg-custom-violet");
        }
      }
    });
  }

  function showContent(targetId) {
    let contentFound = false;
    documentationSections.forEach((section) => {
      if (section.id === `${targetId}-content`) {
        section.classList.remove("hidden");
        contentFound = true;
      } else {
        section.classList.add("hidden");
      }
    });

    if (!contentFound) {
      const notFoundSection = document.getElementById("not-found-content");
      if (notFoundSection) notFoundSection.classList.remove("hidden");
    } else {
      const notFoundSection = document.getElementById("not-found-content");
      if (notFoundSection) notFoundSection.classList.add("hidden");
    }

    setActiveLink(targetId);
    // Scroll to top of content area, not entire page.
    if (mainContentArea && contentFound) {
        // Biarkan default browser handling untuk hash change atau implementasi scroll yang lebih halus jika diperlukan.
        // Untuk klik link, scroll ke section terkait.
        const targetSection = document.getElementById(`${targetId}-content`);
        if (targetSection) {
            // Scroll ke bagian atas section atau sedikit offset dari header
            const headerOffset = document.querySelector("header.fixed")?.offsetHeight || 0;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // 20px buffer

            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    } else if (mainContentArea && !contentFound) {
        // Jika not found, scroll ke atas main content area
        const headerOffset = document.querySelector("header.fixed")?.offsetHeight || 0;
        window.scrollTo({ top: mainContentArea.offsetTop - headerOffset -20, behavior: "smooth"});
    }
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.dataset.content;
      if (targetId) {
        if (history.pushState) {
          // Hanya ubah hash jika targetId valid dan kontennya ada atau akan ditampilkan
          // showContent akan menangani tampilan dan setActiveLink
          if (document.getElementById(`${targetId}-content`)) {
            history.pushState(null, null, `#${targetId}`);
          }
        } else {
          window.location.hash = targetId;
        }
        showContent(targetId); // Panggil showContent setelah hash mungkin diubah
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      showContent(hash);
    } else {
      // Jika hash kosong setelah navigasi (misal user hapus manual), kembali ke default
      showContent(defaultSectionId);
    }
  });

  // Initial load
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(`${initialHash}-content`)) {
    showContent(initialHash);
  } else {
    showContent(defaultSectionId);
    // Jika initialHash tidak valid, set hash ke default agar URL konsisten
    if (history.replaceState) {
        history.replaceState(null, null, `#${defaultSectionId}`);
    } else {
        window.location.hash = defaultSectionId;
    }
  }
  
  adjustLayoutForHeader(); // Panggil saat DOM siap
});

window.addEventListener("load", () => {
  adjustLayoutForHeader(); // Panggil juga saat semua resource (misal gambar di header) sudah load
});
window.addEventListener("resize", () => {
  adjustLayoutForHeader();
});