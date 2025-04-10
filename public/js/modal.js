document.addEventListener("DOMContentLoaded", () => {
  let loginModal = document.getElementById("loginModal");
  let logoutModal = document.getElementById("logoutModal");
  let signupModal = document.getElementById("signupModal");
  let closeLogin = document.getElementById("closeLogin");
  let closeLogout = document.getElementById("closeLogout");
  let closeSignup = document.getElementById("closeSignup");

  // Open login modal
  document.querySelector(".login-link").addEventListener("click", (e) => {
    e.preventDefault();
    closeLogin = document.getElementById("closeLogin");
    loginModal.style.display = "block";
    closeLogin.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  });

  // Open signup modal
  document.querySelector(".signup-link").addEventListener("click", (e) => {
    e.preventDefault();
    closeSignup = document.getElementById("closeSignup");
    signupModal.style.display = "block";

    closeSignup.addEventListener("click", () => {
      signupModal.style.display = "none";
    });
  });

  // Open logout modal
  document.querySelector(".logout-link").addEventListener("click", (e) => {
    e.preventDefault();
    closeLogout = document.getElementById("closeLogout");
    logoutModal.style.display = "block";

    closeLogout.addEventListener("click", () => {
      logoutModal.style.display = "none";
    });
  });

  // Confirm logout
  confirmLogout.addEventListener("click", () => {
    alert("You have been logged out.");
    logoutModal.style.display = "none";
  });

  // Cancel logout
  cancelLogout.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
    if (e.target === signupModal) {
      signupModal.style.display = "none";
    }
    if (e.target === logoutModal) {
      logoutModal.style.display = "none";
    }
  });
});