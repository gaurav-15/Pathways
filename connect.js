module.exports={
    connectDB: function (callback) {
        console.log("attempting DB connection");
        var mongo=require('mongodb').MongoClient;
        var uri="mongodb+srv://admin:admin@pathways-t30da.mongodb.net/Pathways_db?retryWrites=true";
        mongo.connect(uri, { useNewUrlParser: true }, function (mongoError, mongoClient) {
            return callback(mongoError, mongoClient);
        });
    }
};