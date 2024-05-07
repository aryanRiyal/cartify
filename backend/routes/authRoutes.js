const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


// router.get('/fakeuser',async(req,res)=>{
//   const user = new User({
//     username:'example',
//     email:'example@gmail.com'
//   });
//   const newUser = await User.register(user,'example123');
//   res.send(newUser);
// })

router.get('/register',(req,res)=>{
  res.render('auth/signup');
})

router.post('/register',async (req,res)=>{
  try{
  const {username,email,password} = req.body;

  const user = new User({
    username:username,
    email:email
  });

  await User.register(user,password);

  req.flash('success',`Welcome ${username}, Please Login to continue!`);
  res.redirect('/products');
  // res.send("POST REQ");
}
catch(e) {
  req.flash('error',e.message);
  res.redirect('/register');
}
});

// get the login page
router.get('/login',(req,res)=>{
  res.render('auth/login');
});

router.post('/login',
passport.authenticate('local', {
  // successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true}),
  (req,res)=>{
    const {username} = req.user;
    req.flash('success',`Login Successful, Welcome Back ${username}!`);
    res.redirect('/products');
  });

  router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logged Out Successfully!!');
    res.redirect('/login');
  })

module.exports = router;