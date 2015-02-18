/**
 * Created by Lurian on 14/12/2014.
 */
var request = require('supertest');
var express = require('express');
var Subject = require('../models/subjectmodel')
var monky = require('../test/mock').monky;
var should = require('should');
var mongoose = require('mongoose');
var utils = require('./testUtils');

// Importar nossa API rest
var app = require("../app");

describe('REST GET TEST - Subjects', function(){
    beforeEach(function(done) {
        this.timeout(10000);
        utils.cleanBD(done,mongoose);
    });
    it('Get all subjects', function(done){
        monky.createList('Subject', 3, function(err, subjectList){
            request(app)
                .get('/subjects')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    var listReceived = JSON.parse(res.text).result;
                    listReceived.length.should.be.equal(subjectList.length);
                    utils.compareLists(listReceived, subjectList, utils.sort_by('name', false));
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Get a subject filtered by name', function(done){
        monky.create('Subject', function(err, subjectOut){
            monky.create('Subject', function(err, subject) {
                request(app)
                    .get('/subjects')
                    .query({name: subject.name})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var subjectReceived = JSON.parse(res.text).result;
                        utils.compareObjects(subjectReceived, subject);
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Get a subject filtered by an invalid subject name', function(done){
        monky.create('Subject', function(err, subjectOut){
            monky.create('Subject', function(err, subject) {
                request(app)
                    .get('/subjects')
                    .query({name: 'not_a_valid_subject_name'})
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

    it('Get a subject by id', function(done){
        monky.create('Subject', function(err, subjectOut){
            monky.create('Subject', function(err, subject) {
                request(app)
                    .get('/subjects/subject/'.concat(subject._id))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var subjectReceived = JSON.parse(res.text).result;
                        utils.compareObjects(subjectReceived, subject);
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });
});

describe('REST POST TEST - Subjects', function(){
    beforeEach(function(done) {
        this.timeout(10000);
        utils.cleanBD(done,mongoose);
    });
    it('Add subject', function(done){
        monky.build('Subject', function(err, subject){
            request(app)
                .post('/subjects/addsubject')
                .send(subject)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });
});