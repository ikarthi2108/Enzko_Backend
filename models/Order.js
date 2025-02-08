const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productName: String,
  productImg: String,
  size: String,
  availableQty: Number,
  minQty: Number,
  price: Number,
});

module.exports = mongoose.model("Order", OrderSchema);
