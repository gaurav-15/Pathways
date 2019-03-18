var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/pages'));

app.get("/", function (req, res) {
    res.redirect('/index.html');
    res.end();
});

app.post("/", function (req, res) {
    res.redirect('/index.html');
    res.end();
});

app.get("/error", function (req, res) {
    res.redirect('/404.html');
    res.end();
});

app.post("/error", function (req, res) {
    res.redirect('/404.html');
    res.end();
});


app.listen(8080, function () {
    console.log("listening on port: 8080");
});
