const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/girls_in_ict";
const PORT = process.env.PORT || 3000;
const articleRoute = require("./routes/article.route");
const pagesRoute = require("./routes/smartgirls.route");

//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

//ROUTES
app.use("/article", articleRoute);
app.use(pagesRoute);

app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to Smartgirls in ICT" });
  next;
});

app.use((err, req, res, next) => {
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
