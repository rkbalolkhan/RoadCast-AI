const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        default: "New Chat",
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    geminiLog:[{
        type:mongoose.Types.ObjectId,
        ref:"GeminiLogs"
    }]
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;