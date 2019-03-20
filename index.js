var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.get('/',function (req, res) {
    console.log("GET from /");
    res.redirect('https://pathways-iiitdelhi.firebaseapp.com/');
    res.end();
});

app.post('/', function (req, res) {
    console.log("POST from /");
    res.redirect('https://pathways-iiitdelhi.firebaseapp.com/');
    res.end();
});


app.post('/getCourses', function (req, res) {
    var connect=require('./connect');
    connect.connectDB(function (err, client) {
        if (err) {
            console.error(err);
            throw err;
        }
        var courses=client.db('Pathways_db').collection('Courses').find({});
        courses.toArray(function (mongoError, objects) {
            if (err) {
                console.error(err);
                throw err;
            }
            //console.log(objects);
            res.write(JSON.stringify(objects));
            client.close();
            res.end();
            console.log("Connection closed");
        });
    });
});

app.listen(8080, function () {
    console.log("Listening on port: 8080");
});
