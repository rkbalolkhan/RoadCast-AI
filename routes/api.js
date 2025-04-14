const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.js");
const { ensureAuthenticated } = require("../middleware/auth.js");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { generatePodcastSearchData } = require("../controller/gemini");
const messageController = require("../controller/message.js");

router
    .route("/chat/new")
    .post(ensureAuthenticated, chatController.startNewChat);

router.post("/sendMessage", messageController.sendMessage);

module.exports = router;