const Message = require("../models/Message.js");
const Chat = require("../models/Chat.js");
const gemini = require("./gemini.js");
const ListenNote=require("./listen-note.js")

module.exports.sendMessage = async (req, res) => {
  try {
    const { content,chatID } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required." });
    }

    let isNewChat = false;
    let chat = await Chat.findOne({ user: req.user._id, _id:chatID });

    if (!chat) {
      isNewChat = true;
      chat = new Chat({ user: req.user._id, messages: [] });
      await chat.save();
    }

    const userMessage = new Message({
      chatId: chat._id,
      type: "in",
      content,
    });
    await userMessage.save();
    let message="Here are podcasts for you";
    let query = await gemini.generatePodcastSearchQuery(content);
    let podcastSearchData = await ListenNote.searchPodcasts(query)

    let FinalResult = "";


    for(let data of podcastSearchData){
    FinalResult += `
        <div class="youtube-video-card card">
          <a href="${data.link}" target="_blank">
              <div class="video-title card-body">
                  <p><strong>${data.title}</strong></p>
                  <p class="video-description">${data.description}</p>
              </div>
              <img src="${data.thumbnail}" alt="${data.title}" class="video-thumbnail">
          </a>
        </div>;`;
    
    }


    // for (const [platform, url] of Object.entries(links)) {
    //   if (platform === "YouTube") {
    //     const result = await youtubeController.getResult(url);
    //     FinalResult += `
    //     <div class="youtube-video-card card">
    //       <a href="${result.videoUrl}" target="_blank">
    //           <div class="video-title card-body">
    //               <p><strong>${result.title}</strong></p>
    //               <p class="video-description">${result.description}</p>
    //           </div>
    //           <img src="${result.thumbnail}" alt="${result.title}" class="video-thumbnail">
    //       </a>
    //     </div>;`;
    //   } else if (platform === "Spotify") {
    //     const result = await spotifyController.getResult(url);
    //     FinalResult += `
    //     <div class="youtube-video-card card">
    //       <a href="${result.url}" target="_blank">
    //           <div class="video-title card-body">
    //               <p><strong>${result.name}</strong>,${result.publidher}</p>
    //               <p class="video-description">${result.description}</p>
    //           </div>
    //           <img src="${result.image}" alt="${result.title}" class="video-thumbnail">
    //       </a>
    //     </div>;`;
    //   }
    // }

    const responseMessage = new Message({
      chatId: chat._id,
      type: "out",
      content: `
      <div class="videoSuggestions">
        <p class="msg-out-text">${message}</p>
        ${FinalResult}
      </div>
      `,
    });

    await responseMessage.save();

    chat.messages.push(userMessage._id, responseMessage._id);
    await chat.save();

    if (isNewChat) {
      return res
        .redirect(`/chat/${chat._id}`)
        .json({ userMessage, responseMessage });
    }

    res.json({ userMessage, responseMessage });
  } catch (error) {
    console.error("Error handling message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the message." });
  }
};
