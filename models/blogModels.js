var mongoose=require('mongoose');

//schema
var blogSchema =mongoose.Schema({
    title: String,
    subTitle: String,
    body: String,
    tag: String,
    date: { type: Date, default: Date.now },
});

// export model
module.exports = mongoose.model('blogModel',blogSchema);
