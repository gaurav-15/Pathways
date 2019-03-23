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

app.post('/courses', function (req, res) {
    getCourses(function (response) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(response);
    });
});


app.post('/login', function (req, res) {
    var name_i=req.body.name;
    var email_i=req.body.email;
    console.log("name: "+name_i);
    console.log("email: "+email_i);
    login(email_i, name_i, function (response) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(response);
    });
});



app.post('/addCourse', function (req, res) {
    var name_i=req.body.title;
    var semester_i=req.body.semester;
    var credits_i=req.body.credits;
    var prerequisites_i=req.body.prerequisites;
    var antirequisites_i=req.body.antirequisites;
    addCourse(name_i,semester_i,credits_i,prerequisites_i,antirequisites_i, function (response) {
        var result="";
        if (!response) {
            result="0";
        }else {
            result="1";
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(result);
    });
});


function addCourse(name_i, semester_i, credits_i, prerequisites_i, antirequisites_i, callback) {
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            throw err;
        }
        client.db('Pathways_db').collection('Courses').insertOne({name:name_i,semester:semester_i, credits:credits_i, prerequisites:JSON.parse(prerequisites_i),antirequisites:JSON.parse(antirequisites_i)}, function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }
            callback(result);
        });
    });
}


function login(email_i, name_i, callback) {
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            throw err;
        }
        checkUser(email_i, client, function (user) {
            if (!user) {
                createUser(email_i, name_i, client, function (result) {
                    if (!result) {
                        result="0";
                    }else {
                        result="1";
                    }
                    callback(result);
                });
            }else {
                callback(JSON.stringify(user));
            }
        });
    });
}

function checkUser(email_i, client, callback) {
    client.db('Pathways_db').collection('Users').findOne({email:email_i}, function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        callback(result);
    });
}

function  createUser(email_i, name_i, client, callback) {
    client.db('Pathways_db').collection('Users').insertOne({email: email_i, name: name_i}, function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        callback(JSON.stringify(result));
    })
}



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

