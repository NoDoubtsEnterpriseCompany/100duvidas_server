/**
 * Created by jeymisson on 1/25/15.
 */

var mongoose = require("mongoose");
var User = require("./usermodel");

var LectureSchema = new mongoose.Schema({
    date: {type: Date},
    subject: {type:mongoose.Schema.Types.ObjectId, ref:"Subject"},
    teacher: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    students: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    price: {type: Number}
});

LectureSchema.index({subject: 1, teacher: 1}, {unique: true});

module.exports = mongoose.model("Lecture",LectureSchema);
