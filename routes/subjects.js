/**
 * Created by Lurian on 03/12/2014.
 */
var Subject = require("../models/subjectmodel");
var User = require("../models/usermodel");
var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
        var error =  {};
        var result = {};
    Subject.find(function(err, doc){
        if(err){
            res.status(500);
            error.code = err.code;
            error.message = err.message;
        }else{
            result = doc;
            res.send(JSON.stringify({"result":result, "error":error}));
        }
    });

});

module.exports = router;