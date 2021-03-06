var http = require('http');

var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/subjects/addsubject',
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
subject = {}

subject.name="lplb";

req.write(JSON.stringify(subject));
req.end();
