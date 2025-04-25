const Message = require("../models/Message.js");
const Chat = require("../models/Chat.js");
const gemini = require("./gemini.js");
const ListenNote = require("./listen-note.js");

module.exports.sendMessage = async (req, res) => {
  try {
    console.log(req.body);
    const { content, option, chatID } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required." });
    }
    let FinalResult = "";
    let isNewChat = false;
    let chat = await Chat.findOne({ user: req.user._id, _id: chatID });
    console.log(chat);
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

    let podcastSearchData =undefined;
    

    let { searchQuery, introMessage, greetingMessage, invalidMessage } =
      await gemini.generatePodcastSearchQuery(content, chatID);
    
    if (searchQuery != undefined && introMessage != undefined) {
      podcastSearchData = await ListenNote.searchPodcasts(searchQuery);

      if (podcastSearchData != undefined) {
        if (podcastSearchData.length === 0) {
          console.log("Podcast data not found");
          introMessage = await gemini.noResultFound(
            searchQuery,
            chatID,
            introMessage
          );
        } else {
          console.log("Podcast data not found");
          for (let data of podcastSearchData) {
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
        }
      }
    }
    if (
      introMessage == undefined &&
      greetingMessage != undefined &&
      invalidMessage == undefined
    ) {
      introMessage = greetingMessage;
      
    } else if (
      introMessage == undefined &&
      greetingMessage == undefined &&
      invalidMessage != undefined
    ) {
      introMessage = invalidMessage;
    }

    

    const responseMessage = new Message({
      chatId: chat._id,
      type: "out",
      content: `
      <div class="videoSuggestions">
        <p class="msg-out-text">${introMessage}</p>
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
