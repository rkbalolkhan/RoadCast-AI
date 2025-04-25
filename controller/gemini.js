require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeminiLogs = require("../models/GeminiLogs");
const Chat = require("../models/Chat.js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function noResultFound(searchQuery, chatID, introMessage) {
  try {
    const history = await GeminiLogs.find({ chatId: chatID }).sort({
      createdAt: 1,
    });
    const formattedHistory = history.map((log) => ({
      role: log.role,
      parts: log.parts.map((part) => ({ text: part.text })),
    }));
    const currChat = await Chat.findById(chatID);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 50,
      },
    });

    const chat = model.startChat({
      history: formattedHistory,
    });

    const prompt = `
You are an assistant that helps users find podcasts for road trips.

no results are found based on the search query, generate a short message that:

1. Acknowledges that no suitable podcasts were found.
2. Keeps the tone consistent with previous responses (fun, chill, serious, geeky, religious, etc.).
3. Encourages the user to try a different topic or rephrase their query.

Only return the message in the following format, with no extra explanation:

NoResultsMessage: <your message here>
Search Query ${searchQuery}
`;

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const text = response.text().trim();

    const lastLog = await GeminiLogs.findOne({ chatId: chatID, role: "model" })
      .sort({ createdAt: -1 })
      .exec();
    if (lastLog && lastLog.parts.text.contains(introMessage)) {
      await GeminiLogs.replaceOne(
        { _id: lastLog._id },
        {
          role: "model",
          text: text,
          chatId: currChat._id,
          parts: [{ text: text }],
        },
        { upsert: true }
      );
    }

    await currChat.save();

    const NoResultsMessageMatch = text.match(/NoResultsMessage:\s*(.*)/i);

    const NoResultsMessage = NoResultsMessageMatch
      ? NoResultsMessageMatch[1].trim()
      : "No suitable podcasts found. Please try a different topic or rephrase your query.";

    return NoResultsMessage;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "road trip podcast"; // fallback query
  }
}

async function generatePodcastSearchQuery(userPrompt, chatID) {
  try {
    const history = await GeminiLogs.find({ chatId: chatID }).sort({
      createdAt: 1,
    });
    const formattedHistory = history.map((log) => ({
      role: log.role,
      parts: log.parts.map((part) => ({ text: part.text })),
    }));
    const currChat = await Chat.findById(chatID);
    console.log("history:", history);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 50,
      },
    });

    const chat = model.startChat({
      history: formattedHistory,
    });

    const prompt = `
You are an assistant helping to suggest podcasts for road trips.

Given the user prompt: "${userPrompt}",
Detect the language of the user input.
Reply in the same language
patiently determine the intent and respond appropriately in one of the following ways — but always return the response carefully
either starting with 
only SearchQuery: and IntroMessage:
or
only greetingMessage
or
only invalidMessage: as specified below, with no explanation or formatting like code blocks.

Guidelines:
I. If the user is asking for podcasts:

- Generate a short, concise search query (under 10 words) based on the topic, to be used in a podcast search engine.
   - Generate a **friendly intro message** that feels casual, fun, and topic-specific. For example:
     - If it's about technology: "Hey techie! Here are some podcasts you might enjoy on your road trip."
     - If it's about crime: "Buckle up for some thrilling crime stories on your journey!"
     - If it's general: "Here are some handpicked podcasts for your road adventure."
   - Both the query and message must be in the **same tone** (fun, chill, serious, religious, geeky, etc. — based on the user prompt).
   - The **search query** must be directly related to the topic/theme of the intro message.
   - Format the output exactly like this (no explanation):

Combine both query and IntroMessage into one message like:
Examples:
- User: Suggest some space exploration podcasts
  Gemini:
        SearchQuery: space exploration podcasts
        IntroMessage: Buckle up, space lover! These podcasts will take you to the stars on your next drive.
- User: I want something about ancient history
  Gemini:
        SearchQuery: ancient history podcasts
        IntroMessage: Time-travel with these ancient tales — perfect company for your road trip through the ages!

II. If the user is greeting in any language (e.g., hi, hello, assalamualaikum):
If the user greets you (e.g. "Hello", "How are you?", "What's up?"), respond with:

1. A cheerful, brief message that keeps the tone light and helpful.
2. A transition to encourage them to ask for podcast suggestions.

Examples:
- User: Hey there
  Gemini: greetingMessage: Hey! I'm ready with awesome podcast recs whenever you are!
- User: How's it going?
  Gemini: greetingMessage: All set to help you find something fun to listen to on the road!
- User: Assalamualaikum
  Gemini: greetingMessage: WalaikumAssalam
- User: Khairiyat?
  Gemini: greetingMessage: Alhamdulillah
  
  Always stay in the assistant role and respond in a friendly and fun tone.
  Only return the response message without extra commentary.
  
  III. If the user is asking for something other than podcasts:
  
  Kindly inform them that your role is to help with podcast suggestions only.
  Example:
- User: Can you give me restaurant suggestions?
  Gemini: invalidMessage: I can only help you discover awesome podcasts for road trips. Try asking for podcast ideas on a topic you love!
- User: Can you play music for me?
  Gemini: invalidMessage: I wish I could DJ for you! But for now, I can only help you find awesome podcasts for your road trips.
-User: What’s the weather like in Jalandhar?
  Gemini: invalidMessage: I’m all about podcasts, not forecasts! Try asking me for podcast ideas instead — I’ve got plenty!

Always make sure the tone (fun, chill, serious, geeky, etc.) matches the user's original prompt.

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
    currChat.geminiLog.push(userLog, modelLog);
    await currChat.save();

    console.log("Gemini raw output:\n", text);

    // Use regex to find SearchQuery and IntroMessage
    const searchQueryMatch = text.match(/SearchQuery:\s*(.*)/i);
    const introMessageMatch = text.match(/IntroMessage:\s*(.*)/i);
    const greetingMessageMatch = text.match(/greetingMessage:\s*(.*)/i);
    const invalidMessageMatch = text.match(/invalidMessage:\s*(.*)/i);

    const searchQuery = searchQueryMatch
      ? searchQueryMatch[1].trim()
      : undefined;
    const introMessage = introMessageMatch
      ? introMessageMatch[1].trim()
      : undefined;
    const greetingMessage = greetingMessageMatch
      ? greetingMessageMatch[1].trim()
      : undefined;
    const invalidMessage = invalidMessageMatch
      ? invalidMessageMatch[1].trim()
      : undefined;

    return { searchQuery, introMessage, greetingMessage, invalidMessage };
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "road trip podcast"; // fallback query
  }
}

module.exports = { generatePodcastSearchQuery, noResultFound };
