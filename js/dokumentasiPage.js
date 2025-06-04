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

const userMenuButton = document.getElementById("user-menu-button");
const userDropdown = document.getElementById("user-dropdown");
if (userMenuButton && userDropdown) {
  userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("hidden");
  });
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

document.querySelectorAll(".logout-button").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem('cyberAwareUserLoggedIn');
    localStorage.removeItem('cyberAwareUserEmail');
    alert("Anda telah logout (simulasi dari dokumentasiPage.js).");
    window.location.href = "../index.html";
  });
});


function adjustLayoutForHeader() {
  const header = document.querySelector("header.fixed");
  const sidebar = document.getElementById("documentation-sidebar");
  if (header) {
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty(
      "--header-height",
      headerHeight + "px"
    );

    if (sidebar && window.innerWidth >= 768) {
      sidebar.style.top = `calc(var(--header-height) + 2.5rem)`;
      sidebar.style.maxHeight = `calc(100vh - var(--header-height) - 2.5rem - 4rem)`;
    } else if (sidebar) {
      sidebar.style.top = "";
      sidebar.style.maxHeight = "";
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
      const dot = link.querySelector("span:first-child");
      if (dot && dot.tagName === 'SPAN') {
        dot.classList.remove("bg-custom-violet");
        dot.classList.add("bg-neutral-500");
      }


      let currentLinkIsActive = false;
      if (link.dataset.content === targetId) {
        currentLinkIsActive = true;
      } else {
        const nextDiv = link.nextElementSibling;
        if (nextDiv && nextDiv.matches('div.pl-10')) {
          const activeSubLink = nextDiv.querySelector(`.sidebar-nav-link[data-content="${targetId}"]`);
          if (activeSubLink) currentLinkIsActive = true;
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
    if (mainContentArea && contentFound) {
        const targetSection = document.getElementById(`${targetId}-content`);
        if (targetSection) {
            const headerOffset = document.querySelector("header.fixed")?.offsetHeight || 0;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    } else if (mainContentArea && !contentFound) {
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
          if (document.getElementById(`${targetId}-content`)) {
            history.pushState(null, null, `#${targetId}`);
          }
        } else {
          window.location.hash = targetId;
        }
        showContent(targetId);
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      showContent(hash);
    } else {
      showContent(defaultSectionId);
    }
  });

  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(`${initialHash}-content`)) {
    showContent(initialHash);
  } else {
    showContent(defaultSectionId);
    if (history.replaceState) {
        history.replaceState(null, null, `#${defaultSectionId}`);
    } else {
        window.location.hash = defaultSectionId;
    }
  }
  
  adjustLayoutForHeader();
});

window.addEventListener("load", () => {
  adjustLayoutForHeader();
});
window.addEventListener("resize", () => {
  adjustLayoutForHeader();
});