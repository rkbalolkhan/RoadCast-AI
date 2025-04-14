const axios = require("axios");
const { response } = require("express");

module.exports.getResult = async (query) => {

  const API_KEY = process.env.YOUTUBE_API_KEY; // Make sure to set this in your environment variables
  const API_URL = `https://www.googleapis.com/youtube/v3/search`;
  let results=[];

  try {
    const response = await axios.get(API_URL, {
        headers: {
            "Content-Type": "application/json",
            },
        params: {
            q: query,
            type: "video",
            key: API_KEY,
            videoDuration: "long",
            part: "snippet",
            maxResults: 5,
            order: "relevance",
            safeSearch: "strict",
        },
    });

    const data = response.data;
    results = data.items.map((item) => ({
      title: item.snippet.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
      description: item.snippet.description, // Add video description
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    return results;
  }
};
