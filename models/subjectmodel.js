/**
 * Created by Lurian on 03/12/2014.
 */
var mongoose = require('mongoose');
var User = require('./usermodel');

var SubjectSchema = new mongoose.Schema(
    {
        name: {type: String, required:true, unique: true}
    }
);

SubjectSchema.index({name: 1}, {unique: true});

SubjectSchema.methods.getUsers = function(cb){
    var subject = this;
    User.find({"profile.subjects":subject._id}, function(err, doc){
        if(err){
            cb(err, null);
        }else{
            cb(null, doc);
        }
    });
};

module.exports = mongoose.model("Subject",SubjectSchema);
