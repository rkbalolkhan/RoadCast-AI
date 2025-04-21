const axios = require("axios");

const getSpotifyAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

/**
 * Extracts the Spotify ID from a given Spotify URL
 */
function extractSpotifyId(url) {
  const regex = /spotify\.com\/(show|episode)\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? { type: match[1], id: match[2] } : null;
}

/**
 * Get Spotify Show or Episode details from URL
 */
module.exports.getResultFromUrl = async (url) => {
  const idInfo = extractSpotifyId(url);
  if (!idInfo) throw new Error("Invalid Spotify URL");

  const token = await getSpotifyAccessToken();
  const { type, id } = idInfo;

  const response = await axios.get(
    `https://api.spotify.com/v1/${type}s/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = response.data;

  return {
    type,
    name: data.name,
    publisher: data.publisher || data.show?.publisher,
    url: data.external_urls.spotify,
    image: data.images?.[0]?.url || data.show?.images?.[0]?.url || "",
    description: data.description,
  };
};
