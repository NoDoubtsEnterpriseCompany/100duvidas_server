/**
 * Created by Lurian on 18/02/2015.
 */
var should = require('should');

var compareObjects = function (trueObject, other){
    // FIXME: Mother of Gambi, Lucas Andrade
    for(var campo in trueObject){
        if(trueObject[campo] !== null && typeof trueObject[campo]  === 'object'){
            compareObjects(trueObject[campo], other[campo]);
        } else {
            trueObject[campo].toString().should.be.eql(other[campo].toString());
        }
    }
};

var compareLists = function (trueList, otherList, sortFunction){
    trueList.sort(sortFunction);
    otherList.sort(sortFunction);
    trueList.length.should.be.equal(otherList.length);
    for(var i = 0; i < trueList.length; i++){
        compareObjects(trueList[i],otherList[i]);
    }
};

var sort_by = function (field, reverse, primer){
    var key = primer ?
        function(x) {return primer(x[field])} :
        function(x) {return x[field]};

    reverse = [-1, 1][+!!reverse];

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
};

var disconnected = 0;
var connected = 1;
var connecting = 2;
var disconnecting = 3;

var cleanBD = function (done, db){
    var connectionState = db.connection.readyState;

    connectionState.should.not.be.equal(disconnected);
    connectionState.should.not.be.equal(disconnecting);

    if(connectionState === connecting){
        db.connection.on('connected', function(){
            db.connection.db.executeDbCommand( {dropDatabase:1}, function(err, result) {
                should.not.exist(err);
                done();
            });
        });
    } else {
        db.connection.db.executeDbCommand( {dropDatabase:1}, function(err, result) {
            should.not.exist(err);
            done();
        });
    }
}

module.exports ={ sort_by: sort_by,
                compareLists: compareLists,
                compareObjects: compareObjects,
                cleanBD: cleanBD};