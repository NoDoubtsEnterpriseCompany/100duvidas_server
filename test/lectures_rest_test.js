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

describe('REST GET TEST - Lectures', function(){
    beforeEach(function(done) {
        this.timeout(10000);
        utils.cleanBD(done,mongoose);
    });
    it('Get lectures by subject id', function(done){
        this.timeout(5000);
        monky.create('Subject', function(err, subject){
            monky.create('Lecture', {subject: subject._id}, function(err, lecture){
                var lectureList = [lecture];
                request(app)
                    .get('/lectures/subjectlectures/'.concat(lecture.subject))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(lectureList.length);
                        for(var i = 0; i < listReceived.length; i++){
                            listReceived[i].subject.toString().should.be.equal(lecture.subject.toString());
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Get lectures by an invalid subject id', function(done){
        this.timeout(5000);
        monky.create('Lecture', function(err, lecture){
            var lectureList = [lecture];
            request(app)
                .get('/lectures/subjectlectures/'.concat('not_a_valid_subject_id'))
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });


    it('Get scheduled lectures', function(done){
        this.timeout(5000);
        monky.createList('ScheduledLecture', 3, function(err, lectureList){
            request(app)
                .get('/lectures/scheduledlecture/')
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

    it('Get scheduled lectures by teacher id', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            monky.createList('ScheduledLecture', 3, {teacher: user._id}, function(err, lectureList){
                request(app)
                    .get('/lectures/scheduledlecture/')
                    .query({teacher: user._id.toString()})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(lectureList.length);
                        for(var i = 0; i < listReceived.length; i++){
                            listReceived[i].teacher._id.toString().should.be.equal(lectureList[i].teacher.toString());
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Get scheduled lectures by student id', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            monky.createList('ScheduledLecture', 3, {student: user._id}, function(err, lectureList){
                request(app)
                    .get('/lectures/scheduledlecture/')
                    .query({student: user._id.toString()})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(lectureList.length);
                        for(var i = 0; i < listReceived.length; i++){
                            listReceived[i].student.toString().should.be.equal(lectureList[i].student.toString());
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });
});

describe('REST POST TEST - Lectures', function(){
    beforeEach(function(done) {
        this.timeout(10000);
        utils.cleanBD(done,mongoose);
    });

    it('Add lecture', function(done){
        this.timeout(5000);
        monky.build('Lecture', function(err, lecture){

            var data = {
                date: lecture.date,
                price: lecture.price,
                teacher: lecture.teacher,
                subject: lecture.subject,
                address: lecture.address
            };
            request(app)
                .post('/lectures/addlecture/')
                .set('Accept', 'application/json')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Add scheduled lecture', function(done){
        this.timeout(5000);
        monky.build('ScheduledLecture', function(err, lecture){

            var data = {
                date: lecture.date,
                price: lecture.price,
                student: lecture.student,
                teacher: lecture.teacher,
                subject: lecture.subject,
                address: lecture.address
            };
            request(app)
                .post('/lectures/schedulelecture/')
                .set('Accept', 'application/json')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });
});

