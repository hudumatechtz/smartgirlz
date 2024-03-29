const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const checkUser = require("./middlewares/check-user");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const articleRoute = require("./routes/article.route");
const trainerRoute = require("./routes/trainer.route");
const coacherRoute = require("./routes/coacher.route");
const galleryRoute = require("./routes/gallery.route");
const pagesRoute = require("./routes/smartgirls.route");
const authroute = require("./routes/auth.route");
const schoolRoute = require("./routes/school.route");
const activityRoute = require("./routes/activity.route");
const phaseRoute = require("./routes/phase.route");
const multer = require("multer");
const cookie = require("cookie-parser");
const blocker = require("./middlewares/blocker");

const Activity = require("./models/activity.model");
const Gallery = require("./models/gallery.model");

const store = new mongoDbStore(
  {
    uri: MONGO_URI,
    collection: "session",
  },
  (err) => {
    if (err) console.log(err);
  }
);
const moment = require("moment");

app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

//app.use(blocker);
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    console.log("hello suce");
    return cb(null, true);
  }
  console.log("hello");
  cb(null, false);
};
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().split(":").join("").split("-").join("") +
        "-" +
        "smartgirlz" +
        Math.floor(1000 + Math.random() * 9000) +
        file.originalname.substring(file.originalname.indexOf("."))
    );
  },
});
//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(cookie());
// app.use(parser.json());

app.use(
  session({
    secret: "girls_in_ict",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(checkUser);
app.use(async(req, res, next) => {
  const activities = await Activity.find().populate("phases").exec();
  const gallery = await Gallery.find();

  res.locals.gallery = gallery;
  res.locals.activities = activities;
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
//ROUTES
app.use(activityRoute);
app.use(phaseRoute);
app.use(trainerRoute);
app.use(coacherRoute);
app.use(galleryRoute);
app.use(schoolRoute);
app.use(articleRoute);
app.use(pagesRoute);
app.use("/account", authroute);
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to Smartgirls in ICT" });
  next;
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err._message ? err._message : err.message;
  if (err != null) {
    res.status(status).json({ message: message });
  }
  console.log(err);
  next();
});

mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.error(error);
    }
    app.listen(PORT, () => {
      console.log(`Application Up and running on PORT: ${PORT}`);
    });
  }
);
