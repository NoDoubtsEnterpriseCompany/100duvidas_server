var express = require('express');
var User = require('../models/usermodel');
var Group = require('../models/grouplecturemodel');
var ErrorCodes = require('../exceptions/errorcodes');
var router = express.Router();

router.get('/', function(req, res) {
   var filters = {};
   var groupName = req.query.name;
   var groupProfessorUserName = req.query.professor;
   var error =  {};
   var result = {};
   if (groupName !== undefined) {
	 filters.name = groupName;
   }
   if (groupProfessorUserName !== undefined) {
	 filters.professor.username = groupProfessorUserName;
   }
   Group.find(filters, function(err, doc){
            if(err){
                res.status(500);
                error.code = err.code;
                error.message = err.message;
            }else{
                result = doc;
                res.contentType('application/json');
                res.send(JSON.stringify({"result":result, "error":error}));
            }
        });
});

router.put(/\/grouplecture\/(\w+)\/addUser$/, function(req, res) {
  var groupId = req.params[0];
  var putData = req.body;
  var user = new User(putData);
  var result = {};
  var error = {};
  User.findOne({username:user.username}, function(err, user) {
    if (err) {
		res.status(404);
        error.code = err.code;
        error.message = err.message;
		res.send(JSON.stringify({"result":result, "error":error}));
	} else {
		console.log(user);
		user.profile.groupLecturesRegistered.push(groupId);
		User.update({username:user.username}, user, {}, function(err2, data) {
			if(err2) {
				res.status(404);
				error.code = err2.code;
				error.message = err2.message;
				res.send(JSON.stringify({"result":result, "error":error}));
			} else {
				console.log("update user");
				Group.findOne({_id:groupId}).exec(function(err3, group){
					if (err3) {
						res.status(404);
						error.code = err3.code;
						error.message = err3.message;
						res.send(JSON.stringify({"result":result, "error":error}));
					} else {
						console.log("find group")
						group.studentsRegistered.push(user._id);
						Group.update({_id: group._id}, group, {}, function(err4, up) {
							if (err4) {
								res.status(404);
								error.code = err4.code;
								error.message = err4.message;
							} else {
								console.log("update user");
								result = up;
							}
							res.send(JSON.stringify({"result":result, "error":error}));
						});
					}
				});
			}
		});
	}
  });
});

router.get(/\/grouplecture\/(\w+)$/, function(req, res) {
   var id = req.params[0];
   var error =  {};
   var result = {};
   Group.findOne({_id:id}).populate("studentsRegistered").exec(function(err, doc){
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
    }else{
        if(doc)
          result = doc;
        else{
          res.status(409);
          error.code = ErrorCodes.Group.NotFound;
          error.message = "Group not found";
        }
    }
    res.send(JSON.stringify({"result":result, "error":error}));
  });
});

router.put(/\/grouplecture\/(\w+)$/, function(req, res) {
  var putData = req.body;
  var group = new Group(req.body);
  var result = {};
  var error = {};
  Group.update({ professorUserName: putData.professorUserName, name: putData.name}, group, {}, function (err, doc){
    if (err) {
      error.code = err.code;
      error.message = err.message;
      error.code == 11000 ? res.status(409) : res.status(500);
    }else {
      res.status(200); 
      result.uri = "/groups/group/" + group.name;
    }
    res.send(JSON.stringify({"result": result, "error": error}));
  });
});

router.post('/addGroupLecture', function(req, res) {
  var group = new Group(req.body);
  var error= {};
  var result = {};
  User.findOne({username:group.professor.username}, function(err, doc){
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
    }else{
        if(doc) {
		  group.professor.name = doc.profile.name;	
          group.save(function(err) {
		    if (err) {
              error.code = err.code;
              error.message = err.message;
              //11000: MongoError's duplicated key
              error.code == 11000 ? res.status(409) : res.status(500);
            }else {
              res.status(201); //HTTP created code
              result.uri = "/groups/group/" + group.name;
            }
          res.send(JSON.stringify({"result": result, "error": error}));
          });
		}
        else{
          res.status(404);
          error.code = ErrorCodes.User.NotFound;
          error.message = "User not found";
        }
    }
  });
});

module.exports = router;
