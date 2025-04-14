const Message = require("../models/Message.js");
const Chat = require("../models/Chat.js");
const youtube=require("./youtube.js");
const spotify=require("./spotify.js");
const { generatePodcastSearchData } = require("./gemini.js");


module.exports.sendMessage=async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content is required." });
    }

    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = new Chat({ user: req.user._id, messages: [] });
      await chat.save();
    }

    // Save the user's message to the database
    const userMessage = new Message({
      chatId: chat._id,
      type: "in",
      content,
    });
    await userMessage.save();

    // Call Gemini to generate a response
    const { youtubeQuery, spotifyQuery, message } =
      await generatePodcastSearchData(content);

    const youtubeResults = await youtube.getResult(youtubeQuery);
    const spotifyResults = await spotify.getResult(spotifyQuery);
    console.log("Youtube Results:", youtubeResults);
    let youtubeFinalResult='';
    let spotifyFinalResult='';
    youtubeResults.forEach((result) => {
      youtubeFinalResult+=`
      <div class="youtube-video-card card">
        <a href="${result.link}" target="_blank">
            <div class="video-title card-body">
                <p><strong>${result.title}</strong></p>
                <p class="video-description">${result.description}</p>
            </div>
            <img src="${result.thumbnail}" alt="${result.title}" class="video-thumbnail">
        </a>
    </div>`;
    });

    spotifyResults.forEach((result) => {
        spotifyFinalResult += `
        <div class="youtube-video-card card">
            <a href="${result.url}" target="_blank">
                <div class="video-title card-body">
                    <p><strong>${result.name}</strong>${result.publisher}</p>
                    <p class="video-description">${result.description}</p>
                </div>
                <img src="${result.image}" alt="${result.title}" class="video-thumbnail">
            </a>
        </div>`;
    });

    const responseMessage = new Message({
      chatId: chat._id,
      type: "out",
      content: `
      <div class="videoSuggestions">
        <p class="msg-out-text">${message}</p>
        ${youtubeFinalResult}
        ${spotifyFinalResult}
      </div>
      `,
    });
    await responseMessage.save();

    // Add the messages to the chat
    chat.messages.push(userMessage._id, responseMessage._id);
    await chat.save();

    // Send the messages back to the frontend
    res.json({ userMessage, responseMessage });
  } catch (error) {
    console.error("Error handling message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the message." });
  }
};
