const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  
customer: { type: String},
  product: { type: String, required: true },
  qty: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", SaleSchema );
