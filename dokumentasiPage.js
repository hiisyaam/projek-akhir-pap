const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
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
      !userDropdown.classList.contains("hidden") &&
      !userMenuButton.contains(event.target) &&
      !userDropdown.contains(event.target)
    ) {
      userDropdown.classList.add("hidden");
    }
  });
}

function adjustLayoutForHeader() {
  const header = document.querySelector("header");
  const sidebar = document.getElementById("documentation-sidebar");
  if (header) {
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = headerHeight + "px";
    document.documentElement.style.setProperty(
      "--header-height",
      headerHeight + "px"
    );

    if (sidebar && window.innerWidth >= 768) {
      sidebar.style.top = `calc(${headerHeight}px + 2.5rem)`;
      sidebar.style.maxHeight = `calc(100vh - ${headerHeight}px - 5rem)`;
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
      if (dot) {
        dot.classList.remove("bg-custom-violet");
        dot.classList.add("bg-neutral-500");
        if (
          link.parentElement.previousElementSibling?.classList.contains(
            "sidebar-link-active"
          )
        ) {
          link.parentElement.previousElementSibling.classList.remove(
            "sidebar-link-active"
          );
          const parentDot =
            link.parentElement.previousElementSibling.querySelector(
              "span:first-child"
            );
          if (parentDot) {
            parentDot.classList.remove("bg-custom-violet");
            parentDot.classList.add("bg-neutral-500");
          }
        }
      }

      if (link.dataset.content === targetId) {
        link.classList.add("sidebar-link-active");
        if (dot) {
          dot.classList.remove("bg-neutral-500");
          dot.classList.add("bg-custom-violet");
        }
        const parentDiv = link.closest("div.pl-10");
        if (parentDiv) {
          const parentLink = parentDiv.previousElementSibling;
          if (parentLink && parentLink.matches("a.sidebar-nav-link")) {
            parentLink.classList.add("sidebar-link-active");
            const parentDot = parentLink.querySelector("span:first-child");
            if (parentDot) {
              parentDot.classList.remove("bg-neutral-500");
              parentDot.classList.add("bg-custom-violet");
            }
          }
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
    if (mainContentArea) {
      setTimeout(
        () =>
          mainContentArea.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        0
      );
    }
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.dataset.content;
      if (targetId) {
        showContent(targetId);
        if (history.pushState) {
          history.pushState(null, null, `#${targetId}`);
        } else {
          window.location.hash = targetId;
        }
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
  if (initialHash) {
    showContent(initialHash);
  } else {
    showContent(defaultSectionId);
  }
});

window.addEventListener("load", () => {
  adjustLayoutForHeader();
});
window.addEventListener("resize", () => {
  adjustLayoutForHeader();
});

document.querySelectorAll(".logout-button").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Logout action initiated.");
    alert("Logout functionality would be implemented here.");
  });
});
