/**
 * Created by Lurian on 14/12/2014.
 */
var request = require('supertest');
var express = require('express');
var Subject = require('../models/subjectmodel');
var User = require('../models/usermodel');
var Rating = require('../models/ratingmodel');
var monky = require('../test/mock').monky;
var should = require('should');
var mongoose = require('mongoose');

// Importar nossa API rest
var app = require("../app");

//Mesmo teste com should js
describe('REST POST TEST - User', function () {
    beforeEach(function() {
        // runs before all tests in this block
        mongoose.connection.db.executeDbCommand( {dropDatabase:1}, function(err, result) { if (err) { console.log(err); } });
    });
    it('Posting a user', function (done) {
        // Usando monky, mock, para mockar um user
        monky.build('User', function (err, user) {
            // request é o objeto, superteste,  responsavel pelos testes
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Adding a subject to the user', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            var subjectsSize = user.profile.subjects.length;

            monky.create('Subject', function(err, subject){

                var data = {
                    username: user.username,
                    subject_id: subject._id
                };

                request(app)
                    .post('/users/addsubject')
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect(201)
                    // REST Testing ate aqui, end function recebe a response
                    // e pode se utilizar low level testing a partir dai
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Login OK', function(done){
        this.timeout(5000);
        monky.build('User', function (err, user) {
            var data = {
                login: user.username,
                password: user.password
            };

            // request é o objeto, superteste,  responsavel pelos testes
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            request(app)
                .post('/users/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Login Wrong password', function(done){
        this.timeout(5000);
        monky.build('User', function (err, user) {
            var notTheRightPassword = "notTheRightPassword";
            notTheRightPassword.should.not.be.equal(user.password);
            var data = {
                login: user.username,
                password: notTheRightPassword
            };

            // request é o objeto, superteste,  responsavel pelos testes
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            request(app)
                .post('/users/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(401)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Login wrong username', function(done){
        this.timeout(5000);
        monky.build('User', function (err, user) {
            var notTheRightUsername = "notTheRightUsername";
            notTheRightUsername.should.not.be.equal(user.username);
            var data = {
                login: notTheRightUsername,
                password: user.password
            };

            // request é o objeto, superteste,  responsavel pelos testes
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            request(app)
                .post('/users/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(404)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });
});

describe('REST GET TEST - User', function () {
    beforeEach(function() {
        // runs before all tests in this block
        mongoose.connection.db.executeDbCommand( {dropDatabase:1}, function(err, result) { if (err) { console.log(err); } });
    });

    it('Getting All Users', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){});
        monky.create('User', function(err, user){});
        monky.create('User', function(err, user){
            request(app)
                .get('/users/')
                .set('Accept', 'application/json')
                .expect(200)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    var userlist = JSON.parse(res.text).result;
                    userlist.length.should.be.equal(3);
                    for(i = 0; i < userlist.length; i++){
                        var userReceived = userlist[i];
                        checkUser(userReceived);
                    }
                    done(); // informar o final do teste ao mocha
                });
        });
    })

    it('Getting a user by username', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            request(app)
                .get('/users/')
                .send(user.username)
                .set('Accept', 'application/json')
                .expect(200)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js

                    var listReceived = JSON.parse(res.text).result;
                    listReceived.length.should.be.equal(1);
                    var userReceived = listReceived[0];
                    checkUser(userReceived);
                    userReceived.username.should.be.equal(user.username);
                    done(); // informar o final do teste ao mocha
                });
        });
    })

    it('Getting a user by email', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            request(app)
                .get('/users/')
                .send(user.email)
                .set('Accept', 'application/json')
                .expect(200)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js

                    var listReceived = JSON.parse(res.text).result;
                    listReceived.length.should.be.equal(1);
                    var userReceived = listReceived[0];
                    checkUser(userReceived);
                    userReceived.email.should.be.equal(user.email);
                    done(); // informar o final do teste ao mocha
                });
        });
    })
});

describe('REST PUT TEST - User', function () {
    beforeEach(function () {
        // runs before all tests in this block
        mongoose.connection.db.executeDbCommand({dropDatabase: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    });
    it('Updating a user', function (done) {
        // Usando monky, mock, para mockar um user
        monky.build('User', function (err, user) {
            // request é o objeto, superteste,  responsavel pelos testes

            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            user.name = "newName";

            var data = {
                user: user,
                oldpassword: user.password
            };
            request(app)
                .put('/users/updateuser/'.concat(user.username))
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Updating a user with wrong old password', function (done) {
        // Usando monky, mock, para mockar um user
        monky.build('User', function (err, user) {
            // request é o objeto, superteste,  responsavel pelos testes

            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            user.name = "newName";

            var wrongOldPassowrd = "wrongOldPassowrd";
            wrongOldPassowrd.should.not.be.equal(user.password);

            var data = {
                user: user,
                oldpassword: wrongOldPassowrd
            };
            request(app)
                .put('/users/updateuser/'.concat(user.username))
                .send(data)
                .set('Accept', 'application/json')
                .expect(409)
                // REST Testing ate aqui, end function recebe a response
                // e pode se utilizar low level testing a partir dai
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });
});

describe('REST POST TEST - Rating in User', function () {
    beforeEach(function () {
        // runs before all tests in this block
        mongoose.connection.db.executeDbCommand({dropDatabase: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    });

    it('Adding a rating to an user', function (done) {
        // Usando monky, mock, para mockar um user
        monky.build('Rating', function(err,rating) {
            // request é o objeto, superteste,  responsavel pelos testes
            monky.create('User', function(err,teacher) {
                monky.create('User', function(err,student) {
                    rating.commenter = student;
                    var data = {
                        student: student,
                        rating: rating
                    };

                    request(app)
                        .post('/users/addrating/'.concat(teacher.username))
                        .send(data)
                        .set('Accept', 'application/json')
                        .expect(201)
                        // REST Testing ate aqui, end function recebe a response
                        // e pode se utilizar low level testing a partir dai
                        .end(function (err, res) {
                            should.not.exist(err); // Should.js
                            done(); // informar o final do teste ao mocha
                        });
                });
            });
        });
    });
});


function checkUser(user){
    user.username.should.be.type('string');
    user.email.should.be.type('string');
    user.profile.name.should.be.type('string');
    user.profile.age.should.be.type('number');
    user.profile.profilePic.should.be.type('string');
    user.profile.degree.should.be.type('string');
    user.profile.speciality.should.be.type('string');
    for(var j = 0; j < user.profile.ratings.length; j++){
        user.profile.ratings[i].should.be.an.instanceOf(mongoose.Schema.Types.ObjectId);
    }
    for(var j = 0; j < user.profile.groupLecturesRegistered.length; j++){
        user.profile.groupLecturesRegistered[i].should.be.an.instanceOf(mongoose.Schema.Types.ObjectId);
    }
    for(var j = 0; j < user.profile.groupLecturesCreated.length; j++){
        user.profile.groupLecturesCreated[i].should.be.an.instanceOf(mongoose.Schema.Types.ObjectId);
    }
    for(var j = 0; j < user.profile.subjects.length; j++){
        user.profile.subjects[i].should.be.an.instanceOf(mongoose.Schema.Types.ObjectId);
    }
    user.profile.mean.should.be.type('number');
}