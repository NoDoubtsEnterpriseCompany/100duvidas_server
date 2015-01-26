var http = require('http');

var options = {
      hostname: 'localhost',
        port: 3000,
          path: '/groupslecture/grouplecture/54c45b8ee7f53084510407fc',
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
group = {};
group.name = "turma java";
group.professorUserName = "jeymisson";
group._id = "54c45b8ee7f53084510407fc"; //Check the correct group's id.
group.registered = ["jeymisson"]; //Adding new student


req.write(JSON.stringify(group));
req.end();
