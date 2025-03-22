const ReceivedOrder = require("../models/ReceivedOrders");
const emailUtils = require("../utils/emailUtils");

// Controller to create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, contact, address, totalAmount } = req.body;
    
    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided in the order" });
    }
    
    if (!contact || !contact.name || !contact.phone || !contact.email) {
      return res.status(400).json({ message: "Contact information incomplete" });
    }
    
    if (!address || !address.street || !address.city || !address.state || !address.zipCode) {
      return res.status(400).json({ message: "Address information incomplete" });
    }
    
    // Generate order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const orderNumber = `ORD-${year}${month}${day}-${random}`;
    
    // Create the order with manual orderNumber
    const newOrder = new ReceivedOrder({
      orderNumber, // Set the order number explicitly
      items: items.map(item => ({
        productId: item.id,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity || 1,
        totalPrice: item.totalPrice || item.price,
        size: item.size,
        productImg: item.productImg
      })),
      contact,
      address,
      totalAmount
    });
    
    // Save the order
    const savedOrder = await newOrder.save();
    
    // Send email to admin
    await emailUtils.sendOrderNotificationEmail(savedOrder);
    
    // Send confirmation email to customer
    await emailUtils.sendOrderConfirmationEmail(savedOrder);
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message
    });
  }
};

// Controller to get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await ReceivedOrder.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Controller to get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await ReceivedOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

// Controller to update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    
    const updatedOrder = await ReceivedOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};