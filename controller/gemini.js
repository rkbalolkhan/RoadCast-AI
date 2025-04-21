require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generatePodcastSearchQuery(userPrompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 50,
      },
    });

    const prompt = `Refine this user input into a concise podcast search query:\n"${userPrompt}"\n\nRespond with only the search query (under 10 words).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "road trip podcast"; // fallback query
  }
}

module.exports = { generatePodcastSearchQuery };
