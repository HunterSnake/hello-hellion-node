var express = require('express');
var url = require('url');
var app = express();
var mongoose = require('mongoose');
var mongoClient = require('mongodb').MongoClient;
app.use('/s', express.static('./static'), { maxAge: 60 * 60 * 1000 });
var port = process.env.PORT || 8008;
console.log(port);

if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var dbcreds = services['mongodb'][0].credentials;
}

if (dbcreds) {
    console.log(dbcreds);
    mongoose.connect(dbcreds.host, dbcreds.db, dbcreds.port, { user: dbcreds.username, pass: dbcreds.password });
} else {
    mongoose.connect("127.0.0.1", "todomvc", 27017);
}

app.listen(port);
app.get('/', function (req, res) {
    res.send("Get Index");
});
app.get('/find', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var response = 'Finding Book: Author: ' + query.author + 
                  ' Title: ' + query.title;
    console.log('\nQuery URL: ' + req.originalUrl);
    console.log(response);
    res.send(response);
});
app.get(/^\/book\/(\w+)\:(\w+)?$/, function (req, res) {
    var response = 'Get Book: Chapter: ' + req.params[0] + 
              ' Page: ' + req.params[1];
    console.log('\nRegex URL: ' + req.originalUrl);
    console.log(response);
    res.send(response);
});
app.get('/user/:userid', function (req, res) {
    var response = 'Get User: ' + req.param('userid');
    console.log('\nParam URL: ' + req.originalUrl);
    console.log(response);
    res.send(response);
});
app.param('userid', function (req, res, next, value) {
    console.log("\nRequest received with userid: " + value);
    next();
});
app.get('/db', function (req, res) {
    var response = 'server status: \n ';
    console.log('\nParam URL: ' + req.originalUrl);
    mongoClient.connect("mongodb://localhost/todomvc", function (err, db) {
        var adminDB = db.admin();
        adminDB.serverStatus(function (err, status) {
            console.log(status);
            response = response + '\n' + status;
            db.close();
        });
    });
    res.send(response);
});


//    /find?author=Brad&title=Node
//    /book/12:15
//    /user/4983