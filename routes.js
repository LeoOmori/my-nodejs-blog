const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const passport = require("passport");
requireDir("./models");


const blog = mongoose.model("blogModel");



///=================================
//// index routing
router.get("/",(req, res) => {
    res.redirect("/page/1");
});

router.get("/page/:page",(req, res) => {
    var perPage = 4;
    var page = req.params.page || 1;

    blog
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, blogs) {
        blog.countDocuments().exec(function(err, count) {
            if (err) return next(err)
            res.render('index', {
                posts : blogs,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    })
});


///=================================
//// admin get routing post
router.get("/adminHome", isLoggedIn,(req, res) =>{
    res.redirect("/adminHome/1")
});

router.get("/adminHome/:page", isLoggedIn, async (req, res) => {
    var perPage = 5;
    var page = req.params.page || 1;
    blog
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, blogs) {
        blog.countDocuments().exec(function(err, count) {
            if (err) return next(err)
            res.render('adminHome', {
                posts : blogs,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
    });
});

router.get("/post", isLoggedIn ,(req, res) => {
    res.render("newPost");
});

router.get("/post/:id", isLoggedIn ,async(req, res) => {
    var blogPost = await blog.findById(req.params.id);
    res.render("postEdit", { blogPost: blogPost});
});


router.get("/blogPost/:id", async(req, res) => {
    var posts = await blog.findById(req.params.id);
    res.render("post", {post : posts});
});

// delete post
router.delete("/post/:id", async(req, res) => {
    await blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/adminHome");  
        }else{
            res.redirect("/adminHome");
        }
        
    });
});
/// update post
router.put("/post/:id", async(req, res) => {
    req.body.postField = req.sanitize(req.body.postField);
    await blog.findByIdAndUpdate( req.params.id,{
        'title': req.body.title,
        'subTitle': req.body.subTitle,
        'body': req.body.postField,
        'tag': req.body.tag
    }, {new: true});
    res.redirect("/adminHome");
});
//// create post
router.post("/post", (req, res) => {
    req.body.postField = req.sanitize(req.body.postField);
    blog.create({
        title: req.body.title,
        subTitle: req.body.subTitle,
        body: req.body.postField,
        tag: req.body.tag
    },(err, blog) => {
        if (err){
            return console.log(err);   
        }else{
            console.log("post Done");
        }
    });
    res.redirect("/post")
});


///=================================
/////// index categories routes

router.get("/cat/:id",(req, res) =>{
    res.redirect("/cat/" + req.params.id + "/1");
});

router.get("/cat/:id/:page", (req, res) => {

    var perPage = 5;
    var page = req.params.page || 1;

    blog
    .find({
        "tag": req.params.id
    })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, blogs) {
        blog.countDocuments({"tag": req.params.id}).exec(function(err, count) {
            if (err) return next(err)
            res.render('cat', {
                posts : blogs,
                current: page,
                pages: Math.ceil(count / perPage),
                id: req.params.id
            })
        })
    })
});

router.get("/sobre", (req, res) => {
    res.render("sobre");
});



//====================
//AUTH ROUTES

router.get("/login", (req, res) =>{
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/adminHome",
    failureRedirect: "/login"
}), (req, res) => {

});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});



/// midleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/404");
}


//404 error handling
router.get("/404", (req, res) =>{
    res.status(404).render("404");
})

router.get("*", (req, res) =>{
    res.redirect("/404");
});





module.exports = router;