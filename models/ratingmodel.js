/**
 * Created by tiaraju on 28/01/15.
 */

var mongoose = require('mongoose');
var User = require('../models/usermodel');

var RatingSchema = new mongoose.Schema(
    {
        comment:{type: String},
        commenter:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
        score: {type: Number, required:true}

    }
);


RatingSchema.methods.getUser = function(cb){
    var rating = this;
    User.find({"profile.ratings":rating._id}, function(err, doc){
        if(err){
            cb(err, null);
        }else{
            cb(null, doc);
        }
    });
};


module.exports = mongoose.model("Rating", RatingSchema);
