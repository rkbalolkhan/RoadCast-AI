require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { registerValidation, loginValidation } = require("./schema.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

// Session configuration
app.use(
    session({
        secret: "yourSecretKey", // Replace with a secure secret
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

let results = [
  {
    title: "AL QUDS DAY | JUMMA TUL WIDA | MUFTI SALMAN AZHARI",
    link: "https://www.youtube.com/watch?v=4tXDPQjmcTI",
    thumbnail: "https://i.ytimg.com/vi/4tXDPQjmcTI/default.jpg",
    description:
      "Assalamu Alaikum You all know that this official Channel is specially made for delivering Islamic lectures of renowned Islamic ...",
  },
  {
    title: "SHAB E QADR | RAMADAN 2025 | MUFTI SALMAN AZHARI",
    link: "https://www.youtube.com/watch?v=iZOws3h-1JA",
    thumbnail: "https://i.ytimg.com/vi/iZOws3h-1JA/default.jpg",
    description:
      "Assalamu Alaikum You all know that this official Channel is specially made for delivering Islamic lectures of renowned Islamic ...",
  },
  {
    title:
      "उठो ए जवानों छोड़ दो इन तमाम अय्याशियों को Mufti Salman Azhari Sahab Bayan",
    link: "https://www.youtube.com/watch?v=_yB9uIlXYos",
    thumbnail: "https://i.ytimg.com/vi/_yB9uIlXYos/default.jpg",
    description: "",
  },
  {
    title:
      "Mufti Salman Azhari | Quran Ki Dunya | Episode 07 | Quran Pak Ke Mazameen Aur Us Ka Challenge",
    link: "https://www.youtube.com/watch?v=IB5h7ozZF3Q",
    thumbnail: "https://i.ytimg.com/vi/IB5h7ozZF3Q/default.jpg",
    description:
      "Mufti Salman Azhari | Quran Ki Dunya | Episode 07 | Quran Pak Ke Mazameen Aur Us Ka Challenge. Do not forget to subscribe ...",
  },
  {
    title:
      "MEHFIL E ZIKR WA LAYLATUL QADR | 23RD RAMADAN LIVE | MUFTI SALMAN AZHARI",
    link: "https://www.youtube.com/watch?v=bQBQia6dUpI",
    thumbnail: "https://i.ytimg.com/vi/bQBQia6dUpI/default.jpg",
    description:
      "Assalamu Alaikum You all know that this official Channel is specially made for delivering Islamic lectures of renowned Islamic ...",
  },
];

app.get("/", (req, res) => {
    res.render("index", { results });
});

app.get("/search", async (req, res) => {
    console.log(req);
    const query = req.query.query;
    if (!query) return res.render("index", { results: [] });

    const API_KEY = "AIzaSyDwLkd7J-TCcZvxCgYE-FLFpeVxuIh0q-Y";
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("data: ",data.items[0]);

        const results = data.items.map(item => ({
            title: item.snippet.title,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail: item.snippet.thumbnails.default.url,
            description: item.snippet.description // Add video description
        }));

        console.log(results);

        res.render("index", { results });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render("index", { results: [] });
    }
});

// Registration route
app.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { firstName, lastName, username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send("Email already exists.");

        const newUser = new User({ firstName, lastName, username, email, password });
        await newUser.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user");
    }
});

// Login route
app.post(
    "/login",
    (req, res, next) => {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    },
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

// Logout route
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect("/");
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
