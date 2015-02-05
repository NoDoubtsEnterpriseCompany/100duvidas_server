var mongoose  = require('mongoose')
    , Monky         = require('monky')
    , monky         = new Monky(mongoose)
    , User          = require('../models/usermodel')
    , Subject       = require('../models/subjectmodel')
    , Lecture       = require('../models/lecturemodel')
    , Rating        = require('../models/ratingmodel')
    , GroupLecture  = require('../models/grouplecturemodel');

/*
    Gerador de Users, #n <-- eh o index de qts Users foram criados User1, passoword1 sao exemplos
    de propriedades para o primeiro User criado. Parecido com $index para os javascripteiros do angular
 */
monky.factory('User',  {
        username: 'User#n',
        password: 'password#n',
        email: 'email#n@provider.com',
        profile: {
            name: 'name#n',
            age: 20,
            profilePic: 'profilePic',
            gender: 0,
            degree: 'Undergraduate',
            speciality: 'Donuts',
            subjects: [monky.ref('Subject', 'id'),
                monky.ref('Subject', 'id'),
                monky.ref('Subject', 'id')],
            groupLecturesRegistered: [monky.ref('GroupLecture', 'id')],
            groupLecturesCreated: [monky.ref('GroupLecture', 'id')],
            totalScore: 0,
            ratings: [monky.ref('Rating', 'id')],
            mean: 0
        }
    }
);

monky.factory('Subject',  {
        name: 'Subject#n',
        description: 'description#n'
    }
);

monky.factory('Lecture', {
    date: new Date(),
    subject: monky.ref('Subject', 'id'),
    teacher: monky.ref('User', 'id'),
    student: [monky.ref('User', 'id'), monky.ref('User', 'id')],
    price: 50.0
});

monky.factory('Rating', {
    comment: 'comment#n',
    commenter: 'id#n',
    score: 3
});

monky.factory('GroupLecture', {
    name: "GroupName#n",
    date: new Date(),
    price: 50.0,
    address: 'address#n',
    description: 'description#n',
    subject: monky.ref("Subject", 'id'),
    professor: {
        username: 'username#n',
        profile: {
            name: 'name#n'
        }
    },
    numMaxStudents: 5,
    studentsRegistered: []
});

// Mongoose connect and other setup stuff

module.exports.monky = monky;