const express = require("express");
const router = express.Router();
const receivedOrderController = require("../controllers/ReceivedOrderController");

// Create a new order
router.post("/received-orders", receivedOrderController.createOrder);

// Get all orders
router.get("/received-orders", receivedOrderController.getAllOrders);

// Get a single order by ID
router.get("/received-orders/:id", receivedOrderController.getOrderById);

// Update order status
router.put("/received-orders/:id", receivedOrderController.updateOrderStatus);

module.exports = router;