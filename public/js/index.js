document.addEventListener("DOMContentLoaded", () => {
  const sliderNavbar = document.getElementById("sliderNavbar");
  const toggleSidebar = document.getElementById("openSlider");
  const profilePopup= document.getElementById("profilePopup");
  const openProfile = document.getElementById("openProfile");

  // Toggle sidebar width
  toggleSidebar.addEventListener("click", () => {
    sliderNavbar.classList.toggle("collapsed");
  });

  openProfile.addEventListener("click", () => {
    profilePopup.classList.add("open");
    profilePopup.addEventListener("mouseleave", () => {
      profilePopup.classList.remove("open");
    })
  });

  // Close slider when clicking outside
  window.addEventListener("click", (e) => {
    if (!sliderNavbar.contains(e.target) && e.target !== toggleSidebar) {
      sliderNavbar.classList.add("collapsed");
    }
    
  });
});