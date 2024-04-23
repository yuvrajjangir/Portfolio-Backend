const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    count: { type: Number, default: 0 },
    visited: { type: Boolean, default: false }
});

const Views = mongoose.model('Views', viewsSchema);

module.exports = { Views };