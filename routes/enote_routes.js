var express = require('express');
module.exports = function (app) {
    var aggregate = require('../controllers/aggregate_controller.js');
    app.use('/', express.static('./static'));
    app.get('/test', function (req, res) {
        res.send('hello');
    });
    app.get('/aggregate/get', aggregate.getAggs);
    app.post('/aggregate/add', aggregate.addAgg);
    app.post('/aggregate/remove', aggregate.removeAgg);
}