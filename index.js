var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.get('/',function (req, res) {
    console.log("GET from /");
    var fs=require('fs');
    fs.readFile('HTML/index.html', function (err, html) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        //res.write(html);
        res.end(html);
    });
});

app.post('/', function (req, res) {
    console.log("POST from /");
    res.end();
});


app.get('/getCourses', function (req, res) {
    getCourses(req, res);
});

app.listen(8080, function () {
    console.log("Listening on port: 8080");
});




function getCourses(req, res) {
    var connect=require('./connect');
    connect.connectDB(function (err, client) {
        if (err) {
            console.error(err);
            throw err;
        }
        var courses=client.db('Pathways_db').collection('Courses').find({});
        var response="";
        courses.toArray(function (mongoError, objects) {
            if (err) {
                console.error(err);
                throw err;
            }
            response=response+JSON.stringify(objects);
            console.log(response);
            console.log("Disconnecting from DB");
            res.writeHead(200, {'Content-Type': 'text/event-stream'});
            client.close();
            res.end(response);
        });
    });
}
