const Parser = require("rss-parser");
const parser = new Parser();

const RSS_FEED_URL = "https://rss.art19.com/apology-line"; // Replace with any podcast RSS feed

async function fetchPodcasts() {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    console.log(feed)

    console.log(`🎙️ Podcast Title: ${feed.title}`);
    console.log(`📝 Description: ${feed.description}`);
    console.log(`🔗 Website: ${feed.link}`);
    console.log("\n📢 Episodes:\n");

    feed.items.forEach((item, index) => {
      console.log(`Episode ${index + 1}:`);
      console.log(`➡️ Title: ${item.title}`);
      console.log(`📅 Published: ${item.pubDate}`);
      console.log(`🔗 Link: ${item.link}`);
      console.log(
        `📝 Summary: ${
          item.contentSnippet || item.content?.substring(0, 150)
        }\n`
      );
    });
  } catch (err) {
    console.error("❌ Error fetching RSS feed:", err.message);
  }
}

module.exports = {
  fetchPodcasts,
};
