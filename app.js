if(process.env.NODE_ENV!=='production'){
  require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const listingRouter = require('./routes/listing.js');  
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const dbURL = process.env.ATLASDB_URL;

main().then(() => {
  console.log("Connected to MongoDB" + mongoose.connection.name);
}).catch(err => {
  console.log("Error connecting to MongoDB", err);
});

async function main() {
  const connect = await mongoose.connect(dbURL);
  return connect;
}


// const store = MongoStore.create({
//   mongoUrl: process.env.MONGO_URL, // Atlas URL
//   crypto: {
//     secret: "mysupersecretcode"
//   },
//   touchAfter: 24 * 3600
// });

app.use(
  session({
    // store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    }
  })
);
// app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success") || [];
  res.locals.error = req.flash("error") || [];
  res.locals.currUser = req.user;
  next();
});

// routers
app.use('/', userRouter);
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);

// generic error handler 
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "internal error"} = err;
  res.status(statusCode).render('error.ejs', {statusCode, message});
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});