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
    var name_i=req.body.title.trim();
    var code_i=req.body.code.toUpperCase().trim();
    var semester_i=req.body.semester.trim();
    var credits_i=req.body.credits.trim();
    var prerequisites_i=req.body.prerequisites;
    var antirequisites_i=req.body.antirequisites;
    var tags_i=req.body.tags;
    addCourse(name_i,code_i,semester_i,credits_i,prerequisites_i,antirequisites_i, tags_i,function (response) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(response);
    });
});


app.post("/searchCourses", function (req, res) {
    var name=req.body.search.toLowerCase().trim();
    searchCourses(name,function (response) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.end(response);
    });
});


function searchCourses(searchKey, callback) {
    connectDB(function (err, client)  {
        if (err) {
            console.error(err);
            throw err;
        }
        client.db("Pathways_db").collection('Courses').find({"name":{$regex: new RegExp(searchKey, "i")}}).toArray(function (mongoError, objects) {
            var response=JSON.stringify(objects);
            console.log(response);
            client.close();
            callback(response);
        });
    })
}


function getDependencies(response, callback) {
    var courses=JSON.parse(response);
    for (var i=0;i<courses.size();i++) {
        var d=true;
        while (d) {
        }
    }
}



function addCourse(name_i, code_i, semester_i, credits_i, prerequisites_i, antirequisites_i,tags_i, callback) {
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            throw err;
        }
        checkCourse(code_i, client, function (course) {
            if (!course) {
                client.db('Pathways_db').collection('Courses').insertOne({name:name_i,code:code_i,semester:semester_i, credits:credits_i, prerequisites:JSON.parse(prerequisites_i),antirequisites:JSON.parse(antirequisites_i), options:[], tags: tags_i}, function (err, result) {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    if (!result) {
                        callback("0");
                    } else {
                        var prereq=JSON.parse(prerequisites_i);
                        for (var i=0;i<prereq.length;i++) {
                            client.db('Pathways_db').collection('Courses').updateOne({code: new RegExp('^'+prereq[i]+'$', "i")}, {$push: {options:code_i}}, function (err, upd) {
                                if (err) {
                                    console.error(err);
                                    throw err;
                                }
                            });
                        }
                        callback("1");
                    }
                });
            } else {
                callback("2");
            }
        });
    });
}


function checkCourse(code_i, client, callback) {
    client.db('Pathways_db').collection('Courses').findOne({code: new RegExp('^'+code_i+'$', "i")}, function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        callback(result);
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
    client.db('Pathways_db').collection('Users').insertOne({email: email_i, name: name_i, sem: 0, courses: [], sg_status: 0, cw_status:0, interests: []}, function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        callback(JSON.stringify(result));
    });
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

