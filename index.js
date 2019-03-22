var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(process.env.PORT || 8080, function () {
    console.log("server started listening at port: 8080");
});

app.get('/', function (req, res) {
    res.end();
});

app.post('/', function (req, res) {
    res.end();
});

app.get('/courses', function (req, res) {
    getCourses(function (response) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(response);
    });
});


function getCourses(callback) {
    connectDB(function (err, client) {
        if (err) {
            console.log(err);
            throw err;
        }
        var courses=client.db('Pathways_db').collection('Courses').find({});
        var response="";
        courses.toArray(function (mongoError, objects) {
            response=JSON.stringify(objects);
            console.log(response);
            client.close();
            callback(response);
        });
    })
}


function connectDB(callback) {
    var mongo=require('mongodb').MongoClient;
    var uri="mongodb+srv://admin:admin@pathways-t30da.mongodb.net/Pathways_db?retryWrites=true";
    mongo.connect(uri, { useNewUrlParser: true }, function (mongoError, mongoClient) {
        return callback(mongoError, mongoClient);
    });
}

