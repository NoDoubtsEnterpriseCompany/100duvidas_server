var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var Subject = require('../models/subjectmodel.js');
var Lecture = require('../models/lecturemodel');
var ScheduledLecture = require('../models/scheduledlecturemodel');
var User = require('../models/usermodel');
var router = express.Router();

router.get(/\/subjectlectures\/(\w+)$/, function(req, res) {
  var subject_id = req.params[0];
  var result = {};
  var error = {};

  Lecture.find({subject:subject_id}).populate("teacher").exec(function(err, doc) {
    if (err) {
		res.status(404);
        res.contentType('application/json');
        error.code = err.code;
        error.message = err.message;
		res.send(JSON.stringify({"result":result, "error":error}));
	} else {
        res.contentType('application/json');
        res.send(JSON.stringify({"result":doc, "error":error}));
	}
  });
});

router.post("/addlecture", function(req,res) {
    var teacher = req.body.teacher;
    var subject = req.body.subject;
    var address = req.body.address;
    var date = new Date(req.body.date);
    var price = req.body.price;
    var error = {};
    var result = {};

    var lecture = new Lecture({"date":date,
        "teacher": new ObjectId(teacher), "subject": new ObjectId(subject),
        "price": price, "address":address});

    lecture.save(function(err){
        if(err){
            res.contentType('application/json');
            error.code = err.code;
            error.message = err.message;
            res.status(500);
        }else{
            res.contentType('application/json');
            result.uri = "lectures/lecture/" + lecture._id;
            res.status(201);
        }
        res.send(JSON.stringify({"result":result, "error":error}));
    });
});

router.post("/schedulelecture", function(req,res) {
    var student = req.body.student;
    var teacher = req.body.teacher._id;
    var subject = req.body.subject;
    var address = req.body.address;
    var date = new Date(req.body.date);
    var price = req.body.price;
    var error = {};
    var result = {};

    var lecture = new ScheduledLecture({"date":date, "student":new ObjectId(student),
        "teacher": new ObjectId(teacher), "subject": new ObjectId(subject),
        "price": price, "address":address});

    lecture.save(function(err){
        if(err){
            res.contentType('application/json');
            error.code = err.code;
            error.message = err.message;
            res.status(500);
        }else{
            res.contentType('application/json');
            result.uri = "lectures/scheduledlecture/" + lecture._id;
            res.status(201);
        }
        res.send(JSON.stringify({"result":result, "error":error}));
    });
});

router.get('/scheduledlecture', function(req, res) {
   var filters = {};
   var teacherId = req.query.teacher;
   var studentId = req.query.student;
   var error =  {};
   var result = {};

   if (teacherId !== undefined) {
	 filters = {"teacher":teacherId};
   }
   if (studentId !== undefined) {
	 filters = {"student":studentId};	
   }
   ScheduledLecture.find(filters).populate("teacher").exec(function(err, doc){
        if(err){
            res.status(500);
            error.code = err.code;
            error.message = err.message;
        }else{
            result = doc;
        }
       res.contentType('application/json');
        res.send(JSON.stringify({"result":result, "error":error}));
    });
});

module.exports = router;
