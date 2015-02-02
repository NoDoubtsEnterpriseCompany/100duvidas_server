var http = require('http');
http.get("http://localhost:3000/lectures/userlectures/54cd7359f8052de348af3029", function(res) {
    console.log("Got response: " + res.statusCode);

    res.on("data", function(data){
        console.log("Data response: " + data);
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
/**
 * Created by tiaraju on 02/02/15.
 */
