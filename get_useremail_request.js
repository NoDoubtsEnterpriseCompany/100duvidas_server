var http = require('http');

var options = {
    hostname:"localhost",
    port:3000,
    path:"/users/user?email=test%40m.com"
};

http.get(options, function(res) {
      console.log("Got response: " + res.statusCode);

      res.on("data", function(data){
        console.log("Data response: " + data);
      });
}).on('error', function(e) {
      console.log("Got error: " + e.message);
});
