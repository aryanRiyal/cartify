require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const seedDB = require("./seed");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

connectDB();




const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>console.log(`Server Runnning on ${PORT}`));