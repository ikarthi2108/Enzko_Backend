const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/order", async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json({ message: "Order added successfully" });
});

router.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

router.put("/order/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Order updated successfully" });
});

router.delete("/order/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted successfully" });
});

module.exports = router;
