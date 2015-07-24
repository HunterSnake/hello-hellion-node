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
app.get('/dbAdd', function (req, res) {
    console.log('\nParam URL: ' + req.originalUrl);
    var dbURL = "mongodb://";
    if (dbcreds) {
        dbURL = dbURL + dbcreds.username + ':' + dbcreds.password + '@' + dbcreds.host + ':' + dbcreds.port + '/' + dbcreds.db
    } else {
        dbURL = dbURL + "localhost/" + "enote";
    }
    console.log("add-" + dbURL);
    mongoClient.connect(dbURL, function (err, db) {
        db.collection("log_sent_Data", function (err, myCol) {
            var d = new Date(2009, 2, 1);
            for (var i = 0; i < 10; i++) {
                var r = Math.floor(Math.random() * 200) + 400;
                addObject(myCol, {
                    date: d, count: r
                });
            }
        });
        setTimeout(function () {
            db.close();
            res.send('add data success');
        }, 3000);
    });
});
app.get('/test', function (req, res) {
    console.log('\nParam URL: ' + req.originalUrl);
    var d = new Date(2009,2,1);
    for (var i = 0; i < 10; i++) {
        var r = Math.floor(Math.random() * 200) + 400;
        console.log(new Date(d.getTime() + i * 24 * 60 * 60 * 1000), r);
    }
    res.send('success');
});
app.get('/dbGet', function (req, res) {
    console.log('\nParam URL: ' + req.originalUrl);
    var dbURL = "mongodb://";
    if (dbcreds) {
        dbURL = dbURL + dbcreds.username + ':' + dbcreds.password + '@' + dbcreds.host + ':' + dbcreds.port + '/' + dbcreds.db
    } else {
        dbURL = dbURL + "localhost/" + "enote";
    }
    console.log("get-"+dbURL);
    mongoClient.connect(dbURL, function (err, db) {
        db.collection("log_sent_Data", function (err, nebulae) {
            nebulae.find(function (err, items) {
                items.toArray(function (err, itemArr) {
                    res.send(itemArr);
                });
            });
        });
    });
});

function addObject(collection, object) {
    collection.insert(object, function (err, result) {
        if (!err) {
            console.log("Inserted : ");
            console.log(result);
        }
    });
}

//    /find?author=Brad&title=Node
//    /book/12:15
//    /user/4983