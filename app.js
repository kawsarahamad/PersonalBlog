require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("connect-flash"); // for flash messages, to show the eroor messages to the user
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");

// Passport Strategy
require("./config/passport")(passport);
require("./config/passport-google-oauth")(passport);

// Connect to DB
mongoose
  .connect(process.env.MongoURI)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

//Body Parser // for taking data from the form
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

//Session and Flash
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// //Routes
const userRoutes = require("./routes/users.routes");
app.use("/users", userRoutes);

const blogRoutes = require("./routes/blogs.routes");
app.use("/blogs", blogRoutes);
module.exports = app;
