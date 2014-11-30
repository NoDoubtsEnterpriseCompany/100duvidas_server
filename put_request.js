var http = require('http');

var options = {
      hostname: 'localhost',
        port: 3000,
          path: '/users/updateuser/jeymisson',
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
data = {}
usuario = {};
usuario.username = "jeymisson";
usuario.password = "oioioi";
usuario.email = "test@m.com";
usuario.profile = {};
usuario.profile.name = "Jeymisson Oliveira";

data.user = usuario;
data.oldpassword = "asdf";


req.write(JSON.stringify(data));
req.end();
