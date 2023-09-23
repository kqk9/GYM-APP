const express = require("express");
const passport = require("passport");
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
   const newUser = {
    googleId :profile.id,
    displayName : profile.displayName,
    firstName : profile.name.givenName,
    lastName : profile.name.familyName,
    profileImage : profile.photos[0].value,
   }
   try {
    let user = await User.findOne({googleId: profile.id});
    if (user) {
        done(null , user);
    }else{
        user=await User.create(newUser);
        done(null , user);
    }
   } catch (error) {
    console.log(error);
   }
  }
));

//Google Login Route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login-failure',
    successRedirect:'/dashboard'

}),
);

router.get("/login-failure" , (req , res)=>{
    res.send("Something went wrong.... ")
});
//Destroy user session (logout)
router.get("/logout" , (req, res)=>{
    req.session.destroy(err=>{
        if(err){
            console.log(err);
            res.send("Error loggin out");
        }else{
            res.redirect("/");
        }
    })
})

//Presist user data after successful authentication 
passport.serializeUser((user , done)=>{
    done(null , user);
});

//retrieve user data from session.

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

module.exports = router;
