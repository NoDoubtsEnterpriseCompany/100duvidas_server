/**
 * Created by Lurian on 03/12/2014.
 */
var should = require('should');
var Subject = require('../models/subjectmodel')
var monky = require('../test/mock').monky;

describe('Subject', function() {
    it('should test subject model', function(){
        monky.build('Subject', function(err, subject) {
            subject.should.be.an.instanceof(Subject);
            subject.should.have.property('name');
        });
    });
});
