var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var dbcreds = services['mongodb'][0].credentials;
}

if (dbcreds) {
    var db = mongoose.connect(dbcreds.host, dbcreds.db, dbcreds.port, { user: dbcreds.username, pass: dbcreds.password });
} else {
    var db = mongoose.connect("127.0.0.1", "enote", 27017);
}
require('./models/SentMessageAggregate.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('./routes/enote_routes.js')(app);

var port = process.env.PORT || 8008;
app.listen(port);