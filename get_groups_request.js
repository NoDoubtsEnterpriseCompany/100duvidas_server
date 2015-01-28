var http = require('http');
http.get("http://localhost:3000/grouplectures", function(res) {
      console.log("Got response: " + res.statusCode);

      res.on("data", function(data){
        console.log("Data response: " + data);
      });
}).on('error', function(e) {
      console.log("Got error: " + e.message);
});
