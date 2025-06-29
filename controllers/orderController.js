import Order from "../models/Order.js";

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

export async function changeOrderStatus(req, res) {
  try {
    // Extract order number and new status from the request body
    const { orderNumber, newStatus } = req.body;

    // Define valid statuses
    const validStatuses = [
      "Pending",
      "In Production",
      "Ready for Delivery",
      "Completed",
      "Cancelled",
    ];

    // Check if the provided status is valid
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: 'Pending', 'In Production', 'Ready for Delivery', 'Completed', 'Cancelled'.",
      });
    }

    // Find the order by orderNumber
    const order = await Order.findOne({ orderNumber });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with order number ${orderNumber} not found`,
      });
    }

    // Update the order's status
    order.status = newStatus;
    order.updatedAt = Date.now(); // Update the timestamp to the current time

    // Save the updated order to the database
    await order.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: `Order status for ${orderNumber} updated to '${newStatus}'`,
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
