const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = menuToggle.querySelector("i");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  if (mobileMenu.classList.contains("hidden")) {
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
  } else {
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
  }
});

const userMenuButton = document.getElementById("user-menu-button");
const userDropdown = document.getElementById("user-dropdown");

if (userMenuButton && userDropdown) {
  userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("hidden");
  });

  window.addEventListener("click", (event) => {
    if (
      !userDropdown.classList.contains("hidden") &&
      !userMenuButton.contains(event.target) &&
      !userDropdown.contains(event.target)
    ) {
      userDropdown.classList.add("hidden");
    }
  });
}

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = {
  detection: document.getElementById("detection-content"),
  details: document.getElementById("details-content"),
  tips: document.getElementById("tips-content"),
};

function switchTab(activeTab) {
  tabButtons.forEach((btn) => {
    btn.classList.remove("border-violet-400", "text-white");
    btn.classList.add("border-transparent", "text-gray-400");
  });

  Object.values(tabContents).forEach((content) => {
    if (content) {
      content.classList.add("hidden");
    }
  });

  const activeButton = document.querySelector(`[data-tab="${activeTab}"]`);
  if (activeButton) {
    activeButton.classList.remove("border-transparent", "text-gray-400");
    activeButton.classList.add("border-violet-400", "text-white");
  }

  if (tabContents[activeTab]) {
    tabContents[activeTab].classList.remove("hidden");
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.getAttribute("data-tab");
    switchTab(tabName);
  });
});

const reanalyzeBtn = document.getElementById("reanalyze-btn");
if (reanalyzeBtn) {
  reanalyzeBtn.addEventListener("click", () => {
    const originalText = reanalyzeBtn.innerHTML;
    reanalyzeBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> <span>Menganalisis...</span>';
    reanalyzeBtn.disabled = true;

    setTimeout(() => {
      reanalyzeBtn.innerHTML = originalText;
      reanalyzeBtn.disabled = false;

      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      successMsg.textContent = "Analisis berhasil diperbarui!";
      document.body.appendChild(successMsg);

      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    }, 2000);
  });
}

const securityItems = document.querySelectorAll(".security-item");
securityItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateX(5px)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateX(0)";
  });
});

window.addEventListener("load", () => {
  const progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = width;
    }, 500);
  });
});

securityItems.forEach((item) => {
  const tooltip = document.createElement("div");
  tooltip.className =
    "absolute bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50 opacity-0 pointer-events-none transition-opacity duration-200";
  tooltip.style.top = "-40px";
  tooltip.style.left = "50%";
  tooltip.style.transform = "translateX(-50%)";

  const securityType = item.querySelector(".text-white").textContent.trim();
  const tooltipTexts = {
    "Scam Website":
      "Deteksi website penipuan berdasarkan pola dan database ancaman",
    Malware: "Pemindaian konten berbahaya yang dapat merusak perangkat",
    Phishing: "Identifikasi upaya pencurian data pribadi atau kredensial",
    Spam: "Deteksi konten spam atau tidak diinginkan",
    "SSL Certificate":
      "Verifikasi sertifikat keamanan untuk koneksi terenkripsi",
    "Suspicious Activity": "Analisis perilaku website yang mencurigakan",
  };

  tooltip.textContent = tooltipTexts[securityType] || "Informasi keamanan";

  item.style.position = "relative";
  item.appendChild(tooltip);

  item.addEventListener("mouseenter", () => {
    tooltip.classList.remove("opacity-0");
    tooltip.classList.add("opacity-100");
  });

  item.addEventListener("mouseleave", () => {
    tooltip.classList.remove("opacity-100");
    tooltip.classList.add("opacity-0");
  });
});

switchTab("detection");

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".tip-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(card);
});
