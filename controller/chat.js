const Chat = require("../models/Chat.js");
const Message = require("../models/Message.js");

module.exports.getChats = async (req, res) => {
  try {
    let chats=[]
    chats = await Chat.find({ user: req.user._id }).populate("messages");
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).send("Error fetching chats.");
  }
};

module.exports.startNewChat = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "User not authenticated." });

    const newChat = new Chat({ user: req.user._id, messages: [], name: "New Chat" });
    await newChat.save();
    res.status(200).send(newChat)
  } catch (error) {
    console.error("Error starting new chat:", error);
    res.status(500).json({ error: "Error starting new chat." });
  }
};

module.exports.renameChat = async (req, res) => {
  const { chatId, newName } = req.body;
  if (!chatId || !newName) return res.status(400).send("Chat ID and new name are required.");

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, user: req.user._id },
      { name: newName },
      { new: true }
    );
    if (!chat) return res.status(404).send("Chat not found.");
    res.send({ message: "Chat renamed successfully.", chat });
  } catch (error) {
    console.error("Error renaming chat:", error);
    res.status(500).send("Error renaming chat.");
  }
};

module.exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) return res.status(400).send("Chat ID is required.");

  try {
    const chat = await Chat.findOneAndDelete({ _id: chatId, user: req.user._id });
    if (!chat) return res.status(404).send("Chat not found.");
    await Message.deleteMany({ chatId: chat._id }); // Delete associated messages
    res.send({ message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).send("Error deleting chat.");
  }
};
