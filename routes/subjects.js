/**
 * Created by Lurian on 03/12/2014.
 */
var Subject = require("../models/subjectmodel");
var User = require("../models/usermodel");
var express = require("express");
var ErrorCodes = require('../exceptions/errorcodes');
var router = express.Router();

router.get("/", function(req, res){
        var error =  {};
        var result = {};
        var subjectName = req.query.name;
    if(!subjectName ){
        Subject.find().populate("teachers").exec(function(err, doc){
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
    } else {
        Subject.findOne({name:subjectName}).populate("teachers").exec(function(err, doc){
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
                    error.code = ErrorCodes.Subject.NotFound;
                    error.message = "Subject not found";
                }
            }
            res.send(JSON.stringify({"result":result, "error":error}));
        });
    }
});


router.post('/addsubject', function(req, res){
    console.log("body: "+req.body);
    var subject = new Subject(req.body);
    var error= {};
    var result = {};

    subject.save(function(err) {
        if (err) {
            console.log("deu erro no add")
            error.code = err.code;
            error.message = err.message;
            //11000: MongoError's duplicated key
            error.code == 11000 ? res.status(409) : res.status(500);
        }else {
            res.status(201); //HTTP created code
            result.uri = "/subjects/?name=" + subject.name;
        }
        res.send(JSON.stringify({"result": result, "error": error}));
    });
});



module.exports = router;