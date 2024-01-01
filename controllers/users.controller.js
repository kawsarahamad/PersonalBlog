const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const mailer = require("../config/mailer.js");
require("dotenv").config();


const getLogin = (req, res) => {
    res.render("users/login.ejs", { error: req.flash("error") });
  };

  const postLogin = (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next); 
}



  const getRegister = (req, res) => {
    res.render("users/register.ejs", { errors: req.flash("errors") });
  };
  
  const postRegister = (req, res) => {
    const { name, email, password, confirm_password } = req.body;
  
    //Data Validation
    const errors = [];
    if (!name || !email || !password || !confirm_password) {
      errors.push("All fields are required!");
    }
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters!");
    }
    if (password !== confirm_password) {
      errors.push("Passwords do not match!");
    }
  
    if (errors.length > 0) {
      req.flash("errors", errors);
      res.redirect("/users/register");
    } else {
      //Create New User
      User.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push("User already exists with this email!");
          req.flash("errors", errors);
          res.redirect("/users/register");
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              errors.push(err);
              req.flash("errors", errors);
              res.redirect("/users/register");
            } else {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                  errors.push(err);
                  req.flash("errors", errors);
                  res.redirect("/users/register");
                } else {
                  const newUser = new User({
                    name,
                    email,
                    password: hash,
                  });
                  newUser
                    .save()
                    .then(() => {
                      res.redirect("/users/login");
                    })
                    .catch(() => {
                      errors.push("Saving User to the daatabase failed!");
                      req.flash("errors", errors);
                      res.redirect("/users/register");
                    });
                }
              });
            }
          });
        }
      });
    }
  };
  
// Dashboard
 const getDashboard = (req, res) => {
    res.render("../views/dashboard.ejs", { user: req.user });
 }

const getforgotPassword = (req, res) => {
  res.render("users/forgot-password.ejs", { error: req.flash("error") });
}

const postforgotPassword = async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) {
      req.flash("error", "Please enter your email");
      res.redirect("/users/forgot-password");
    }
    const user = await User.findOne({email});
    if (!user) {
      req.flash("error", "Email not registered");
      res.redirect("/users/forgot-password");
    }

    const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: "5m"});

    const link = `http://localhost:7777/users/reset-password/${token}`;
    const html = `<p>Click <a href="${link}">here</a> to reset your password</p>`;
    const text = `Click here to reset your password: ${link}`;
    
    await mailer.sendMail({
      from: "noreply@gmail.com",
      to: email,
      subject: "Password reset",
      html,
      text
    });

    res.json({message: "Password reset email sent successfully"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  } 
}

const getResetPassword = (req, res) => {
  const {token} = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.render("users/reset-password.ejs", {error: req.flash("error"), email: decoded.email, token: token});
  } catch (err) {
    req.flash("error", "Invalid or expired link");
    res.redirect("/users/forgot-password");
  }
}

const postResetPassword = async (req, res) => {
   
  const {token} = req.params;
  console.log(token);

  try {
    
    const {email, password, confirm_password} = req.body;
    if (!email || !password || !confirm_password) {
      req.flash("error", "All fields are required");
      res.redirect(`/users/reset-password/${token}`);
    }
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters");
      res.redirect(`/users/reset-password/${token}`);
    }
    if (password !== confirm_password) {
      req.flash("error", "Passwords do not match");
      res.redirect(`/users/reset-password/${token}`);
    }
    const user = await User.findOne({email});
    if (!user) {
      req.flash("error", "Email not registered");
      res.redirect(`/users/reset-password/${token}`);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.updateOne({email}, {password: hash});
    req.flash("success", "Password updated successfully");
    res.redirect("/users/login");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  } 

}

  module.exports = {
    getLogin,
    getRegister,
    postLogin,
    postRegister,
    getDashboard,
    getforgotPassword,
    postforgotPassword,
    getResetPassword,
    postResetPassword,
  };