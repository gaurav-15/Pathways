var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    console.log("GET request");
    var connect=require('./connect');
    connect.connectDB(function (err, client) {
        if (err) {
            console.error(err);
        }
        console.log("connected to db");
        client.close();
    });
    res.end();
});

app.listen(8080, function () {
    console.log("Listening on port: 8080");
});
