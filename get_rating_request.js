var http = require('http');
http.get("http://localhost:3000/users/rating/54ce7215ca3f8445142ee732", function(res) {
    console.log("Got response: " + res.statusCode);

    res.on("data", function(data){
        console.log("Data response: " + data);
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});