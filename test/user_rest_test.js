/**
 * Created by Lurian on 14/12/2014.
 */
var request = require('supertest');
var express = require('express');
var Subject = require('../models/subjectmodel')
var monky = require('../test/mock').monky;
var should = require('should');

// Importar nossa API rest
var app = require("../app");

//Mesmo teste com should js
describe('GET /users', function () {
    it('respond with json', function (done) {
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
})