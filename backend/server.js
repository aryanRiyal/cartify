require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use("public", path.join(__dirname, "public")); // instead of this we use express.static for folders with css files
app.use(express.static(path.join(__dirname, "public")));

// app.set("routes", path.join(__dirname, "routes"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: 'importantsecret',
  resave: false,
  saveUninitialized: true,
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
})

const productsRoutes = require("./routes/productRoutes");
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.get("/", (req, res) => {
  res.render("home");
});

app.get('/error',(req,res)=>{
  res.render('error');
})

app.use(productsRoutes);
app.use(authRoutes);
app.use(cartRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>console.log(`Server Runnning on ${PORT}`));