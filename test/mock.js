var mongoose  = require('mongoose')
    , Monky     = require('monky')
    , monky     = new Monky(mongoose)
    , User      = require('../models/usermodel')
    , Subject   = require('../models/subjectmodel');

/*
    Gerador de Users, #n <-- eh o index de qts Users foram criados User1, passoword1 sao exemplos
    de propriedades para o primeiro User criado. Parecido com $index para os javascripteiros do angular
 */
monky.factory('User',  {
        username: 'User#n',
        password: 'Password#n',
        email: 'email#n@provider.com',
        profile: {
            name: 'name#n',
            age: 20,
            profilePic: 'profilePic',
            gender: 0,
            degree: 'Undergraduate',
            speciality: 'Donuts',
            subjects: []
        }
    }
);

monky.factory('Subject',  {
        name: 'Subject#n'
    }
);

monky.factory('Lecture', {
    date: new Date(),
    subject: monky.ref('Subject'),
    teacher: monky.ref('User'),
    student: monky.ref('User'),
    price: 30.0
});

// Mongoose connect and other setup stuff

module.exports.monky = monky;