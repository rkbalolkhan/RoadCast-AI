const express = require("express");
const app = express();

const User = require("../models/User.js");
const Message = require("../models/Message.js");
const Chat = require("../models/Chat.js");
const geminiController = require("./gemini.js");
const { registerValidation, loginValidation } = require("../validation.js");
const passport = require("passport");
const chatController = require("./chat.js");

module.exports.renderIndexPage = async (req, res) => {
  let chats = [];
  if (req.user) {
    chats = await chatController.getChats(req, res);
  }
  res.render("index.ejs", { chats, results:[], messages: [], chat: undefined });
};

module.exports.renderChatPage = async (req, res) => {
  const chats = await chatController.getChats(req, res);
  const chat = await Chat.findById(req.params.chatID).populate("messages");
  res.render("index", { chat, chats, messages: chat.messages });
};

// Registration route
module.exports.registerUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { firstName, lastName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("Email already exists.");

    const newUser = new User({ firstName, lastName, username, email, password });
    await newUser.save();
    res.redirect("/")
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
};

// Login route
module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect("/"); // Redirect after successful login
    });
  })(req, res, next);
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
};

module.exports.renderAboutPage = (req, res) => {
  res.render("about");
};

module.exports.renderContactPage = (req, res) => {
  res.render("contact");
};

module.exports.getMessages = async (req, res) => {
  try {
    const chatId = req.query.chatId;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.render("index", { results: [], messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.render("index", { results: [], messages: [] });
  }
};

module.exports.addMessage = async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content)
    return res.status(400).send("Chat ID and content are required.");

  try {
    const newMessage = new Message({
      chatId,
      senderType: "user", // Since this is a user message
      content,
    });
    await newMessage.save(); // Save the message to the database
    res.redirect(`/?chatId=${chatId}`); // Redirect back to the chat page
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).send("Error saving message.");
  }
};

module.exports.addTestMessage = async (req, res) => {
  async function addMessages() {
    try {
      // Find a chat to associate the messages with
      const chat = await Chat.findOne();
      if (!chat) {
        console.error("No chat found. Please create a chat first.");
        return;
      }

      // Sample messages
      const messages = [
        {
          chatId: chat._id,
          type: "in",
          content: "Hello! Can you suggest a podcast?",
        },
        {
          chatId: chat._id,
          type: "out",
          content: `
          <div class="videoSuggestions">
            <p class="msg-out-text">Here are some suggestions:</p>
            
            <div class="youtube-video-card card">
              <a href="https://www.youtube.com/watch?v=4tXDPQjmcTI" target="_blank">
                <div class="video-title card-body">
                  <p><strong>AL QUDS DAY | JUMMA TUL WIDA | MUFTI SALMAN AZHARI</strong></p>
                  <p class="video-description">Assalamu Alaikum You all know that this official Channel is specially made for delivering Islamic lectures of renowned Islamic ...</p>
                </div>
                <img src="https://i.ytimg.com/vi/4tXDPQjmcTI/default.jpg" alt="AL QUDS DAY | JUMMA TUL WIDA | MUFTI SALMAN AZHARI" class="video-thumbnail">
              </a>
            </div>

            <div class="youtube-video-card card">
              <a href="https://www.youtube.com/watch?v=iZOws3h-1JA" target="_blank">
                <div class="video-title card-body">
                  <p><strong>SHAB E QADR | RAMADAN 2025 | MUFTI SALMAN AZHARI</strong></p>
                  <p class="video-description">Assalamu Alaikum You all know that this official Channel is specially made for delivering Islamic lectures of renowned Islamic ...</p>
                </div>
                <img src="https://i.ytimg.com/vi/iZOws3h-1JA/default.jpg" alt="SHAB E QADR | RAMADAN 2025 | MUFTI SALMAN AZHARI" class="video-thumbnail">
              </a>
            </div>

            <div class="youtube-video-card card">
              <a href="https://www.youtube.com/watch?v=_yB9uIlXYos" target="_blank">
                <div class="video-title card-body">
                  <p><strong>उठो ए जवानों छोड़ दो इन तमाम अय्याशियों को Mufti Salman Azhari Sahab Bayan</strong></p>
                  <p class="video-description"></p>
                </div>
                <img src="https://i.ytimg.com/vi/_yB9uIlXYos/default.jpg" alt="उठो ए जवानों छोड़ दो इन तमाम अय्याशियों को Mufti Salman Azhari Sahab Bayan" class="video-thumbnail">
              </a>
            </div>

            <div class="youtube-video-card card">
              <a href="https://www.youtube.com/watch?v=IB5h7ozZF3Q" target="_blank">
                <div class="video-title card-body">
                  <p><strong>Mufti Salman Azhari | Quran Ki Dunya | Episode 07 | Quran Pak Ke Mazameen Aur Us Ka Challenge</strong></p>
                  <p class="video-description">Mufti Salman Azhari | Quran Ki Dunya | Episode 07 | Quran Pak Ke Mazameen Aur Us Ka Challenge. Do not forget to subscribe ...</p>
                </div>
                <img src="https://i.ytimg.com/vi/IB5h7ozZF3Q/default.jpg" alt="Mufti Salman Azhari | Quran Ki Dunya | Episode 07 | Quran Pak Ke Mazameen Aur Us Ka Challenge" class="video-thumbnail">
              </a>
            </div>

            <div class="youtube-video-card card">
              <a href="https://www.youtube.com/watch?v=bQBQia6dUpI" target="_blank">
                <div class="video-title card-body">
                  <p><strong>MEHFIL E ZIKR WA LAYLATUL QADR | 23RD RAMADAN LIVE | MUFTI SALMAN AZHARI</strong></p>
                  <p class="video-description">Assalamu Alaikum You all know that this official Channel is specially made for delivering Islamic lectures of renowned Islamic ...</p>
                </div>
                <img src="https://i.ytimg.com/vi/bQBQia6dUpI/default.jpg" alt="MEHFIL E ZIKR WA LAYLATUL QADR | 23RD RAMADAN LIVE | MUFTI SALMAN AZHARI" class="video-thumbnail">
              </a>
            </div>
          </div>
          `,
        },
        {
          chatId: chat._id,
          type: "in",
          content: "I prefer something related to technology.",
        },
        {
          chatId: chat._id,
          type: "out",
          content: "How about 'The Daily Tech News Show'?",
        },
      ];

      // Insert messages into the database
      for (let message of messages) {
        const newMessage = new Message(message);
        await newMessage.save(); // Save each message

        chat.messages.push(newMessage._id); // Add message ID to chat
        await chat.save();
      }
      console.log("Messages added successfully!");
    } catch (error) {
      console.error("Error adding messages:", error);
    }
  }

  addMessages();
};