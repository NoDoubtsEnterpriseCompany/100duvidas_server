/**
 * Created by tiaraju on 28/01/15.
 */

var mongoose = require('mongoose');

var RatingSchema = new mongoose.Schema(
    {
        score: {type: Number, required:true},
        comment:{type: String},
        commenter:{type: mongoose.Schema.Types.Mixed}

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
