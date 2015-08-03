var mongoose = require('mongoose'),
    Aggregate = mongoose.model('SentMessageAggregate');
exports.addAgg = function (req, res) {
    console.log('enter post');
    var sDate = req.body.sentDate;
    Aggregate.findOne({ SentDate: sDate })
  .exec(function (err, agg) {
        if (err) {
            console.log('err: ' + err);
        }

        if (agg) {
            res.json(400, { msg: 'agg existed.' });
        } else {
            var newAgg = new Aggregate({ SentDate: sDate });
            newAgg.set('Instance', req.body.instance);
            newAgg.set('SentCount', req.body.sentCount);
            newAgg.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json(400, { msg: err });
                } else {
                    console.log(newAgg.SentDate + ' success insert');
                    res.json(200, { msg: 'success.' });
                }
            });
        }
    });
};

exports.getAggs = function (req, res) {
    Aggregate.find()
      .exec(function (err, aggs) {
            if (!aggs) {
                res.json(404, { msg: 'Not Found.' });
            } else {
                res.json(aggs);
            }
        });
};

exports.removeAgg = function (req, res) {
    var sDate = req.body.sentDate;
    Aggregate.findOne({ SentDate: sDate })
  .exec(function (err, agg) {
        if (err) {
            console.log('err: ' + err);
        }
        
        if (!agg) {
            res.json(400, { msg: 'agg existed.' });
        } else {
            agg.remove(function (err) {
                if (err) {
                    console.log('err: ' + err);
                    res.json(400, { msg: err });
                }
                console.log(sDate + ' remove');
                Aggregate.find()
                  .exec(function (err, aggs) {
                                if (!aggs) {
                                    res.json(404, { msg: 'not Found.' });
                                } else {
                                    res.json(aggs);
                                }
                            });
            });
        }
    });
};
