const User=require("../models/User.js")

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

module.exports.getIndex=(req,res)=>{
    res.render('index.ejs',{results});
}

module.exports.getResult=async(req, res) => {
    console.log(req);
    const query = req.query.query;
    if (!query) return res.render("index", { results: [] });

    const API_KEY = "AIzaSyDwLkd7J-TCcZvxCgYE-FLFpeVxuIh0q-Y";
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const results = data.items.map(item => ({
            title: item.snippet.title,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail: item.snippet.thumbnails.default.url,
            description: item.snippet.description // Add video description
        }));
        res.send( results);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render({results: []} );
    }
};

// Registration route
module.exports.registerUser=async(req, res) => {
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
};

// Login route
module.exports.loginUser=(req, res, next) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
},



module.exports.logoutUser=(req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect("/");
    });
}

module.exports.getAbout=(req, res) => {
    res.render("about");
}

module.exports.getContacts=(req, res) => {
    res.render("contact");
}