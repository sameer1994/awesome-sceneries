var express = require("express");
var bodyparser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var passport= require("passport");
var LocalStrategy = require("passport-local");
var User= require("./models/user");
var methodOverride = require("method-override");
var commentRoutes=require("./routes/comments");
var indexRoutes=require("./routes/mountains");
var authRoutes=require("./routes/auth");

//mongoose.connect("mongodb://localhost/mountains");
mongoose.connect("mongodb://sameer:sameer@ds121543.mlab.com:21543/sceneries")
var sceneryModel = require("./models/mountains");
var seedDB = require("./seeds");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(require("express-session")({
    secret:"afasasfaf",
    resave:false,
    saveUninitialized:false
}));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(authRoutes)
app.listen(process.env.PORT,process.env.IP);