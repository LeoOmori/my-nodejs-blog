const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/userModels");


require('dotenv').config()


///conect to Db
//db env
mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true});


///create app
const app = express();



// require routes
const routes = require('./routes');

// midleswares
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static('public'));



///pasport config
app.use(require("express-session")({
    secret: "salve carai",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


///// use routes
app.use('/', routes);




app.listen("3000",() => {
    console.log("server on");
})

