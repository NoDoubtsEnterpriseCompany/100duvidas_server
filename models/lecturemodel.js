/**
 * Created by jeymisson on 1/25/15.
 */

var mongoose = require("mongoose");
var User = require("./usermodel");
var Subject = require = ("./subjectmodel");

var LectureModel = new mongoose.Schema({
    date: {type: Date, required: true},
    teacher: {type: mongoose.Schema.Types.Mixed},
    student: {tupe: mongoose.Schema.Types.Mixed},
    price: {type: Number}
});


module.exports = mongoose.model("Lecture",LectureSchema);
