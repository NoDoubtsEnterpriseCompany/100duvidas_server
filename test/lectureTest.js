var should = require('should');
var Lecture = require('../models/lecturemodel');
var monky = require('../test/mock').monky;


/*Describe starts a test class where we can call methods before each
  and call many tests cases, each test case should be inside an it clause.
 */
describe('Lecture', function() {

    /*
    Test case method, we can have many of the inside one describe
     */
    it('should test lecture model', function(){
        /*
          Call to MOCK monky, which instantiates a mock lecture object.
          these mock objects are defined inside mock.js
         */
        monky.build('Lecture', function(err, lecture) {
            /*
             Tests using should.js
             */
            lecture.should.be.an.instanceof(Lecture);
            lecture.should.have.property('date')
            lecture.should.have.property('subject');
            lecture.should.have.property('teacher');
            lecture.should.have.property('price');
            lecture.should.have.property('address');
        });
    });
});
