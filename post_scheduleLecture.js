var http = require('http');

var options = {
      hostname: 'localhost',
        port: 3000,
          path: '/lectures/schedulelecture',
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
data= {};
data.subject = "54c1a08ce3cc368160c44f43";
data.teacher = "54c7033b38c766000042dce0";
data.student = "54c7033b38c766000042dce0";
data.date = new Date();
data.price = 30.0;
data.address = "oioii";

req.write(JSON.stringify(data));
req.end();
