const axios = require("axios");
const { response } = require("express");

function extractVideoId(url) {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

module.exports.getResult = async (link) => {
  const videoId = extractVideoId(link);
  if (!videoId) {
    throw new Error("Invalid YouTube video URL.");
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const items = response.data.items;

    if (items.length === 0) {
      throw new Error("Video not found or inaccessible.");
    }

    const { title, description, thumbnails } = items[0].snippet;

    return {
      title,
      description,
      thumbnail: thumbnails.high?.url || thumbnails.default.url,
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  } catch (error) {
    console.error("Failed to fetch video details:", error.message);
    throw error;
  }
};
