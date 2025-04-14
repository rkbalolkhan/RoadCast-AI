require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBvPjb_D-6exqhnXk8GN15er92_bJuGDIU");

async function generatePodcastSearchData(userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a helpful assistant that extracts podcast search queries and response text from user input.

Given a user's message about podcast preferences for a road trip:
1. Generate a YouTube search query
2. Generate a Spotify search query
3. Write a short, friendly message to show the user before displaying podcast results

Only provide the following format:

YouTube Query: <query>
Spotify Query: <query>
Message: <short friendly message>

Input: "${userInput}"
Output:
`;

  const result = await model.generateContent(prompt);
  const output = result.response.text();

  // Optional: Parse the output into an object
  const [youtubeLine, spotifyLine, messageLine] = output
    .split("\n")
    .filter(Boolean);
  const youtubeQuery = youtubeLine?.replace("YouTube Query:", "").trim();
  const spotifyQuery = spotifyLine?.replace("Spotify Query:", "").trim();
  const message = messageLine?.replace("Message:", "").trim();

  return {
    youtubeQuery,
    spotifyQuery,
    message,
  };
}

module.exports = { generatePodcastSearchData };