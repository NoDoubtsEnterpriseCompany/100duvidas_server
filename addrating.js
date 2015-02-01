var http = require('http');

var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users/addrating/tiaraju',
    method: 'POST',
    headers: {"Content-Type": "application/json"}
};

var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

//write data to request body

student = {};
student.username="tsmaneoto@yahoo.com.br";

rating = {};
rating.score = 4;
rating.comment="he rocks" ;
rating.commenter = student;

data = {};
data.student= student;
data.rating = rating;




req.write(JSON.stringify(data));
req.end();
/**
 * Created by tiaraju on 30/01/15.
 */
