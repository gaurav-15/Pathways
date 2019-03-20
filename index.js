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

app.listen(8080, function () {
    console.log("Listening on port: 8080");
});