document.addEventListener("DOMContentLoaded", () => {
  const sliderNavbar = document.getElementById("sliderNavbar");
  const toggleSidebar = document.getElementById("openSlider");
  const profilePopup= document.getElementById("profilePopup");
  const openProfile = document.getElementById("openProfile");
  const openNewChatBtn = document.getElementById("openNewChat");
  const chatHistory = document.querySelector(".navbar-chat-history");
  const chatHistoryItems = chatHistory.querySelectorAll(".chat-history-item");
  
  if(chatHistoryItems.length>0){
    const openChatMenu = document.querySelectorAll(".openChatMenu");
    const chatMenuPopup = document.querySelectorAll(".chatMenuPopup");

    for(let i=0;i<openChatMenu.length;i++){
      openChatMenu[i].addEventListener("click", function(){
        chatMenuPopup[i].classList.toggle("open");
      })
      
    }

    openChatMenu.forEach((item) => {
      item.onclick = () => {
        chatMenuPopup.classList.toggle("open");

        if (chatMenuPopup.classList.contains("open")) {
          const editFormPopup = document.getElementById("editFormPopup");
          const openEditForm = document.getElementById("openEditForm");
          console.log(openEditForm);

          if (openEditForm) {
            openEditForm.onclick = () => {
              editFormPopup.classList.toggle("open");
              const cancelEditForm = document.getElementById("cancelEditBtn");
              if (cancelEditForm) {
                cancelEditForm.onclick = () => {
                  editFormPopup.classList.remove("open");
                };
              }
            };
          }
        }
        chatMenuPopup.addEventListener("mouseleave", () => {
          chatMenuPopup.classList.remove("open");
        });

        window.addEventListener("click", (e) => {
          if (!chatMenuPopup.contains(e.target) && e.target !== openChatMenu) {
            chatMenuPopup.classList.remove("open");
          }
        });
      };
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

    // filepath: u:\Web Development Projects\New folder\RoadCastAI\public\js\index.js
  openNewChatBtn.onclick = async () => {
      console.log("New chat button clicked");
      try {
          const response = await fetch("/api/chat/new", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
          });
  
          if (!response.ok) {
              const errorText = await response.text(); // Read the response as text
              console.error("Error response from server:", errorText);
              throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log("New chat created:", data);
  
          // Optionally update the UI with the new chat
          const chatHistory = document.querySelector(".navbar-chat-history");
          const newChatItem = document.createElement("div");
          newChatItem.classList.add("chat-history-item");
          newChatItem.innerHTML = `<p>${data.name}</p>`;
          chatHistory.appendChild(newChatItem);
      } catch (error) {
          console.error("Error creating new chat:", error);
      }
  };

  
});