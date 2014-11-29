var express = require('express');
var User = require('../models/usermodel');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//adds a user
router.post('/adduser', function(req, res, next){
  var user = new User(req.body);

  user.save(function(err) {
    var error= {};
    var result;

    if (err) {
      error.code = err.code;
      error.message = err.message;
      //11000: MongoError's duplicated key
      error.code == 11000 ? res.status(409) : res.status(500);
    }else {
      res.status(201); //HTTP created code
      result = "/users/user/" + user.username;
    }
    res.send(JSON.stringify({"result": result, "error": error}));
  });
});

//Get a user given a username
router.get(/\/user\/(\w+)$/, function(req, res){
  var username = req.params[0];
  User.find({username:username}, function(err, data){
    var error = {};
    var result;
    if(err) {
      res.status(500);
      error.code = err.code;
      error.message = err.message;
    }else{
      result = data;
    }
    res.send(JSON.stringify({"result":result, "error":error}));
  });
});

module.exports = router;