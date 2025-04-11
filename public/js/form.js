document.addEventListener("DOMContentLoaded", () => {
  const radioButtons = document.querySelectorAll("input[name='input-option']");

  radioButtons.forEach((radio) => {
    radio.addEventListener("click", function () {
      if (this.checked) {
        this.checked = false; // Uncheck if already checked
      } else {
        this.checked = true; // Check if not already checked
      }
    });
  });
});

const form=document.getElementById("search-form");
const submitBtn=document.querySelector("div.input-active-indicator")
submitBtn.addEventListener("click", function() {
    const response=fetch("/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: document.querySelector(".holo-input").value,
            type: document.querySelector("input[name='input-option']").value,
        })
    })
}
)

