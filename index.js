const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        getCourses(client,function (response) {
            client.close();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(response);
        });
    });
});


app.post('/login', function (req, res) {
    let name_i=req.body.name.trim();
    let email_i=req.body.email.trim();
    let url_i=req.body.url.trim();
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        login(client, email_i, name_i, url_i,function (response) {
            client.close();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(response);
        });
    });
});



app.post('/addCourse', function (req, res) {
    let name_i=req.body.title.trim();
    let code_i=req.body.code.toUpperCase().trim();
    let semester_i=req.body.semester.trim();
    let credits_i=req.body.credits.trim();
    let prerequisites_i=req.body.prerequisites;
    let antirequisites_i=req.body.antirequisites;
    let tags_i=req.body.tags;

    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        addCourse(client, name_i, code_i, semester_i, credits_i, prerequisites_i, antirequisites_i, tags_i, function (response) {
            client.close();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(response);
        });
    });
});


app.post("/searchCourses", function (req, res) {
    let name=req.body.search.toLowerCase().trim();
    connectDB(function (err, client)  {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        searchCourses(client, name,function (response) {
            client.close();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(response);
        });
    });
});

app.post("/getprereqbyid", function (req, res) {
    let name=req.body.code.toLowerCase().trim();
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        getCoursebyid(client, name, function (response) {
            getPrereqDependecies(client, response, function (response) {
                client.close();
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.end(response);
            });
        });
    });
});




app.post("/getantireqbyid", function (req, res) {
    let name=req.body.code.toLowerCase().trim();
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        getCoursebyid(client, name, function (response) {
            getAntireqDependencies(client, response, function (response) {
                client.close();
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.end(response);
            });
        });
    });
});




app.post("/getoptionsbyid", function (req, res) {
    let name=req.body.code.toLowerCase().trim();
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        getCoursebyid(client, name, function (response) {
            getOptionDependencies(client, response, function (response) {
                client.close();
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.end(response);
            });
        });
    });
});




app.post("/updateuserdetails", function (req, res) {
    let email_i=req.body.email.trim();
    let branch_i=req.body.branch.trim();
    let sem_i=req.body.sem.trim();
    let courses_i=req.body.courses.trim();
    let sg_status_i=req.body.sg_status.trim();
    let cw_status_i=req.body.cw_status.trim();
    let interest_i=req.body.interests.trim();
    connectDB(function (err, client) {
        if (err) {
            console.error(err);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end("Could not connect to database!");
        }
        updateUserdata(client,email_i, branch_i, sem_i,courses_i, sg_status_i,cw_status_i,interest_i,function (response) {
            client.close();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.end(response);
        });
    });
});




function updateUserdata(client, email_i, branch_i, sem_i,courses_i, sg_status_i,cw_status_i,interest_i, callback) {
    client.db('Pathways_db').collection('Courses').updateOne({email: email_i}, {$set: {branch: branch_i, sem: sem_i, courses: courses_i, sg_status: sg_status_i, cw_status: cw_status_i, interest: interest_i}}, function (err, upd) {
        if (err){
            console.log(err);
            throw err;
        }else {
            callback("1");
        }
    })
}




async function getPrereqDependecies(client, json_str,callback) {
    const async = require('async');
    let json = JSON.parse(json_str);
    let queue = [];
    let visited = [];
    let result={};
    result[json[0].code]=[];
    for (let i=json[0].prerequisites.length-1;i>=0;i--) {
        queue.push(json[0].prerequisites[i]);
    }
    result[json[0].code].push(json[0]);
    while (queue.length!==0){
        let cid = queue.pop();
        result[cid]=[];
        visited.push(cid);
        await new Promise(function (callback) {
            getCoursebyid(client, cid,function (response) {
                json=JSON.parse(response);
                for (let i=json[0].prerequisites.length-1;i>=0;i--) {
                    if (visited.indexOf(json[0].prerequisites[i])===-1) {
                        queue.push(json[0].prerequisites[i]);
                    }
                }
                result[cid].push(json[0]);
                callback();
            });
        });
    }
    callback(JSON.stringify(result));
}


async function getAntireqDependencies(client, json_str,callback) {
    const async = require('async');
    let json = JSON.parse(json_str);
    let queue = [];
    let visited = [];
    let result={};
    result[json[0].code]=[];
    for (let i=json[0].antirequisites.length-1;i>=0;i--) {
        queue.push(json[0].antirequisites[i]);
    }
    result[json[0].code].push(json[0]);
    while (queue.length!==0){
        let cid = queue.pop();
        result[cid]=[];
        visited.push(cid);
        await new Promise(function (callback) {
            getCoursebyid(client, cid,function (response) {
                json=JSON.parse(response);
                for (let i=json[0].options.length-1;i>=0;i--) {
                    if (visited.indexOf(json[0].options[i])===-1) {
                        queue.push(json[0].options[i]);
                    }
                }
                result[cid].push(json[0]);
                callback();
            });
        });
    }
    callback(JSON.stringify(result));
}



async function getOptionDependencies(client, json_str,callback) {
    const async = require('async');
    let json = JSON.parse(json_str);
    let queue = [];
    let visited = [];
    let result={};
    result[json[0].code]=[];
    for (let i=json[0].options.length-1;i>=0;i--) {
        queue.push(json[0].options[i]);
    }
    result[json[0].code].push(json[0]);
    while (queue.length!==0){
        let cid = queue.pop();
        result[cid]=[];
        visited.push(cid);
        await new Promise(function (callback) {
            getCoursebyid(client, cid,function (response) {
                json=JSON.parse(response);
                for (let i=json[0].options.length-1;i>=0;i--) {
                    if (visited.indexOf(json[0].options[i])===-1) {
                        queue.push(json[0].options[i]);
                    }
                }
                result[cid].push(json[0]);
                callback();
            });
        });
    }
    callback(JSON.stringify(result));
}



function searchCourses(client, searchKey, callback) {
    client.db("Pathways_db").collection('Courses').find({$or:[{"tags":{$regex: new RegExp(searchKey, "i")}},{"name":{$regex: new RegExp(searchKey, "i")}},{"code":searchKey.toUpperCase()}]}).toArray(function (mongoError, objects) {
        let response=JSON.stringify(objects);
        callback(response);
    });
}






function getCoursebyid(client, searchKey, callback) {
    client.db("Pathways_db").collection('Courses').find({"code":searchKey.toUpperCase()}).toArray(function (mongoError, objects) {
        let response=JSON.stringify(objects);
        callback(response);
    });
}



function addCourse(client, name_i, code_i, semester_i, credits_i, prerequisites_i, antirequisites_i,tags_i, callback) {
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
                    let prereq=JSON.parse(prerequisites_i);
                    for (let i=0;i<prereq.length;i++) {
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






function login(client, email_i, name_i, url_i, callback) {
    checkUser(email_i, client, function (user) {
        if (!user) {
            createUser(email_i, name_i, url_i, client, function (result) {
                if (!result) {
                    callback("0");
                }else {
                    checkUser(email_i, client, function (response) {
                        callback(JSON.stringify(response));
                    });
                }
            });
        }else {
            callback(JSON.stringify(user));
        }
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

function  createUser(email_i, name_i, url_i, client, callback) {
    client.db('Pathways_db').collection('Users').insertOne({email: email_i, name: name_i, url: url_i, branch: "", sem: 0, courses: [], sg_status: 0, cw_status:0, interests: []}, function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        callback(JSON.stringify(result));
    });
}



function getCourses(client, callback) {
    let courses=client.db('Pathways_db').collection('Courses').find({});
    let response="";
    courses.toArray(function (mongoError, objects) {
        response=JSON.stringify(objects);
        callback(response);
    });
}


function connectDB(callback) {
    let mongo=require('mongodb').MongoClient;
    let uri="mongodb+srv://admin:admin@pathways-t30da.mongodb.net/Pathways_db?retryWrites=true";
    mongo.connect(uri, { useNewUrlParser: true }, function (mongoError, mongoClient) {
        return callback(mongoError, mongoClient);
    });
}
