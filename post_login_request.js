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
usuario.username = "jeymisson";
usuario.password = "asdf";
usuario.email = "test@m.com";
usuario.profile = {};
usuario.profile.name = "jeymisson";
usuario.profile.age = 25;
usuario.profile.profilePic = "url://sfa";
usuario.profile.gender = 1;
usuario.profile.degree = "superior incompleto";
usuario.profile.speciality = "Ciencia da computacao";
usuario.profile.subjects = [];

req.write(JSON.stringify(usuario.username,usuario.password));
req.end();
