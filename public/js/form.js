const form=document.getElementById("search-form");
const submitBtn=document.querySelector("div.input-active-indicator")
submitBtn.addEventListener("click", function() {
    console.log("clicked")
    form.submit();
})