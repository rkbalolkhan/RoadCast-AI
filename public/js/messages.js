let msgBox=document.querySelector("#msg-box")


for(let message of messages) {
    if(message.type === "in") {
        const msgIn=document.createElement("div")
        msgIn.className="msg-in";

        const msgInText=document.createElement("p")
        msgInText.className="msg-in-text"
        msgInText.innerHTML=message.content;
        msgIn.appendChild(msgInText);
        
        msgBox.appendChild(msgIn);
    }else if(message.type === "out") {
        const msgOut = document.createElement("div");
        msgOut.className = "msg-out";
        msgBox.appendChild(msgOut);
        let msgLogo = document.createElement("div");
        msgLogo.className = "msg-logo";
        msgLogo.innerHTML = `<img src="/images/logo.png" alt="" srcset="">`;
        msgOut.appendChild(msgLogo);
        const videoSuggestion=document.createElement("div")
        videoSuggestion.className="video-suggestion";
        msgOut.appendChild(videoSuggestion);
        videoSuggestion.innerHTML=message.content;
    }
}