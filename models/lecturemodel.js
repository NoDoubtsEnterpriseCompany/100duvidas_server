/**
 * Created by jeymisson on 1/25/15.
 */

var mongoose = require("mongoose");
var User = require("./usermodel");
var Subject = require = ("./subjectmodel");

var LectureSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    subject: {type:mongoose.Schema.Types.Mixed},
    teacher: {type: mongoose.Schema.Types.Mixed},
    student: {tupe: mongoose.Schema.Types.Mixed},
    price: {type: Number}
});

LectureSchema.methods.getTeachers = function(cb,data){
  var lecture = this;
    User.find({"_id":lecture.teacher}, function(err,data){
        if(err){
            cb(err,null);
        }else{
            cb(null,data);
        }
    });
};

LectureSchema.methods.getStudents = function(cb,data){
    var lecture = this;
    User.find({"_id":lecture.student}, function(err,data){
        if(err){
            cb(err,null);
        }else{
            cb(null,data);
        }
    });
};

module.exports = mongoose.model("Lecture",LectureSchema);
