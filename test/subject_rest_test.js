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
describe('GET /subjects', function(){
    it('respond with json', function(done){
        // request é o objeto, superteste,  responsavel pelos testes
        request(app)
            .get('/subjects')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            // REST Testing ate aqui, end function recebe a response
            // e pode se utilizar low level testing a partir dai
            .end(function (err, res) {
                should.not.exist(err); // Should.js
                done(); // informar o final do teste ao mocha
            });
    });
})