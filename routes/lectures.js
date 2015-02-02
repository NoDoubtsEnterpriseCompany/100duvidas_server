var express = require('express');
var Subject = require('../models/subjectmodel.js');
var Lecture = require('../models/lecturemodel');
var router = express.Router();

router.get(/\/subjectlectures\/(\w+)$/, function(req, res) {
  var subject_id = req.params[0];
    console.log(subject_id);
  var result = {};
  var error = {};

  Lecture.find({subject:subject_id}).populate("teacher").exec(function(err, doc) {
    if (err) {
		res.status(404);
        error.code = err.code;
        error.message = err.message;
        console.log(error);
		res.send(JSON.stringify({"result":result, "error":error}));
	} else {
        console.log(doc);
        res.send(JSON.stringify({"result":doc, "error":error}));
	}
  });
});

module.exports = router;
