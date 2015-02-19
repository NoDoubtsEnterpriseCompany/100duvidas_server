/**
 * Created by Lurian on 18/02/2015.
 */
var request = require('supertest');
var express = require('express');
var lecture = require('../models/lecturemodel')
var monky = require('../test/mock').monky;
var should = require('should');
var mongoose = require('mongoose');
var utils = require('./testUtils');

// Importar nossa API rest
var app = require("../app");

describe('REST GET TEST - GroupLecture', function(){
    beforeEach(function(done) {
        this.timeout(10000);
        utils.cleanBD(done,mongoose);
    });
    it('Get group lectures', function(done){
        this.timeout(5000);
        monky.createList('GroupLecture', 3, function(err, lectureList){
            request(app)
                .get('/grouplectures/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    var listReceived = JSON.parse(res.text).result;
                    listReceived.length.should.be.equal(lectureList.length);
                    for(var i = 0; i < listReceived.length; i++){
                        listReceived[i]._id.toString().should.be.equal(lectureList[i]._id.toString());
                    }
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Get group lectures by professor username', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            monky.createList('GroupLecture', 3, {professor: {username: user.username, profile: { name: user.name}}}, function(err, lectureList){
                request(app)
                    .get('/grouplectures/')
                    .query({professor: user.username})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(lectureList.length);
                        for(var i = 0; i < listReceived.length; i++){
                            listReceived[i].professor.username.toString().should.be.equal(lectureList[i].professor.username.toString());
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Get group lectures by student id', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            monky.createList('GroupLecture', 3, {studentsRegistered: [user._id] }, function(err, lectureList){
                request(app)
                    .get('/grouplectures/')
                    .query({student: user._id.toString()})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(lectureList.length);
                        for(var i = 0; i < listReceived.length; i++){
                            listReceived[i].studentsRegistered.toString().should.be.equal(lectureList[i].studentsRegistered.toString());
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Get group lectures by subject id', function(done){
        this.timeout(5000);
        monky.create('Subject', function(err, subject){
            monky.createList('GroupLecture', 3, {subject: subject._id}, function(err, lectureList){
                request(app)
                    .get('/grouplectures/')
                    .query({subject: subject._id.toString()})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(lectureList.length);
                        for(var i = 0; i < listReceived.length; i++){
                            listReceived[i].subject.toString().should.be.equal(lectureList[i].subject.toString());
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });
});

describe('REST GET TEST - GroupLecture', function() {
    beforeEach(function (done) {
        this.timeout(10000);
        utils.cleanBD(done, mongoose);
    });

    it('Put user in group lecture', function(done){
        this.timeout(5000);
        monky.create('GroupLecture', function(err, lecture){
            monky.create('User', function(err, user){
                request(app)
                    .put('/grouplectures/grouplecture/'.concat(lecture._id.toString()).concat('/addUser'))
                    .send(user)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Put user in group lecture with an invalid lecture ID', function(done){
        this.timeout(5000);
        monky.build('GroupLecture', function(err, lecture){
            monky.create('User', function(err, user){
                request(app)
                    .put('/grouplectures/grouplecture/'.concat(lecture._id.toString()).concat('/addUser'))
                    .send(user)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Put user in group lecture with an invalid user', function(done){
        this.timeout(5000);
        monky.create('GroupLecture', function(err, lecture){
            monky.build('User', function(err, user){
                request(app)
                    .put('/grouplectures/grouplecture/'.concat(lecture._id.toString()).concat('/addUser'))
                    .send(user)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });
});
