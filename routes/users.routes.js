const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureAuthenticated = require("./../middlewares/auth.middleware");
require("../config/passport-google-oauth.js")(passport);

const {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getDashboard,
  getforgotPassword,
  postforgotPassword,
  getResetPassword,
  postResetPassword,
} = require("./../controllers/users.controller");

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/register", getRegister);
router.post("/register", postRegister);
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.get("/dashboard", ensureAuthenticated, getDashboard);
router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/auth/google"}), (req, res) => {
  res.redirect("/users/dashboard");
}
);

router.get("/forgot-password", getforgotPassword);
router.post("/forgot-password", postforgotPassword);
router.get("/reset-password/:token", getResetPassword);
router.post("/reset-password/:token", postResetPassword);

module.exports = router;