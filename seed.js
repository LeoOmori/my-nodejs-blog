
var user = require("./models/userModels");
const passport = require("passport");
const mongoose = require('mongoose');

require('dotenv').config()

///conect to Db
mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true});
const localStrategy = require("passport-local");
/// first admin
function seed(){
    var newUser = new user({username:"admin"})
    user.register(newUser, process.env.PASS , (err, user) => {
        if(err){
            console.log(err);
        }else{
            console.log("admin created");
            process.exit(0);
        }
    } );
}

seed();

