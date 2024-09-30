 const mongoose = require("mongoose");
 
 const viewSchema = new mongoose.Schema({
     count: { type: Number, default: 0 },
     visitors: [
         {
             ip: { type: String, required: true },
             device: { type: String, required: true },
             timestamp: { type: Date, default: Date.now }
         }
     ]
 });
 
 const Views = mongoose.model("Views", viewSchema);  // Make sure the collection is named correctly
 
 module.exports = { Views };