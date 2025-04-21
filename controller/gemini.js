require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeminiLogs = require("../models/GeminiLogs");
const Chat=require("../models/Chat.js")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generatePodcastSearchQuery(userPrompt, chatID) {
  try {
    const history=await GeminiLogs.find({chatId:chatID}).sort({createdAt: 1});
    const formattedHistory = history.map((log) => ({
      role: log.role,
      parts: log.parts.map((part) => ({ text: part.text })),
    }));
    const currChat=await Chat.findById(chatID);
    console.log("history:",history)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 50,
      },
    });

    const chat=model.startChat({
      history:formattedHistory
    })

const prompt = `
You are an assistant helping to suggest podcasts for road trips.

Given the user prompt: "${userPrompt}",

Do the following:

1. Generate a short, concise search query (under 10 words) based on the topic, to be used in a podcast search engine.
2. Generate a **friendly intro message** that feels casual, fun, and topic-specific. For example:
   - If it's about technology: "Hey techie! Here are some podcasts you might enjoy on your road trip."
   - If it's about crime: "Buckle up for some thrilling crime stories on your journey!"
   - If it's general: "Here are some handpicked podcasts for your road adventure."
3. Both the query and message must be in the **same tone** (fun, chill, serious, religious, geeky, etc. — based on the user prompt).
4. The **search query** must be directly related to the topic/theme of the intro message.

Only return the output in the following format, with no extra explanation:

SearchQuery: <search query here>
IntroMessage: <message here>
`;

  


    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const text = response.text().trim();

    let userLog = await new GeminiLogs({
      role: "user",
      chatId: currChat._id,
      parts: [{ text: userPrompt }],
    });
    
    await userLog.save();
    
    let modelLog = await new GeminiLogs({
      role: "model",
      text: text,
      chatId: currChat._id,
      parts: [{ text: text }],
    });
    currChat.geminiLog.push(userLog,modelLog);
    await currChat.save();


    console.log("Gemini raw output:\n", text);

    // Use regex to find SearchQuery and IntroMessage
    const searchQueryMatch = text.match(/SearchQuery:\s*(.*)/i);
    const introMessageMatch = text.match(/IntroMessage:\s*(.*)/i);

    const searchQuery = searchQueryMatch
      ? searchQueryMatch[1].trim()
      : "road trip podcast";
    const introMessage = introMessageMatch
      ? introMessageMatch[1].trim()
      : "Here are some great podcasts to enjoy on your trip!";

    return { searchQuery, introMessage };


  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "road trip podcast"; // fallback query
  }
}

module.exports = { generatePodcastSearchQuery };
