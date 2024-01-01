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
// const indexRoutes = require("./routes/index.routes");
const userRoutes = require("./routes/users.routes");
// app.use(indexRoutes);
app.use("/users", userRoutes);
// const welcomeRoutes = require("./routes/index.routes.js");
// app.use(welcomeRoutes);

module.exports = app;
