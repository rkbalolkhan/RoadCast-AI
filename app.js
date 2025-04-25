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
const { registerValidation, loginValidation } = require("./validation.js");
const flash = require("connect-flash");

const indexRoute=require("./routes/index.js")
const apiRoute=require("./routes/api.js")

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

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json()); // Parses JSON data
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

app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.currUser = req.user;
  next();
});

// Passport Local Strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: "Incorrect username." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Incorrect password." });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.use("/api", apiRoute);
app.use("/", indexRoute);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
