/**
 * Created by jeymisson on 1/25/15.
 */

var mongoose = require("mongoose");

var ScheduledLectureSchema = new mongoose.Schema({
    date: {type: Date},
    subject: {type:mongoose.Schema.Types.ObjectId, ref:"Subject"},
    teacher: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    student: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    price: {type: Number},
    address: {type: String}

});

module.exports = mongoose.model("ScheduledLecture",ScheduledLectureSchema);
