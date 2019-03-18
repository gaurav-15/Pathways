var express=require('express');
var bodyParser=require('body-parser');
var app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/test",function(req,res){
    console.log("get req");
});

app.post("/test",function (req, res) {
    console.log("post req");
    console.log("params: "+req.body.doc_id);
});

app.listen(8080, function () {
   console.log("listening on http://localhost:8080");
});