document.addEventListener("DOMContentLoaded", () => {
  const radioButtons = document.querySelectorAll("input[name='inputOption']");

  radioButtons.forEach((radio) => {
    radio.addEventListener("mousedown", function (e) {
      // If already checked, mark a custom attribute to uncheck later
      if (this.checked) {
        this.dataset.wasChecked = "true";
      } else {
        this.dataset.wasChecked = "false";
      }
    });

    radio.addEventListener("click", function (e) {
      // If the button was already checked, uncheck it
      if (this.dataset.wasChecked === "true") {
        this.checked = false;
      }
      // Clean up the custom attribute
      this.dataset.wasChecked = "";
    });
  });

  const form = document.getElementById("search-form");
  const msgBox = document.getElementById("msg-box");
  const sendButton = document.querySelector("input-active-indicator");

  if (form && msgBox) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent form from reloading the page

      const userMessageInput = document.getElementById("user-message");
      const inputOption = document.querySelector(
        "input[name='inputOption']:checked"
      ).value;
      if (!userMessageInput) return;

      const userMessage = userMessageInput.value.trim();
      if (!userMessage) {
        alert("Please enter a message.");
        return;
      }

      try {
        const response = await fetch("/api/sendMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: userMessage, option:inputOption, chatID:chat._id}),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error from server:", error);
          alert("Failed to send message. Please try again.");
          return;
        }

        const data = await response.json();

        // Add the user's message to the page
        const userMsgDiv = document.createElement("div");
        userMsgDiv.className = "msg-in";
        userMsgDiv.innerHTML = `<p class='msg-in-text'>${data.userMessage.content}</p>`;
        msgBox.appendChild(userMsgDiv);

        // Add the response message to the page
        const responseMsgDiv = document.createElement("div");
        responseMsgDiv.className = "msg-out";
        responseMsgDiv.innerHTML = `${data.responseMessage.content}`;
        msgBox.appendChild(responseMsgDiv);

        // Clear the input field
        userMessageInput.value = "";
      } catch (error) {
        console.error("Error sending message:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }
});
