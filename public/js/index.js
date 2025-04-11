document.addEventListener("DOMContentLoaded", () => {
  const sliderNavbar = document.getElementById("sliderNavbar");
  const openSlider = document.getElementById("openSlider");
  const profilePopup= document.getElementById("profilePopup");
  const openProfile = document.getElementById("openProfile");
  // Open slider navbar
  openSlider.addEventListener("click", () => {
    sliderNavbar.classList.toggle("open");
  });

  openProfile.addEventListener("click", () => {
    profilePopup.classList.add("open");
    profilePopup.addEventListener("mouseleave", () => {
      profilePopup.classList.remove("open");
    })
  });

  // Close slider when clicking outside
  window.addEventListener("click", (e) => {
    if (!sliderNavbar.contains(e.target) && e.target !== openSlider) {
      sliderNavbar.classList.remove("open");
    }
    
  });
});