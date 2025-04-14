const axios = require("axios");

const getSpotifyAccessToken = async () => {
  const clientId = "00275fb247c147aa9c9b2f9a1ebc8649";
  const clientSecret = "30d9cfe6fd504799aa8b530d30eef061";

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

module.exports.getResult = async (query) => {
  const token = await getSpotifyAccessToken();

  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: "show",
      limit: 5,
    },
  });

  return response.data.shows.items.map((show) => ({
    name: show.name,
    publisher: show.publisher,
    url: show.external_urls.spotify,
    image: show.images?.[0]?.url || "",
    description: show.description,
  }));
};
