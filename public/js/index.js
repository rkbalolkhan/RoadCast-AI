document.addEventListener("DOMContentLoaded", () => {
  const sliderNavbar = document.getElementById("sliderNavbar");
  const toggleSidebar = document.getElementById("openSlider");
  const profilePopup= document.getElementById("profilePopup");
  const openProfile = document.getElementById("openProfile");
  const chatMenuPopup=  document.getElementById("chatMenuPopup");
  const openChatMenu = document.getElementById("openChatMenu");

  openChatMenu.onclick=()=>{
    chatMenuPopup.classList.toggle("open");
    
    if(chatMenuPopup.classList.contains("open")){
      const editFormPopup = document.getElementById("editFormPopup");
      const openEditForm = document.getElementById("openEditForm");
      console.log(openEditForm);

      openEditForm.onclick = () => {
        editFormPopup.classList.toggle("open");
        const cancelEditForm = document.getElementById("cancelEditBtn");
        cancelEditForm.onclick = () => {
          editFormPopup.classList.remove("open");
        }
      }
    }
    chatMenuPopup.addEventListener("mouseleave", () => {
      chatMenuPopup.classList.remove("open");
    })

    window.addEventListener("click", (e) => {
      if (!chatMenuPopup.contains(e.target) && e.target !== openChatMenu) {
        chatMenuPopup.classList.remove("open");
      }
    })

    
  }

  

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


