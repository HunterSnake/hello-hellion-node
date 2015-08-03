var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SentMessageAggregateSchema = new Schema({
    SentDate: Date,
    Instance: String,
    SentCount: Number
});
mongoose.model('SentMessageAggregate', SentMessageAggregateSchema);