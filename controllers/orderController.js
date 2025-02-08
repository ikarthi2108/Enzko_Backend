const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
    const order = new Order({ user: req.userId, items: req.body.items });
    await order.save();
    res.json({ message: 'Order placed' });
};

exports.getOrders = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};
