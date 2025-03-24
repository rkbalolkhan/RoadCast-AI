require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");



const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
    res.render("index", { results: [] });
});

app.post("/search", async (req, res) => {
    const query = req.body.query;
    if (!query) return res.render("index", { results: [] });

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("data: ",data.items[0].snippent);

        const results = data.items.map(item => ({
            title: item.snippet.title,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));

        res.render("index", { results });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render("index", { results: [] });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
