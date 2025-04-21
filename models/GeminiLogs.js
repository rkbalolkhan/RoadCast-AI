const mongoose = require("mongoose");

const geminiLogsSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    parts: [
      {
        text: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GeminiLogs", geminiLogsSchema);
