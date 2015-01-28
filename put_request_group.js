var http = require('http');

var options = {
      hostname: 'localhost',
        port: 3000,
          path: '/grouplectures/grouplecture/54c96429a7ceafe09745ea2a/addUser',
            method: 'PUT',
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
user = {};
user.username = "jeymisson";


req.write(JSON.stringify(user));
req.end();
