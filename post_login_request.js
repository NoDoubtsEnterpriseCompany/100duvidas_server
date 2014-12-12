var http = require('http');

var options = {
    hostname: 'localhost',
    port: 3000,
    path: '/users/login',
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
usuario = {};
usuario.username = "tiaraju";
usuario.password = "asdf";

req.write(JSON.stringify({"login":usuario.username,"password":usuario.password}));
req.end();
