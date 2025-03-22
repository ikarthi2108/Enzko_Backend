const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "testalogixtech@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "gkthoxibekztdqsi",
  },
});

// Admin email address
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "venkatkaruna141@gmail.com";

// Function to send order notification email to admin
exports.sendOrderNotificationEmail = async (order) => {
  try {
    // Format items for email
    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.size || "N/A"}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${item.totalPrice.toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || "testalogixtech@gmail.com",
      to: ADMIN_EMAIL, // Using the admin email constant
      subject: `New Order Received - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a86e8; text-align: center;">New Order Notification</h2>
          <p style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
            A new order (${order.orderNumber}) has been received from ${order.contact.name}.
          </p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Details:</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Customer Information:</h3>
          <p><strong>Name:</strong> ${order.contact.name}</p>
          <p><strong>Email:</strong> ${order.contact.email}</p>
          <p><strong>Phone:</strong> ${order.contact.phone}</p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Shipping Address:</h3>
          <p>${order.address.street},<br>
          ${order.address.city}, ${order.address.state} ${order.address.zipCode}</p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Items:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Size</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr style="background-color: #f2f2f2; font-weight: bold;">
                <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Amount:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; text-align: center;">
            <p>Please process this order as soon as possible.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Admin email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending admin email:", error);
    return false;
  }
};

// Function to send order confirmation email to customer
exports.sendOrderConfirmationEmail = async (order) => {
  try {
    // Format items for email
    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.size || "N/A"}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${item.totalPrice.toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || "testalogixtech@gmail.com",
      to: order.contact.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a86e8; text-align: center;">Thank You for Your Order!</h2>
          <p style="background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
            Your order (${order.orderNumber}) has been received and is being processed.
          </p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Details:</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Shipping Address:</h3>
          <p>${order.address.street},<br>
          ${order.address.city}, ${order.address.state} ${order.address.zipCode}</p>
          
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Items:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Size</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr style="background-color: #f2f2f2; font-weight: bold;">
                <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Amount:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; text-align: center;">
            <p>We'll notify you when your order ships. Thank you for shopping with us!</p>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Customer email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending customer email:", error);
    return false;
  }
};