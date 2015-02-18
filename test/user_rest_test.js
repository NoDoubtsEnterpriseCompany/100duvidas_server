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
        mongoose.connection.db.executeDbCommand( {dropDatabase:1}, function(err, result) { if (err) { console.log(err); } });
    });
    it('Posting a user', function (done) {
        monky.build('User', function (err, user) {
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Adding a subject to the user', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            console.log(err);
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

            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            request(app)
                .post('/users/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
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

            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });

            request(app)
                .post('/users/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(401)
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

            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });

            request(app)
                .post('/users/login')
                .send(data)
                .set('Accept', 'application/json')
                .expect(404)
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
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    var userlist = JSON.parse(res.text).result;
                    userlist.length.should.be.equal(3);
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Getting All Users filtering by subject', function(done){
        this.timeout(5000);
        monky.create('Subject', function(err, subject) {
            monky.create('User', function(err, userOut){
                monky.createList('User', 3, function(err, userList){
                    for(var i = 0 ; i < userList.length; i++){
                        userList[i].profile.subjects.push(subject._id);
                        userList[i].update({profile:  userList[i].profile}, function (err) {
                            should.not.exist(err); // Should.js
                        });
                    }
                    request(app)
                        .get('/users/')
                        .set('Accept', 'application/json')
                        .query({subject: subject.name})
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err); // Should.js
                            var listReceived = JSON.parse(res.text).result;
                            listReceived.length.should.be.equal(userList.length);
                            compareLists(listReceived, userList, sort_by('username', false));
                            done(); // informar o final do teste ao mocha
                        });
                });
            });
        });
    });

    it('Getting All Users filtering by not created subject', function(done){
        this.timeout(5000);
        monky.createList('User', 3, function(err, userList){
            request(app)
                .get('/users/')
                .set('Accept', 'application/json')
                .query({subject: 'not created Subject'})
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Getting All Users filtering by subject that no user have', function(done){
        this.timeout(5000);
        monky.createList('User', 3, function(err, userList){
            monky.create('Subject', function(err, subject){
                request(app)
                    .get('/users/')
                    .set('Accept', 'application/json')
                    .query({subject: subject.name})
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(0);
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Getting a user by username', function(done){
        this.timeout(5000);
        monky.create('User', function(err, userOut){
            monky.create('User', function(err, user){
                request(app)
                    .get('/users/user/'.concat(user.username))
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js

                        var userReceived = JSON.parse(res.text).result;
                        userReceived.username.should.be.equal(user.username);
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Getting a user by an invalid username', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            request(app)
                .get('/users/user/'.concat('not_a_valid_username'))
                .set('Accept', 'application/json')
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Getting a user by email', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            request(app)
                .get('/users/user')
                .query({email: user.email})
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    var userReceived = JSON.parse(res.text).result;
                    userReceived.email.should.be.equal(user.email);
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Getting a user by an invalid email', function(done){
        this.timeout(5000);
        monky.create('User', function(err, user){
            request(app)
                .get('/users/user')
                .query({email: 'not_a_valid_email'})
                .set('Accept', 'application/json')
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });
});

describe('REST PUT TEST - User', function () {
    beforeEach(function () {
        mongoose.connection.db.executeDbCommand({dropDatabase: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    });
    it('Updating an user password', function (done) {
        monky.build('User', function (err, user) {
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });


            var data = {
                user: user,
                oldpassword: user.password
            };
            user.password = "newpassword";
            request(app)
                .put('/users/updateuser/'.concat(user.username))
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Updating an user with wrong old password', function (done) {
        monky.build('User', function (err, user) {
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
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
                .expect(401)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Updating an user with an invalid username', function (done) {
        monky.build('User', function (err, user) {
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });
            user.name = "newName";

            var data = {
                user: user,
                oldpassword: user.password
            };
            request(app)
                .put('/users/updateuser/'.concat('not_a_valid_username'))
                .send(data)
                .set('Accept', 'application/json')
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                    done(); // informar o final do teste ao mocha
                });
        });
    });

    it('Updating an user name', function (done) {
        monky.build('User', function (err, user) {
            request(app)
                .post('/users/adduser')
                .send(user)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err); // Should.js
                });
            user.name = "newName";

            var oldPassword = user.password;
            // If the field password is in the user, the server interprets it as a password change
            user.password = null;

            var data = {
                user: user,
                oldpassword: oldPassword
            };
            request(app)
                .put('/users/updateuser/'.concat(user.username))
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
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
        monky.build('Rating', function(err,rating) {
            monky.create('User', function(err,teacher) {
                monky.create('User', function(err,student) {
                    rating.commenter = student;
                    var ratingJSON = JSON.stringify(rating);
                    var data = {
                        student: student,
                        rating: ratingJSON
                    };
                    request(app)
                        .post('/users/addrating/'.concat(teacher.username))
                        .send(data)
                        .set('Accept', 'application/json')
                        .expect(201)
                        .end(function (err, res) {
                            should.not.exist(err); // Should.js
                            done(); // informar o final do teste ao mocha
                        });
                });
            });
        });
    });

    //FIXME: Teste quebrando a execução dos testes, erro em addRating em routes/users 'Node.js Error: Can't set headers after they are sent'

/*    it('Adding a rating to an invalid user', function (done) {
        monky.build('Rating', function(err,rating) {
           monky.create('User', function(err,student) {
                rating.commenter = student;
                var ratingJSON = JSON.stringify(rating);
                var data = {
                    student: student,
                    rating: ratingJSON
                };

                request(app)
                    .post('/users/addrating/'.concat('not_a_valid_username'))
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });
 */
});

describe('REST GET TEST - Rating in User', function () {
    beforeEach(function () {
        // runs before all tests in this block
        mongoose.connection.db.executeDbCommand({dropDatabase: 1}, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    });

    it('Getting the ratings of an user', function (done) {
        monky.create('User', function(err,teacher) {
            monky.createList('Rating', 3, { commenter: teacher._id}, function(err,ratings) {
                teacher.profile.ratings = ratings;
                teacher.update({profile: teacher.profile}, function (err) {
                    should.not.exist(err); // Should.js
                });
                request(app)
                    .get('/users/rating/'.concat(teacher.username))
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js

                        var listReceived = JSON.parse(res.text).result;
                        listReceived.length.should.be.equal(ratings.length);
                        for (var i = 0; i < listReceived.length; i++) {
                            compareObjects(listReceived[i], ratings[i]);
                        }
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });

    it('Getting the ratings of an invalid user', function (done) {
        monky.create('User', function(err,teacher) {
            monky.createList('Rating', 3, { commenter: teacher._id}, function(err,ratings) {
                teacher.profile.ratings = ratings;
                teacher.update({profile: teacher.profile}, function (err) {
                    should.not.exist(err); // Should.js
                });
                request(app)
                    .get('/users/rating/'.concat('not_a_valid_username'))
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err); // Should.js
                        done(); // informar o final do teste ao mocha
                    });
            });
        });
    });


});

function compareObjects(trueObject, other){
    // FIXME: Mother of Gambi, Lucas Andrade
    for(var campo in trueObject){
        if(trueObject[campo] !== null && typeof trueObject[campo]  === 'object'){
            compareObjects(trueObject[campo], other[campo]);
        } else {
            trueObject[campo].toString().should.be.eql(other[campo].toString());
        }
    }
}

function compareLists(trueList, otherList, sortFunction){
    trueList.sort(sortFunction);
    otherList.sort(sortFunction);
    trueList.length.should.be.equal(otherList.length);
    for(var i = 0; i < trueList.length; i++){
        compareObjects(trueList[i],otherList[i]);
    }
}

var sort_by = function(field, reverse, primer){
    var key = primer ?
        function(x) {return primer(x[field])} :
        function(x) {return x[field]};

    reverse = [-1, 1][+!!reverse];

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}
