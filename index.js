var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.redirect("https://iiitd-pathways.firebaseapp.com/");
});

app.post("/", function (req, res) {
    res.redirect("https://iiitd-pathways.firebaseapp.com/");
});



app.listen(8080, function () {
   console.log("listening on port: 8080");
});
