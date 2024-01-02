const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("./../models/User.model");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "Incorrect Email or Password!",
            });
          } else {
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect Email or Password!" });
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
    console.log(user)
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });


};