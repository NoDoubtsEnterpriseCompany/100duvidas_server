var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../models/usermodel');
var Subject = require("../models/subjectmodel");
var Lecture = require("../models/lecturemodel");
var Rating = require("../models/ratingmodel");
var ErrorCodes = require('../exceptions/errorcodes');
var router = express.Router();

//Adds a user given a JSON object with data passed through POST request
router.post('/adduser', function(req, res){
  var user = new User(req.body);
  var error= {};
  var result = {};

  user.save(function(err) {
    if (err) {
      error.code = err.code;
      error.message = err.message;
      //11000: MongoError's duplicated key
      error.code == 11000 ? res.status(409) : res.status(500);
    }else {
      res.status(201); //HTTP created code
      result.uri = "/users/user/" + user.username;
    }
    res.send(JSON.stringify({"result": result, "error": error}));
  });
});

//Retrieves a user given a username through GET request
router.get(/\/user\/(\w+)$/, function(req, res){
  var username = req.params[0];
  var error = {};
  var result = {};

  User.findOne({username:username}, function(err, doc){
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
    }else{
        if(doc)
          result = doc;
        else{
          res.status(409);
          error.code = ErrorCodes.User.NotFound;
          error.message = "User not found";
        }
    }
    res.send(JSON.stringify({"result":result, "error":error}));
  });
});

//Retrieves a user given a email through GET request
router.get(/\/user/, function(req, res){
  var email = req.query.email;
  var error = {};
  var result = {};

  User.findOne({email:email}, function(err, doc){
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
    }else{
        if(doc) {
            result = doc;
        }
        else{
          res.status(409);
          error.code = ErrorCodes.User.NotFound;
          error.message = "User not found";
        }
    }
    res.send(JSON.stringify({"result":result, "error":error}));
  });
});

/**
 *Recursively loops through a current data JS Object updating it's
 * values with newData's JS Object values
 * @param newData object with new data
 * @param data object with that will be updated
 */
function recursivelyUpdatesData(newData, data){
  for(var attributeName in data){
    if(newData[attributeName] instanceof Object){
      recursivelyUpdatesData(newData[attributeName], data[attributeName]);
    }else{
      if(newData[attributeName])
        data[attributeName] = newData[attributeName];
    }
  }
}

/**
 * Updates user's data
 * @param res http response object
 * @param newData object with new data
 * @param doc object with current data to be updated
 */
function updateUserData(res, newData, doc) {
  var error = {};
  var result = {};

  //Fills user's data with new data passed
  recursivelyUpdatesData(newData, doc);

  doc.checkChanges(function(err){
    if(!err) {
      doc.save(function (err) {
        if (err) {
          res.status(500);
          error.code = err.code;
          error.message = err.message;
        } else {
          result.uri = "/users/user/" + doc.username;
        }
      });
    }else{
      res.status(409);
      error.code = ErrorCodes.User.UnableToChange;
      error.message = err.message;
    }
    res.send({"result": result, "error": error});
  });
}

/**
 * Adds a given subject to a user
 */
router.post("/addsubject", function(req, res){
  var username = req.body.username;
  var subject = new ObjectId(req.body.subject_id);
  var error = {};
  var result = {};

      User.findOne({"username":username}, function(err, doc){
        if(err){
          res.status(500);
          error.code = err.code;
          error.message = err.message;
          res.send(JSON.stringify({"result":result, "error":error}));
        }else {
            doc.profile.subjects.push(subject);
            doc.update({profile: doc.profile}, function (err) {
                if (err) {
                    res.status(500);
                    error.code = err.code;
                    error.message = err.message;
                    res.send(JSON.strigify({"result":result, "error": error}));
                }
                else {
                    var lecture = new Lecture({
                        "price":req.body.price,
                        "teacher": doc._id,
                        "subject": subject,
                        "address":req.body.address});

                    lecture.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                        res.status(201);
                        result.uri = "/users/user/" + username;
                        res.send(JSON.stringify({"result": result, "error": error}));
                    });
                }
            });
        }
      });
  });

//do login based on username and password given by the user
router.post("/login", function(req,res){
  var username = req.body.login;
  var password = req.body.password;
  var result = {};
  var error = {};

  User.findOne({username:username},function(err,doc){

    if(doc) {
      doc.comparePassword(password,function(err,match){
        if(match){
          res.status(200);
          result.code=200;
          res.send(JSON.stringify({"result":result, "error":error}));
        }else if (err){
          error.code=err.code;
          error.message = err.message;
          res.send(JSON.stringify({"result":result, "error":error}));
        }else{
          error.code = ErrorCodes.User.PasswordDontMatch;
          error.message = "Password doesn't match";
          res.status(401);
          return res.send(JSON.stringify({"result": result, "error": error}));
        }
      });

      }else{
      res.status(404);
      error.code = ErrorCodes.User.NotFound;
      error.message = "User not found";
      res.send(JSON.stringify({"result": result, "error": error}));
    }

  });

});

//Updates users data given a username and a JSON object passed through PUT request
router.put(/\/updateuser\/(\w+)$/, function(req, res){
  var username = req.params[0];
  var result = {};
  var error = {};
  var putData = req.body;

  //Searches user to update data
  User.findOne({username:username}, function(err, doc) {
    if(doc) {
      var newData = putData.user;

      //Check for password's change to match old password
      if(newData.password) {
        doc.comparePassword(putData.oldpassword, function(err, match){
          if(!match) {
            error.code = ErrorCodes.User.PasswordDontMatch;
            error.message = "Passwords don't match";
            res.status(409);
            return res.send({"result": result, "error": error});
          }
          updateUserData(res, newData, doc);

        });
      }else
        updateUserData(res, newData, doc);

    }else{
      res.status(404);
      error.code = ErrorCodes.User.NotFound;
      error.message = "User not found";
      res.send({"result": result, "error": error});
    }
  });
});

router.get("/", function(req, res){
  var subject = req.query.subject;
  var error = {};
  var result = {};

  if (subject!==undefined) {
	Subject.findOne({"name":subject}, function(err, doc){
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
      res.send(JSON.stringify({"result":result, "error":error}));
    }else{
      if(doc) {
        console.log(doc);
        doc.getUsers(function (err, data) {
          if (err) {
            res.status(500);
            error.code = err.code;
            error.message = err.message;
          } else {
            console.log(data);
            result = data;
          }
          res.send(JSON.stringify({"result":result, "error":error}));
        });
      }
    }
  });
  }
  else {
  User.find( function(err, doc){
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
    }else{
      result = doc;
    }
    res.send(JSON.stringify({"result":result, "error":error}));
  });
  }
});



router.post(/\/addrating\/(\w+)$/, function(req, res){
    //console.log(req);
    var teacherusername = req.params[0];
    var student = req.body.student;
    var rating = new Rating(JSON.parse(req.body.rating));
    rating.save(function(err){
        if(err){
            error.code = err.code;
            error.message = err.message;
            console.log("Erro salvar rating:" + err);
            res.status(500);
        }else{
            //result.uri= "";
            res.status(201);
            console.log("salvou");
        }
        res.send(JSON.stringify({"result":result, "error":error}));

    });
    var error = {};
    var result = {};
    User.findOne({"username":teacherusername},function(err,doc){
        if(err){
            res.status(500);
            error.code = err.code;
            error.message = err.message;
            res.send(JSON.stringify({"result":result, "error":error}));
        }else if(doc){
            doc.profile.ratings.push(rating._id);
            doc.profile.totalScore+=rating.score;
            doc.profile.mean = doc.profile.totalScore / doc.profile.ratings.length;

            doc.update({profile: doc.profile   },function(err){
                if(err)
                    res.status(500);
                else{
                    res.status(201);
                    result.uri="users/user/"+ teacherusername       ;
                }
            });
        }else{
            res.status(404);
            error.code = ErrorCodes.User.NotFound;
            error.message = "User not found";
            res.send(JSON.stringify({"result":result, "error":error}));
        }
    });
});


router.get(/\/rating\/(\w+)$/, function(req, res){
    var error =  {};
    var result = {};
    var id = req.params[0];
    Rating.findOne({_id:id}, function(err, doc){
        if(err) {
            res.status(500);
            error.code = err.code;
            error.message = err.message;
        }else{
            if(doc) {
                result = doc;
            }
            else{
                res.status(409);
                error.code = ErrorCodes.Rating.NotFound;
                error.message = "Rating not found";
            }
        }
        res.send(JSON.stringify({"result":result, "error":error}));
    });

});

module.exports = router;
