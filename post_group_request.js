var http = require('http');

var options = {
      hostname: 'localhost',
        port: 3000,
          path: '/grouplectures/addGroupLecture',
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
group = {};
group.date = new Date();
group.name = "turma angular data";
group.professor = {};
group.numMaxStudents = 10;
group.professor.username = "jeymisson"; //jeymisson must be registered on system

req.write(JSON.stringify(group));
req.end();
