require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require("./routes/orderRoutes");
const receivedOrdersRoutes = require("./routes/ReceivedOrdersRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set email credentials as environment variables
process.env.EMAIL_USER = process.env.EMAIL_USER || "testalogixtech@gmail.com";
process.env.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "gkthoxibekztdqsi";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "testalogixtech@gmail.com";

// Routes
app.use('/api', authRoutes);
app.use("/api", orderRoutes);
app.use("/api", receivedOrdersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});