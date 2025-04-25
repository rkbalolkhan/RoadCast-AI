require("dotenv").config();
const { Client } = require("podcast-api");

const client = Client({ apiKey: process.env.LISTEN_NOTES_API_KEY });

function removeHTMLTags(text) {
  if(text === null || text === undefined) {
    return ""; // Return an empty string if the input is null or undefined
  }
  return text.replace(/<[^>]*>?/gm, "").trim();
}



async function getTrendingSearchs(){
    try {
      const response = await client.fetchTrendingSearches;
      
      const podcasts = response.data.results.map((podcast) => ({
        title: removeHTMLTags(podcast.title_original),
        description: removeHTMLTags(podcast.description_original),
        thumbnail: removeHTMLTags(podcast.thumbnail),
        link: removeHTMLTags(podcast.listennotes_url),
      }));
      return podcasts;
    } catch (err) {
      console.log(err);
      console.error("ListenNotes API Error:", err.message);
      return [];
    }
}


async function searchPodcasts(query) {
  try {
    const response = await client.search({
      q: query,
      type: "podcast", // only search podcasts, not episodes
    });
    console.log(response.data.results)
    const podcasts = response.data.results.map((podcast) => ({
      title: removeHTMLTags(podcast.title_original),
      description: removeHTMLTags(podcast.description_original),
      thumbnail: removeHTMLTags(podcast.thumbnail),
      link: removeHTMLTags(podcast.listennotes_url),
      audio: removeHTMLTags(podcast.audio),
    }));

    return podcasts;
  } catch (err) {
    console.log(err)
    console.error("ListenNotes API Error:", err.message);
    return [];
  }
}

module.exports = { searchPodcasts };
