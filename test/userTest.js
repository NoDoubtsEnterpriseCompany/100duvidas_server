var should = require('should');
var User = require('../models/usermodel')
var monky = require('../test/mock').monky;


/*
  Describe inicia uma classe de teste, dentro da function pode se utilizar metodos before each
  e chamar varios metodos de teste, onde cada metodo de teste eh uma chamada a funcao it
 */
describe('User', function() {

    /*
     Metodo de teste, semelhante ao @Test, pode se ter varios dentro do describe
     */
    it('should test user model', function(){
        /*
          Chamada a classe MOCK monky, que cria um objeto moch do tipo User chamado user.
          Esse objeto mock foi definido no arquivo mock e pode ser utilizado dentro dessa funcao
         */
        monky.build('User', function(err, user) {
            /*
             Testes de fato utilizando should.js, bonito neh?
             */
            user.should.be.an.instanceof(User);
            user.should.have.property('password');
            user.should.have.property('email');
            user.should.have.property('profile');
            user.profile.should.have.property('name');
            user.profile.should.have.property('age');
            user.profile.should.have.property('profilePic');
            user.profile.should.have.property('degree');
            user.profile.should.have.property('speciality');
            user.profile.should.have.property('subjects');
        })
    })
})



// beforeEach(function(done) {
//var suite = this;
//monky.create('User', function(err, user) {
        //if (err) return done(err);
        //suite.user = user;
        //done()
    //}
//);
//});