const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    visitors: [
        {
            ip: { type: String, required: true },
            device: { type: String, required: true }
        }
    ]
});

const Views = mongoose.model("Views", viewSchema);

module.exports = { Views };
