/**
 * Created by Lurian on 01/03/2015.
 */
var mongoose = require('mongoose');
var User = require('./usermodel');

var RecommendationSchema = new mongoose.Schema(
    {
        description: {type: String},
        teacherUsername: {type: String},
        teacher:{type:mongoose.Schema.Types.ObjectId, ref:"User"}
    }
);


RecommendationSchema.methods.getUser = function(cb){
    var recommendation = this;
    User.find({"profile.recommendations":recommendation._id}, function(err, doc){
        if(err){
            cb(err, null);
        }else{
            cb(null, doc);
        }
    });
};


module.exports = mongoose.model("Recommendation", RecommendationSchema);
