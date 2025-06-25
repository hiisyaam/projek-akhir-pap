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