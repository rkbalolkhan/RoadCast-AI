document.addEventListener("DOMContentLoaded", () => {
  const sliderNavbar = document.getElementById("sliderNavbar");
  const toggleSidebar = document.getElementById("openSlider");
  const profilePopup = document.getElementById("profilePopup");
  const openProfile = document.getElementById("openProfile");
  const openNewChatBtn = document.getElementById("openNewChat");
  const chatHistory = document.querySelector(".navbar-chat-history");
  const chatHistoryItems = chatHistory.querySelectorAll(".chat-history-item");

  function chatHistoryEventListnerAdder(){
    if (chatHistoryItems.length > 0) {
      const openChatMenu = document.querySelectorAll(".openChatMenu");
      const chatMenuPopup = document.querySelectorAll(".chat-menu-popup");


      for(let item of openChatMenu){
        item.addEventListener("click",() => {
          let currChatMenu=item.nextElementSibling;
          currChatMenu.classList.toggle("open");
          console.dir(currChatMenu)

          if (currChatMenu.classList.contains("open")) {
            const editFormPopup = document.getElementById("editFormPopup");
            const openEditForm = document.getElementById("openEditForm");

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
          currChatMenu.addEventListener("mouseleave", () => {
            currChatMenu.classList.remove("open");
          });

          window.addEventListener("click", (e) => {
            if (
              !currChatMenu.contains(e.target) &&
              e.target != item
            ) {
              currChatMenu.classList.remove("open");
            }
          });
        });
      };
    }
  }

  chatHistoryEventListnerAdder();
  

  // Toggle sidebar width
  toggleSidebar.addEventListener("click", () => {
    sliderNavbar.classList.toggle("collapsed");
  });

  openProfile.addEventListener("click", () => {
    profilePopup.classList.add("open");
    profilePopup.addEventListener("mouseleave", () => {
      profilePopup.classList.remove("open");
    });
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
      chatHistory.appendChild(newChatItem);
      newChatItem.outerHTML = `
          <div class="chat-history-item">
            <a href="/chat/${data._id}">${data.name}</a>
            <i class="fa-solid fa-ellipsis-vertical openChatMenu"></i>
            <div id="chatMenuPopup" class="chat-menu-popup">
              <ul>
                <li class="chat-menu-item" id="openEditForm">
                  <i class="fa-solid fa-pen"></i> Rename
                </li>
                <li class="chat-menu-item delete">
                  <i class="fa-solid fa-trash"></i> Delete
                </li>
              </ul>
          </div>
      </div>`;
      chatHistoryEventListnerAdder()

    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
});
