const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});

const Views = mongoose.model('Views', viewsSchema);

module.exports = { Views };