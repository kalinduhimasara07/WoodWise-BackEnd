import axios from "axios";
import Order from "../models/Order.js";
import nodemailer from "nodemailer"; // Import nodemailer
import { Vonage } from "@vonage/server-sdk";

export async function createOrder(req, res) {
  try {
    // Extract the order data from the request body
    const {
      furnitureItems,
      totalAmount,
      advanceAmount,
      customerInfo,
      orderedBy,
      status,
      millWorker,
      notes,
      isCustom,
      customImage,
    } = req.body;

    // Generate a unique order number
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 }).limit(1);
    let orderNumber = "ORD001"; // Default order number

    if (lastOrder) {
      const lastOrderNumber = parseInt(
        lastOrder.orderNumber.replace("ORD", "")
      );
      orderNumber = `ORD${(lastOrderNumber + 1).toString().padStart(3, "0")}`;
    }

    const customFlag = isCustom === true || isCustom === "true";
    let uploadedImageUrl = "";
    if (customFlag && customImage) {
      uploadedImageUrl = customImage;
    }

    // Create a new order instance
    const newOrder = new Order({
      orderNumber,
      furnitureItems,
      totalAmount,
      advanceAmount,
      customerInfo,
      orderedBy: orderedBy || "Store Manager", // Default value if not provided
      status: status || "Pending", // Default value if not provided
      millWorker: millWorker || "Not Assigned", // Default value if not provided
      notes: notes || "No additional notes", // Default value if not provided
      isCustom: customFlag,
      customImage: uploadedImageUrl,
    });

    // Save the new order to the database
    await newOrder.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    // Query the database to fetch all orders, sorted by the creation date (most recent first)
    const orders = await Order.find().sort({ createdAt: -1 });

    // Check if any orders exist
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Send the orders in the response
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// export async function changeOrderStatus(req, res) {
//   try {
//     // Extract order number and new status from the request body
//     const { orderNumber, newStatus } = req.body;

//     // Define valid statuses
//     const validStatuses = [
//       "Pending",
//       "In Production",
//       "Ready for Delivery",
//       "Completed",
//       "Cancelled",
//     ];

//     // Check if the provided status is valid
//     if (!validStatuses.includes(newStatus)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid status. Valid statuses are: 'Pending', 'In Production', 'Ready for Delivery', 'Completed', 'Cancelled'.",
//       });
//     }

//     // Find the order by orderNumber
//     const order = await Order.findOne({ orderNumber });

//     // Check if the order exists
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: `Order with order number ${orderNumber} not found`,
//       });
//     }

//     // Update the order's status
//     order.status = newStatus;
//     order.updatedAt = Date.now(); // Update the timestamp to the current time

//     // Save the updated order to the database
//     await order.save();

//     // Send a success response
//     res.status(200).json({
//       success: true,
//       message: `Order status for ${orderNumber} updated to '${newStatus}'`,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Error changing order status:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

export async function changePaymentComplete(req, res) {
  try {
    // Extract order number from the request body
    const { orderNumber } = req.body;

    // Find the order by orderNumber
    const order = await Order.findOne({ orderNumber });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with order number ${orderNumber} not found`,
      });
    }

    // Toggle the isPaymentCompleted field
    order.isPaymentCompleted = !order.isPaymentCompleted;
    order.updatedAt = Date.now(); // Update the timestamp to the current time

    // Save the updated order to the database
    await order.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: `Payment status for order ${orderNumber} updated to '${
        order.isPaymentCompleted ? "Completed" : "Pending"
      }'`,
      data: order,
    });
  } catch (error) {
    console.error("Error changing payment status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateOrder(req, res) {
  try {
    // Extract order number and updated data from the request body
    const { orderNumber, updatedData } = req.body;
    // Find the order by orderNumber
    const order = await Order.findOne({ orderNumber });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with order number ${orderNumber} not found`,
      });
    }

    // Update the order with the new data
    Object.assign(order, updatedData);
    order.updatedAt = Date.now(); // Update the timestamp to the current time

    // Save the updated order to the database
    await order.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: `Order ${orderNumber} updated successfully`,
      data: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Create a transporter object using your existing configuration
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function changeOrderStatus(req, res) {
  try {
    const { orderNumber, newStatus } = req.body;

    const validStatuses = [
      "Pending",
      "In Production",
      "Ready for Delivery",
      "Completed",
      "Cancelled",
    ];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: 'Pending', 'In Production', 'Ready for Delivery', 'Completed', 'Cancelled'.",
      });
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with order number ${orderNumber} not found`,
      });
    }

    order.status = newStatus;
    order.updatedAt = Date.now();

    await order.save();

    // --- Start of New Email Template ---

    // Dynamically generate the list of items for the email
    const itemsHtml = order.furnitureItems
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #eeeeee;">
        <td style="padding: 12px 15px; color: #555555;">${item.sku}</td>
        <td style="padding: 12px 15px; text-align: center; color: #555555;">${
          item.quantity
        }</td>
        <td style="padding: 12px 15px; text-align: right; color: #555555;">LKR ${item.unitPrice.toFixed(
          2
        )}</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: `"WoodWise" <${process.env.EMAIL}>`, // Show your brand name
      to: order.customerInfo.email,
      subject: `An Update on Your WoodWise Order #${orderNumber}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Poppins', Arial, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto; border: 1px solid #dddddd;">
              <tr>
                  <td align="center" style="background-color: #2c3e50; padding: 25px 0;">
                      <h1 style="color: #ffffff; font-family: 'Poppins', sans-serif; margin: 0; font-size: 32px; font-weight: 700;">WoodWise</h1>
                      <p style="color: #bdc3c7; font-family: 'Poppins', sans-serif; font-size: 14px; margin-top: 4px;">Crafting Your Comfort</p>
                  </td>
              </tr>
              <tr>
                  <td bgcolor="#ffffff" style="padding: 40px 30px;">
                      <h2 style="font-family: 'Poppins', sans-serif; color: #2c3e50; font-weight: 600; margin-top: 0;">Hi ${
                        order.customerInfo.name
                      },</h2>
                      <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                          This is an update on your recent order. The status for your order <strong>#${orderNumber}</strong> has been updated to:
                      </p>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
                          <tr>
                              <td align="center" style="background-color: #3498db; border-radius: 5px; padding: 15px;">
                                  <span style="font-size: 20px; font-weight: 600; color: #ffffff; font-family: 'Poppins', sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                                      ${newStatus}
                                  </span>
                              </td>
                          </tr>
                      </table>
                      
                      <h3 style="font-family: 'Poppins', sans-serif; color: #2c3e50; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Order Summary</h3>
                      <table width="100%" style="border-collapse: collapse; font-size: 14px; color: #333333;">
                          <thead>
                              <tr style="background-color: #f8f8f8;">
                                  <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Item</th>
                                  <th style="padding: 12px 15px; text-align: center; font-weight: 600;">Quantity</th>
                                  <th style="padding: 12px 15px; text-align: right; font-weight: 600;">Price</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${itemsHtml}
                          </tbody>
                      </table>
                      <table width="100%" style="border-collapse: collapse; font-size: 16px; margin-top: 20px;">
                           <tr>
                                <td style="text-align: right; padding: 5px 0; font-weight: 600; color: #555;">Total Amount:</td>
                                <td style="text-align: right; padding: 5px 0; width: 120px;">LKR ${order.totalAmount.toFixed(
                                  2
                                )}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding: 5px 0; font-weight: 600; color: #555;">Advance Paid:</td>
                                <td style="text-align: right; padding: 5px 0; width: 120px;">LKR ${order.advanceAmount.toFixed(
                                  2
                                )}</td>
                            </tr>
                            <tr style="font-weight: 700; color: #3498db;">
                                <td style="text-align: right; padding: 8px 0; border-top: 2px solid #eeeeee;">Balance Due:</td>
                                <td style="text-align: right; padding: 8px 0; width: 120px; border-top: 2px solid #eeeeee;">LKR ${(
                                  order.totalAmount - order.advanceAmount
                                ).toFixed(2)}</td>
                            </tr>
                      </table>
                      
                      <h3 style="font-family: 'Poppins', sans-serif; color: #2c3e50; font-weight: 600; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;">Customer Details</h3>
                      <table width="100%" style="font-size: 14px; line-height: 1.8; color: #555555;">
                          <tr>
                              <td style="font-weight: 600; width: 150px; padding: 4px 0;">Shipping Address:</td>
                              <td style="padding: 4px 0;">${
                                order.customerInfo.address
                              }</td>
                          </tr>
                             <tr>
                              <td style="font-weight: 600; padding: 4px 0;">Contact Number:</td>
                              <td style="padding: 4px 0;">${
                                order.customerInfo.contactNumber
                              }</td>
                          </tr>
                      </table>
                      
                      <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-top: 40px;">
                          Thank you for choosing WoodWise. We appreciate your business!
                      </p>
                  </td>
              </tr>
              <tr>
                  <td bgcolor="#2c3e50" style="padding: 20px 30px;" align="center">
                      <p style="margin: 0; color: #bdc3c7; font-size: 12px; line-height: 1.5;">
                          &copy; ${new Date().getFullYear()} WoodWise. All rights reserved.<br>
                          This is an automated notification. Please do not reply to this email.
                      </p>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `,
    };

    // --- End of New Email Template ---

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        // Log the error but don't block the response
        console.error("Error sending order status email:", error);
      } else {
        console.log("Order status email sent successfully: " + info.response);
      }
    });

    res.status(200).json({
      success: true,
      message: `Order status for ${orderNumber} updated to '${newStatus}' and an email notification has been sent.`,
      data: order,
    });
  } catch (error) {
    console.error("Error changing order status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// export async function sendOrderConfirmation(req, res) {
//   const { toPhoneNumber, orderId } = req.body;

//   if (!toPhoneNumber || !orderId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing toPhoneNumber or orderId" });
//   }

//   const message = `Thank you! Your order ${orderId} has been received.`;

//   const apiUrl = "https://smslenz.lk/api/send-sms";

//   const params = {
//     user_id: process.env.SMSLENZ_USER_ID,
//     api_key: process.env.SMSLENZ_API_KEY,
//     sender_id: process.env.SMSLENZ_SENDER_ID,
//     contact: `${toPhoneNumber}`, // Make sure number is in E.164 with "+"
//     message,
//   };

//   try {
//     const response = await axios.post(apiUrl, null, { params });

//     console.log("SMS API Response:", response.data);

//     res.status(200).json({
//       success: true,
//       message: `SMS sent to ${toPhoneNumber}`,
//       data: response.data,
//     });
//   } catch (error) {
//     console.error("SMS sending failed:", error.response?.data || error.message);

//     res.status(500).json({
//       success: false,
//       message: "Failed to send SMS",
//       error: error.response?.data || error.message,
//     });
//   }
// }

export async function sendOrderConfirmation(req, res) {
  const {
    toPhoneNumber,
    orderId,
    orderStatus,
    customerName,
    totalAmount,
    advanceAmount,
    balanceAmount,
  } = req.body;

  if (!toPhoneNumber || !orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing toPhoneNumber or orderId" });
  }

  // --- Phone Number Parser ---
  const formatPhoneNumber = (number) => {
    let cleaned = number.replace(/\D/g, ""); // remove non-digits

    // If number starts with 0, replace with +94
    if (cleaned.startsWith("0")) {
      cleaned = "+94" + cleaned.substring(1);
    }
    // If number already starts with 94 (no +), add +
    else if (cleaned.startsWith("94")) {
      cleaned = "+" + cleaned;
    }
    // If number starts with 7 (like 761231234), add +94
    else if (cleaned.startsWith("7")) {
      cleaned = "+94" + cleaned;
    }

    return cleaned;
  };

  const formattedNumber = formatPhoneNumber(toPhoneNumber);

  const message = `Dear ${customerName}, Your order ${orderId} has been ${orderStatus}. Total amount: ${totalAmount}, Advance amount: ${advanceAmount}, Balance amount: ${balanceAmount}.Thank you for shopping with us!`;

  const apiUrl = "https://smslenz.lk/api/send-sms";

  const params = {
    user_id: process.env.SMSLENZ_USER_ID,
    api_key: process.env.SMSLENZ_API_KEY,
    sender_id: process.env.SMSLENZ_SENDER_ID,
    contact: formattedNumber, // Always E.164 format
    message,
  };

  try {
    const response = await axios.post(apiUrl, null, { params });

    console.log("SMS API Response:", response.data);

    res.status(200).json({
      success: true,
      message: `SMS sent to ${formattedNumber}`,
      data: response.data,
    });
  } catch (error) {
    console.error("SMS sending failed:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send SMS",
      error: error.response?.data || error.message,
    });
  }
}

//change mill worker in order
export async function changeMillWorker(req, res) {
  const { orderNumber, millWorker } = req.body;

  if (!orderNumber || !millWorker) {
    return res
      .status(400)
      .json({ success: false, message: "Missing orderNumber or millWorker" });
  }

  try {
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with order number ${orderNumber} not found`,
      });
    }

    order.millWorker = millWorker;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Mill worker for order ${orderNumber} updated successfully`,
      data: order,
    });
  } catch (error) {
    console.error("Error changing mill worker:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
